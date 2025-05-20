package com.github.k6mt.surfer.apiscan.core;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;

public class SurferApiAnalyzer {

  private final SurferApiScanner surferApiScanner;

  private static final Set<Class<?>> WRAPPER_TYPES = Set.of(
      Integer.class, Long.class, Double.class, Float.class, Character.class,
      Byte.class, Short.class, Boolean.class, String.class
  );

  public SurferApiAnalyzer(SurferApiScanner surferApiScanner) {
    this.surferApiScanner = surferApiScanner;
  }

  public Map<String, Object> analyzedApi(String methodType, String url) {
    String key = methodType + ":" + url;
    Method method = surferApiScanner.getApiMappingCache().get(key);
    if (method == null) {
      return Map.of("error", "API NOT FOUND");
    }
    return analyzeMethodParameters(method);
  }

  private Map<String, Object> analyzeMethodParameters(Method method) {

    Map<String, Object> result = new HashMap<>();

    List<Map<String, String>> queryParams = new ArrayList<>();
    List<Map<String, String>> pathVariables = new ArrayList<>();
    List<Map<String, String>> headers = new ArrayList<>();
    Map<String, Object> requestBody = new HashMap<>();

    String httpMethod = resolveHttpMethod(method);

    for (Parameter parameter : method.getParameters()) {
      Map<String, String> paramInfo = new HashMap<>();
      if (parameter.isAnnotationPresent(RequestParam.class)) {
        RequestParam annotation = parameter.getAnnotation(RequestParam.class);
        if (!annotation.value().isEmpty()) {
          paramInfo.put("name", annotation.value());
        } else {
          paramInfo.put("name", parameter.getName());
        }
        paramInfo.put("type", parameter.getType().getSimpleName());
        queryParams.add(paramInfo);
      } else if (parameter.isAnnotationPresent(PathVariable.class)) {
        PathVariable annotation = parameter.getAnnotation(PathVariable.class);
        if (!annotation.value().isEmpty()) {
          paramInfo.put("name", annotation.value());
        } else {
          paramInfo.put("name", parameter.getName());
        }
        paramInfo.put("type", parameter.getType().getSimpleName());
        pathVariables.add(paramInfo);
      } else if (parameter.isAnnotationPresent(RequestHeader.class)) {
        RequestHeader annotation = parameter.getAnnotation(RequestHeader.class);
        if (!annotation.value().isEmpty()) {
          paramInfo.put("name", annotation.value());
        } else {
          paramInfo.put("name", parameter.getName());
        }
        paramInfo.put("type", parameter.getType().getSimpleName());
        headers.add(paramInfo);
      } else if (parameter.isAnnotationPresent(RequestBody.class)) {
        Class<?> clazz = parameter.getType();
        String name = parameter.getName();
        if (clazz.isPrimitive() || isWrapper(clazz)) {
          /**
           * If it's a simple type, handle it as a name/type pair
           */
          Map<String, Object> simpleBody = new LinkedHashMap<>();
          simpleBody.put("name", name);
          simpleBody.put("type", clazz.getSimpleName());
          requestBody = simpleBody;
        } else {
          /**
           * If it's a complex type, analyze its structure and include the parameter name
           */
          Map<String, Object> bodyStructure = createBodyFieldInfo(parameter.getParameterizedType());
          bodyStructure.put("name", name);
          requestBody = bodyStructure;
        }
      } else {
        /**
         * If no annotation is present, infer behavior based on Spring's default rules
         */
        Class<?> clazz = parameter.getType();
        String name = parameter.getName();

        if (isSimpleType(clazz)) {
          paramInfo.put("name", name);
          paramInfo.put("type", clazz.getSimpleName());
          /**
           * For POST and others, default to @RequestParam for simple types
           * Spring does not assume @PathVariable without explicit annotation
           */
          if (httpMethod.equals("GET")) {
            queryParams.add(paramInfo);
          } else {
            pathVariables.add(paramInfo);
          }

        } else {
          /**
           * For complex objects, treat as @RequestBody if the method is POST, PUT, or PATCH
           */
          if (httpMethod.matches("POST|PUT|PATCH")) {
            Map<String, Object> structured = createBodyFieldInfo(parameter.getParameterizedType());
            structured.put("name", name);
            requestBody = structured;
          }
        }
      }
    }

    if (!queryParams.isEmpty()) {
      result.put("RequestParam", queryParams);
    }
    if (!pathVariables.isEmpty()) {
      result.put("PathVariable", pathVariables);
    }
    if (!headers.isEmpty()) {
      result.put("RequestHeader", headers);
    }
    if (!requestBody.isEmpty()) {
      result.put("RequestBody", requestBody);
    }

    return result;
  }

  private boolean isWrapper(Class<?> clazz) {
    return WRAPPER_TYPES.contains(clazz);
  }

  private String resolveHttpMethod(Method method) {
      if (method.isAnnotationPresent(org.springframework.web.bind.annotation.GetMapping.class)) {
          return "GET";
      }
      if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PostMapping.class)) {
          return "POST";
      }
      if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PutMapping.class)) {
          return "PUT";
      }
      if (method.isAnnotationPresent(org.springframework.web.bind.annotation.PatchMapping.class)) {
          return "PATCH";
      }
      if (method.isAnnotationPresent(org.springframework.web.bind.annotation.DeleteMapping.class)) {
          return "DELETE";
      }
    return "GET";
  }

  private boolean isSimpleType(Class<?> clazz) {
    return clazz.isPrimitive() || isWrapper(clazz) || clazz == String.class;
  }

  private Map<String, Object> createBodyFieldInfo(Type type) {
    Map<String, Object> result = new LinkedHashMap<>();

    if (type instanceof ParameterizedType) {
      ParameterizedType parameterizedType = (ParameterizedType) type;
      Type rawType = parameterizedType.getRawType();

      if (rawType instanceof Class && (List.class.isAssignableFrom((Class<?>) rawType)
          || Set.class.isAssignableFrom((Class<?>) rawType))) {
        result.put("type", ((Class<?>) rawType).getSimpleName());
        Type elementType = parameterizedType.getActualTypeArguments()[0];
        result.put("element", createBodyFieldInfo(elementType));
        return result;
      } else if (rawType instanceof Class && Map.class.isAssignableFrom((Class<?>) rawType)) {
        result.put("type", "Map");
        Type keyType = parameterizedType.getActualTypeArguments()[0];
        Type valueType = parameterizedType.getActualTypeArguments()[1];
        result.put("keyType", createBodyFieldInfo(keyType));
        result.put("value", createBodyFieldInfo(valueType));
        return result;
      }
    }

    if (type instanceof Class<?>) {
      Class<?> clazz = (Class<?>) type;
      /**
       * For primitive or ignorable types (e.g., String, int, java.time, etc.)
       */
      if (clazz.isPrimitive() || isWrapper(clazz) ||
          clazz.getName().startsWith("java.time") ||
          clazz.getName().startsWith("java.lang")) {
        result.put("type", clazz.getSimpleName());
        return result;
      }

      /**
       * When handling a composite object
       */
      result.put("type", clazz.getSimpleName());

      List<Map<String, Object>> fields = new ArrayList<>();
      for (java.lang.reflect.Field field : clazz.getDeclaredFields()) {
        field.setAccessible(true);
        Type fieldGenericType = field.getGenericType();
        Map<String, Object> fieldMap = new LinkedHashMap<>();
        fieldMap.put("name", field.getName());
        if (fieldGenericType instanceof ParameterizedType) {
          ParameterizedType pt = (ParameterizedType) fieldGenericType;
          Type raw = pt.getRawType();
          if (raw instanceof Class && List.class.isAssignableFrom((Class<?>) raw)) {
            fieldMap.put("type", "List");
            Type elementType = pt.getActualTypeArguments()[0];
            fieldMap.put("element", createBodyFieldInfo(elementType));
          }
        } else {
          Class<?> fieldClass = field.getType();
          if (!fieldClass.isPrimitive() && !isWrapper(fieldClass)
              && !fieldClass.getName().startsWith("java.lang")
              && !fieldClass.getName().startsWith("java.time")) {
            /**
             * Recursion in case of a composite object
             */
            fieldMap.putAll(createBodyFieldInfo(fieldClass));
          } else {
            fieldMap.put("type", fieldClass.getSimpleName());
          }
        }

        fields.add(fieldMap);
      }
      result.put("fields", fields);
      return result;
    }

    /**
     * Unsupported types
     */
    result.put("type", type.getTypeName());
    return result;

  }
}

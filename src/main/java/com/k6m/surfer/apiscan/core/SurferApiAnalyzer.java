package com.k6m.surfer.apiscan.core;

import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SurferApiAnalyzer {

    private final SurferApiScanner surferApiScanner;

    public SurferApiAnalyzer(SurferApiScanner surferApiScanner){
        this.surferApiScanner = surferApiScanner;
    }

    public Map<String, Object> analyzedApi(String methodType, String url){
        String key = methodType+ ":" + url;
        Method method = surferApiScanner.getApiMappingCache().get(key);

        if(method == null){
            return Map.of("error", "API NOT FOUND");
        }

        return analyzeMethodParameters(method);
    }

    private Map<String, Object> analyzeMethodParameters(Method method){
        System.out.println("Method:" +method );

        Map<String, Object> result = new HashMap<>();

        List<Map<String, String>> queryParams = new ArrayList<>();
        List<Map<String, String>> pathVariables = new ArrayList<>();
        List<Map<String, String>> headers = new ArrayList<>();
        List<Map<String, String>> bodyFields = new ArrayList<>();

        for (Parameter parameter : method.getParameters()) {
            if (parameter.isAnnotationPresent(RequestParam.class)) {
                RequestParam annotation = parameter.getAnnotation(RequestParam.class);
                Map<String, String> paramInfo = new HashMap<>();
                paramInfo.put("name", annotation.value());
                paramInfo.put("type", parameter.getType().getSimpleName());
                queryParams.add(paramInfo);
            } else if (parameter.isAnnotationPresent(PathVariable.class)) {
                PathVariable annotation = parameter.getAnnotation(PathVariable.class);
                Map<String, String> paramInfo = new HashMap<>();
                paramInfo.put("name", annotation.value());
                paramInfo.put("type", parameter.getType().getSimpleName());
                pathVariables.add(paramInfo);
            } else if (parameter.isAnnotationPresent(RequestHeader.class)) {
                RequestHeader annotation = parameter.getAnnotation(RequestHeader.class);
                Map<String, String> paramInfo = new HashMap<>();
                paramInfo.put("name", annotation.value());
                paramInfo.put("type", parameter.getType().getSimpleName());
                headers.add(paramInfo);
            } else if (parameter.isAnnotationPresent(RequestBody.class)) {
                Class<?> inputClass = parameter.getType();
                if (Map.class.isAssignableFrom(inputClass)) {
                    /**
                     *  The default type of key is String, and the default type of value is Object
                     */
                    Class<?> keyType = String.class;
                    Class<?> valueType = Object.class;
                    /**
                     *  But they will be changed if type parameters are provided.
                     */
                    if (inputClass.getGenericInterfaces().length > 0) {
                        java.lang.reflect.ParameterizedType genericType = (java.lang.reflect.ParameterizedType) inputClass.getGenericInterfaces()[0];
                        keyType = (Class<?>) genericType.getActualTypeArguments()[0];
                        valueType = (Class<?>) genericType.getActualTypeArguments()[1];
                    }
                    Map<String, String> mapInfo = new HashMap<>();
                    mapInfo.put("name", "");
                    mapInfo.put("type", "Map");
                    mapInfo.put("key", keyType.getSimpleName());
                    mapInfo.put("value", valueType.getSimpleName());
                    bodyFields.add(mapInfo);
                }else{
                    bodyFields = createBodyFieldInfo(inputClass);
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
        if (!bodyFields.isEmpty()) {
            result.put("RequestBody", bodyFields);
        }

        return result;
    }


    private List<Map<String, String>> createBodyFieldInfo(Class<?> bodyTypeClass) {
        List<Map<String,String>> fieldInfoList = new ArrayList<>();

        for (java.lang.reflect.Field field : bodyTypeClass.getDeclaredFields()) {
            Map<String, String> fieldInfo = new HashMap<>();
            fieldInfo.put("name", field.getName());
            fieldInfo.put("type", field.getType().getSimpleName());
            fieldInfoList.add(fieldInfo);
        }

        return fieldInfoList;
    }
}

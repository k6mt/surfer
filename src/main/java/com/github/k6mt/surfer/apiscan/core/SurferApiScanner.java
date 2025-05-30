package com.github.k6mt.surfer.apiscan.core;

import org.reflections.Reflections;
import org.reflections.scanners.Scanners;
import org.reflections.util.ConfigurationBuilder;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.*;

public class SurferApiScanner {

  private final String basePackage;

  private final Map<String, Method> apiMappingCache = new HashMap<>();


  public SurferApiScanner(String basePackage) {
    this.basePackage = basePackage;
  }

  public Map<String, Method> getApiMappingCache() {
    return apiMappingCache;
  }

  public Map<String, List<Map<String, String>>> apiScan() {
    Map<String, List<Map<String, String>>> apis = new HashMap<>();
    try {
      System.out.println("[ApiScanner] Scanning basePackage: " + basePackage);

      Reflections reflections = new Reflections(new ConfigurationBuilder()
          .forPackages(basePackage)
          .addScanners(Scanners.TypesAnnotated));

      Set<Class<?>> controllers = reflections.getTypesAnnotatedWith(RestController.class);

      for (Class<?> controller : controllers) {
        System.out.println("[ApiScanner] Found controller class: " + controller.getName());
        List<Map<String, String>> controllerApi = new ArrayList<>();
        /**
         *  Extract class-level path
         */
        String basePath = "";
        RequestMapping classMapping = controller.getAnnotation(RequestMapping.class);
        if (classMapping != null && classMapping.value().length > 0) {
          basePath = classMapping.value()[0];
        }

        /**
         * Print method path and HTTP method
         */
        for (Method method : controller.getDeclaredMethods()) {
          String methodPath = getPath(method);
          String httpMethod = getHttpMethod(method);

          if (methodPath != null && httpMethod != null) {
            String fullPath = (basePath + methodPath).replaceAll("//+", "/");
            System.out.printf("[%-6s] %s -> %s#%s%n", httpMethod, fullPath,
                controller.getSimpleName(), method.getName());
            Map<String, String> apiInfo = new HashMap<>();
            apiInfo.put("url", fullPath);
            apiInfo.put("method", httpMethod);
            controllerApi.add(apiInfo);
            /**
             * Cache the mapping between (HTTP method + full URL) and the corresponding Java Method
             */
            apiMappingCache.put(httpMethod + ":" + fullPath, method);
          }
        }
        apis.put(controller.getSimpleName(), controllerApi);
      }

    } catch (Exception e) {
      System.err.println("[ApiScanner] Error during scanning: " + e.getMessage());
      e.printStackTrace();
    }
    System.out.println(apis);
    return apis;
  }

  private String getPath(Method method) {
    if (method.isAnnotationPresent(GetMapping.class)) {
      return extractPath(method.getAnnotation(GetMapping.class).value());
    } else if (method.isAnnotationPresent(PostMapping.class)) {
      return extractPath(method.getAnnotation(PostMapping.class).value());
    } else if (method.isAnnotationPresent(PutMapping.class)) {
      return extractPath(method.getAnnotation(PutMapping.class).value());
    } else if (method.isAnnotationPresent(DeleteMapping.class)) {
      return extractPath(method.getAnnotation(DeleteMapping.class).value());
    } else if (method.isAnnotationPresent(RequestMapping.class)) {
      return extractPath(method.getAnnotation(RequestMapping.class).value());
    }
    return null;
  }


  private String getHttpMethod(Method method) {
      if (method.isAnnotationPresent(GetMapping.class)) {
          return "GET";
      }
      if (method.isAnnotationPresent(PostMapping.class)) {
          return "POST";
      }
      if (method.isAnnotationPresent(PutMapping.class)) {
          return "PUT";
      }
      if (method.isAnnotationPresent(DeleteMapping.class)) {
          return "DELETE";
      }
    if (method.isAnnotationPresent(RequestMapping.class)) {
      RequestMethod[] methods = method.getAnnotation(RequestMapping.class).method();
      return methods.length > 0 ? methods[0].name() : "GET";
    }
    return null;
  }

  private String extractPath(String[] paths) {
      if (paths.length == 0) {
          return "";
      }
    return paths[0].startsWith("/") ? paths[0] : "/" + paths[0];
  }
}

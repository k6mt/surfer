package com.k6m.apisuffer.core;


import org.springframework.stereotype.Component;
import org.reflections.Reflections;
import org.reflections.scanners.Scanners;
import org.reflections.util.ConfigurationBuilder;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.Set;

@Component
public class ApiScannerProcessor {

    public void scanApis(String basePackage) {
        try {
            System.out.println("[ApiScanner] Scanning basePackage: " + basePackage);

            Reflections reflections = new Reflections(new ConfigurationBuilder()
                    .forPackages(basePackage)
                    .addScanners(Scanners.TypesAnnotated));

            Set<Class<?>> controllers = reflections.getTypesAnnotatedWith(RestController.class);

            for (Class<?> controller : controllers) {
                System.out.println("[ApiScanner] Found controller class: " + controller.getName());

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
                        System.out.printf("[%-6s] %s -> %s#%s%n", httpMethod, fullPath, controller.getSimpleName(), method.getName());
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("[ApiScanner] Error during scanning: " + e.getMessage());
            e.printStackTrace();
        }
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
        if (method.isAnnotationPresent(GetMapping.class)) return "GET";
        if (method.isAnnotationPresent(PostMapping.class)) return "POST";
        if (method.isAnnotationPresent(PutMapping.class)) return "PUT";
        if (method.isAnnotationPresent(DeleteMapping.class)) return "DELETE";
        if (method.isAnnotationPresent(RequestMapping.class)) {
            RequestMethod[] methods = method.getAnnotation(RequestMapping.class).method();
            return methods.length > 0 ? methods[0].name() : "GET";
        }
        return null;
    }

    private String extractPath(String[] paths) {
        if (paths.length == 0) return "";
        return paths[0].startsWith("/") ? paths[0] : "/" + paths[0];
    }


}

package com.k6m.apisuffer.core;

import com.k6m.apisuffer.config.ConfigProperties;
import java.lang.reflect.Method;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.reflect.MethodSignature;

public class APISufferAspect {

    private final String basePackage;
    private final ConfigProperties configProperties;

    private final APIThreadTracker apiThreadTracker;


    protected APISufferAspect(String basePackage, ConfigProperties configProperties,
			APIThreadTracker apiThreadTracker) {
        this.basePackage = basePackage;
        this.configProperties = configProperties;
		this.apiThreadTracker = apiThreadTracker;
	}

    @Around("execution(* *(..))")
    public Object traceAllMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        if (!isEnabled() && !isInBasePackage(joinPoint)) {
            return joinPoint.proceed();
        }
        return traceMethodExecution(joinPoint);
    }

    private boolean isInBasePackage(ProceedingJoinPoint joinPoint) {
        String targetPackage = joinPoint.getSignature().getDeclaringType().getPackageName();
        return basePackage.startsWith(targetPackage);
    }

    private boolean isEnabled() {
        return configProperties.isEnabled();
    }

    private Object traceMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        if (shouldSkipMethod(method)) {
            return joinPoint.proceed();
        }

        String className = method.getDeclaringClass().getName();
        String methodName = method.getName();
        Object[] args = joinPoint.getArgs();
        ApiCallMetadata apiCallMetadata = new ApiCallMetadata(className, methodName,args);

        try {
            apiThreadTracker.startCall(apiCallMetadata);
            Object result = joinPoint.proceed();
            apiCallMetadata.updateReturnValue(result);
            return result;
        } catch (Throwable t) {
            apiCallMetadata.updateException(t);
            throw t;
        } finally {
            apiThreadTracker.endCall(apiCallMetadata);
        }
    }

    private boolean shouldSkipMethod(Method method) {
        String methodName = method.getName();
        return methodName.equals("toString") ||
                methodName.equals("hashCode") ||
                methodName.equals("equals") ||
                method.getDeclaringClass().getName().startsWith("org.slf4j") ||
                method.getDeclaringClass().getName().startsWith("ch.qos.logback");
    }
}

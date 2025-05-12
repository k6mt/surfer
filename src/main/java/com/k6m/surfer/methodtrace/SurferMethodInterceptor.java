package com.k6m.surfer.methodtrace;

import jakarta.servlet.http.HttpServletRequest;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class SurferMethodInterceptor implements MethodInterceptor {

  private final String basePackage;
  private final Tracer tracer;

  public SurferMethodInterceptor(String basePackage, Tracer tracer) {
    this.basePackage = basePackage;
    this.tracer = tracer;
  }

  @Override
  public Object invoke(MethodInvocation invocation) throws Throwable {
    String traceId = extractTraceId();

    if (traceId == null) {
      return invocation.proceed();
    }

    Object result = null;

    try {
      tracer.begin(traceId, invocation);
      result = invocation.proceed();
    } catch (Exception e) {
      Trace trace = tracer.getTraceHolder().get();
      trace.setExceptionMessage(e.getMessage());
      throw e;
    } finally {
      tracer.end(result);
    }

    return result;
  }

  private String extractTraceId() {
    ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    if (attributes == null) {
      return null;
    }

    HttpServletRequest request = attributes.getRequest();
    return request.getHeader("X-Surfer-Header");
  }
}

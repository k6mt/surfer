package com.k6m.surfer.methodtrace;

import com.k6m.surfer.error.core.ErrorInfo;
import com.k6m.surfer.util.SourceCapture;
import com.k6m.surfer.error.repository.ErrorRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class SurferMethodInterceptor implements MethodInterceptor {

  private final String basePackage;
  private final Tracer tracer;
  private final SourceCapture sourceCapture;
  private final ErrorRepository errorRepository;

  public SurferMethodInterceptor(String basePackage, Tracer tracer, SourceCapture sourceCapture,
      ErrorRepository errorRepository) {
    this.basePackage = basePackage;
    this.tracer = tracer;
    this.sourceCapture = sourceCapture;
    this.errorRepository = errorRepository;
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

      ErrorInfo errorInfo = sourceCapture.captureErrorContext(e, invocation.getArguments());
      errorRepository.storeError(traceId, errorInfo);
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

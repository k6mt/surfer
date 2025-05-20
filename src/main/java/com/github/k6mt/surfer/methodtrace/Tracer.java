package com.github.k6mt.surfer.methodtrace;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.aopalliance.intercept.MethodInvocation;

public class Tracer {

  private final Map<String, Trace> traceMap = new ConcurrentHashMap<>();
  private final ThreadLocal<Trace> traceHolder = new ThreadLocal<>();

  public void begin(String traceId, MethodInvocation invocation) {
    Trace trace = traceHolder.get();

    String className = invocation.getMethod().getDeclaringClass().getName();
    String methodName = invocation.getMethod().getName();
    Object[] parameters = invocation.getArguments();

    if (trace == null) {
      traceHolder.set(new Trace(traceId, className, methodName, parameters));
      traceMap.put(traceId, traceHolder.get());
    } else {
      Trace newTrace = trace.createNextTrace(className, methodName, parameters);
      traceHolder.set(newTrace);
    }

    // todo add filter info from thread stacktrace -> reset depth
  }

  public void end(Object result) {
    Trace trace = traceHolder.get();

    Long endTimeMs = System.currentTimeMillis();
    Long resultTimeMs = endTimeMs - trace.getStartTimeMs();

    trace.setEndTimeMs(endTimeMs);
    trace.setResultTimeMs(resultTimeMs);
    trace.setReturnValue(result);

    if (trace.getPreviousTrace() == null) {
      traceHolder.remove();
    } else {
      traceHolder.set(trace.getPreviousTrace());
    }
  }

  public Map<String, Trace> getTraceMap() {
    return traceMap;
  }

  public ThreadLocal<Trace> getTraceHolder() {
    return traceHolder;
  }
}


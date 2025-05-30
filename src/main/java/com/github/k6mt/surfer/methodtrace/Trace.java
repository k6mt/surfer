package com.github.k6mt.surfer.methodtrace;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

public class Trace {

  private String traceId;
  private int depth;
  private String className;
  private String methodName;
  private Long startTimeMs;
  private Long endTimeMs;
  private Long resultTimeMs;
  private Object[] parameters;
  private Object returnValue;
  @JsonIgnore
  private Trace previousTrace;
  private String exceptionMessage;
  private List<Trace> nextTraces;

  public Trace(String traceId, String className, String methodName, Object[] parameters) {
    this.traceId = traceId;
    this.depth = 0;
    this.nextTraces = new ArrayList<>();
    this.previousTrace = null;
    this.className = className;
    this.methodName = methodName;
    this.startTimeMs = System.currentTimeMillis();
    this.parameters = parameters;
  }

  private Trace(Trace previousTrace, String className, String methodName, Object[] parameters) {
    this.traceId = previousTrace.traceId;
    this.depth = previousTrace.depth + 1;
    this.nextTraces = new ArrayList<>();
    this.previousTrace = previousTrace;
    this.className = className;
    this.methodName = methodName;
    this.startTimeMs = System.currentTimeMillis();
    this.parameters = parameters;
  }

  public Trace createNextTrace(String className, String methodName, Object[] parameters) {
    Trace nextTrace = new Trace(this, className, methodName, parameters);
    this.getNextTraces().add(nextTrace);
    return nextTrace;
  }


  public String getTraceId() {
    return traceId;
  }

  public int getDepth() {
    return depth;
  }

  public List<Trace> getNextTraces() {
    return nextTraces;
  }

  public String getClassName() {
    return className;
  }

  public String getMethodName() {
    return methodName;
  }

  public Long getStartTimeMs() {
    return startTimeMs;
  }

  public Long getEndTimeMs() {
    return endTimeMs;
  }

  public Long getResultTimeMs() {
    return resultTimeMs;
  }

  public Object[] getParameters() {
    return parameters;
  }

  public Object getReturnValue() {
    return returnValue;
  }

  public Trace getPreviousTrace() {
    return previousTrace;
  }

  public String getExceptionMessage() {
    return exceptionMessage;
  }

  public void setReturnValue(Object returnValue) {
    this.returnValue = returnValue;
  }

  public void setResultTimeMs(Long resultTimeMs) {
    this.resultTimeMs = resultTimeMs;
  }

  public void setEndTimeMs(Long endTimeMs) {
    this.endTimeMs = endTimeMs;
  }

  public void setExceptionMessage(String exceptionMessage) {
    this.exceptionMessage = exceptionMessage;
  }
}

package com.k6m.surfer.analysis.core;

public class MethodAnalysisResponse {

  private String traceId;
  private String rootMethod;
  private Long executionTimeMs;
  private String analysisResult;

  // No-args constructor
  public MethodAnalysisResponse() {
  }

  // All-args constructor
  public MethodAnalysisResponse(String traceId, String rootMethod, Long executionTimeMs, String analysisResult) {
    this.traceId = traceId;
    this.rootMethod = rootMethod;
    this.executionTimeMs = executionTimeMs;
    this.analysisResult = analysisResult;
  }

  // Getters and Setters
  public String getTraceId() {
    return traceId;
  }

  public void setTraceId(String traceId) {
    this.traceId = traceId;
  }

  public String getRootMethod() {
    return rootMethod;
  }

  public void setRootMethod(String rootMethod) {
    this.rootMethod = rootMethod;
  }

  public Long getExecutionTimeMs() {
    return executionTimeMs;
  }

  public void setExecutionTimeMs(Long executionTimeMs) {
    this.executionTimeMs = executionTimeMs;
  }

  public String getAnalysisResult() {
    return analysisResult;
  }

  public void setAnalysisResult(String analysisResult) {
    this.analysisResult = analysisResult;
  }
}
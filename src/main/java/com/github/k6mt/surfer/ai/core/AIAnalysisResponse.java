package com.github.k6mt.surfer.ai.core;

/**
 * DTO for AI analysis response
 */
public class AIAnalysisResponse {

  private String traceId;
  private String analysis;

  // Default constructor for serialization
  public AIAnalysisResponse() {
  }

  public AIAnalysisResponse(String traceId, String analysis) {
    this.traceId = traceId;
    this.analysis = analysis;
  }

  // Getters and setters
  public String getTraceId() {
    return traceId;
  }

  public void setTraceId(String traceId) {
    this.traceId = traceId;
  }

  public String getAnalysis() {
    return analysis;
  }

  public void setAnalysis(String analysis) {
    this.analysis = analysis;
  }
}
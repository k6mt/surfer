package com.github.k6mt.surfer.error.controller;

import com.github.k6mt.surfer.ai.core.AIAnalysisResponse;
import com.github.k6mt.surfer.error.core.ErrorAnalysisService;
import com.github.k6mt.surfer.error.core.ErrorInfo;
import com.github.k6mt.surfer.error.repository.ErrorRepository;

import com.github.k6mt.surfer.util.ApiUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/errors")
public class ErrorController {

  private final ErrorRepository errorRepository;
  private final ErrorAnalysisService errorAnalysisService;

  public ErrorController(ErrorRepository errorRepository,
      ErrorAnalysisService errorAnalysisService) {
    this.errorRepository = errorRepository;
    this.errorAnalysisService = errorAnalysisService;
  }

  /**
   * Get only error information without AI analysis
   */
  @GetMapping("")
  public ApiUtils.ApiResult<?> getErrorInfo(@RequestHeader(name = "X-Surfer-Header") String traceId) {
    ErrorInfo errorInfo = errorRepository.getError(traceId);

    if (errorInfo == null) {
      return ApiUtils.error("Error with trace ID: " + traceId + " not found", HttpStatus.NOT_FOUND);
    }

    return ApiUtils.success(errorInfo);
  }

  /**
   * Get only AI analysis for an error
   */
  @GetMapping("/analysis")
  public ApiUtils.ApiResult<?> getErrorAnalysis(@RequestHeader(name = "X-Surfer-Header") String traceId) {
    ErrorInfo errorInfo = errorRepository.getError(traceId);

    if (errorInfo == null) {
      return ApiUtils.error("Error with trace ID: " + traceId + " not found", HttpStatus.NOT_FOUND);
    }

    String aiAnalysis = errorAnalysisService.analyzeError(errorInfo);
    AIAnalysisResponse response = new AIAnalysisResponse(traceId, aiAnalysis);

    return ApiUtils.success(response);
  }

}
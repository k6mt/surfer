package com.github.k6mt.surfer.analysis.controller;


import com.github.k6mt.surfer.analysis.core.MethodAnalysisResponse;
import com.github.k6mt.surfer.analysis.core.MethodFlowAnalysisService;
import com.github.k6mt.surfer.methodtrace.Trace;
import com.github.k6mt.surfer.methodtrace.Tracer;
import com.github.k6mt.surfer.util.ApiUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/method-analysis")
public class MethodAnalysisController {

  private final Tracer tracer;
  private final MethodFlowAnalysisService analysisService;

  public MethodAnalysisController(Tracer tracer, MethodFlowAnalysisService analysisService) {
    this.tracer = tracer;
    this.analysisService = analysisService;
  }

  @GetMapping("")
  public ApiUtils.ApiResult<?> analyzeMethodFlow(@RequestHeader(name = "X-Surfer-Header") String traceId) {
    Trace trace = tracer.getTraceMap().get(traceId);

    if (trace == null) {
      return ApiUtils.error("Trace with ID: " + traceId + " not found", HttpStatus.NOT_FOUND);
    }

    String analysis = analysisService.analyzeMethodFlow(trace);

    MethodAnalysisResponse response = new MethodAnalysisResponse(
        traceId,
        trace.getClassName() + "." + trace.getMethodName(),
        trace.getResultTimeMs(),
        analysis
    );

    return ApiUtils.success(response);
  }


}
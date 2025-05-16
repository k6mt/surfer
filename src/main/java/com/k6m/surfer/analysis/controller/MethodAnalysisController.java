package com.k6m.surfer.analysis.controller;



import com.k6m.surfer.analysis.core.MethodAnalysisResponse;
import com.k6m.surfer.analysis.core.MethodFlowAnalysisService;
import com.k6m.surfer.methodtrace.Trace;
import com.k6m.surfer.methodtrace.Tracer;
import com.k6m.surfer.util.ApiUtils;
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

    @GetMapping("/{traceId}")
    public ApiUtils.ApiResult<?> analyzeMethodFlow(@PathVariable(name = "traceId") String traceId) {
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
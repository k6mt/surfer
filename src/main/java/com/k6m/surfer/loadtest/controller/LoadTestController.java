package com.k6m.surfer.loadtest.controller;

import com.k6m.surfer.loadtest.core.LoadGenerator;
import com.k6m.surfer.loadtest.core.MetricsCollector;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/load")
public class LoadTestController {

    private final LoadGenerator loadGenerator;

    public LoadTestController(LoadGenerator loadGenerator) {
        this.loadGenerator = loadGenerator;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testLoad() {
        return ResponseEntity.ok("Load test is running");
    }

    @PostMapping("/start")
    public ResponseEntity<String> startLoad(@RequestParam("url") String url,
                                            @RequestParam("method") String method,
                                            @RequestParam(value = "body", required = false) String body,
                                            @RequestParam("threadCount") int threadCount,
                                            @RequestParam("requestPerSecond") int requestPerSecond,
                                            @RequestParam("durationSeconds") int durationSeconds) {
        MetricsCollector.reset();

        loadGenerator.start(url, method, body, threadCount, requestPerSecond, durationSeconds);
        return ResponseEntity.ok("Load test started");
    }

    @PostMapping("/stop")
    public ResponseEntity<String> stopLoad() {
        loadGenerator.stop();
        return ResponseEntity.ok("Load test stopped");
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("successCount", MetricsCollector.getSuccessCount());
        metrics.put("failureCount", MetricsCollector.getFailureCount());
        metrics.put("averageResponseTimeMs", MetricsCollector.getAverageResponseMillis());
        return ResponseEntity.ok(metrics);
    }
}

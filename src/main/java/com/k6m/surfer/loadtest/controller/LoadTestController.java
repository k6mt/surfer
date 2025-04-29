package com.k6m.surfer.loadtest.controller;

import com.k6m.surfer.Config;
import com.k6m.surfer.CsvConverter;
import com.k6m.surfer.logger.RequestLog;
import com.k6m.surfer.loadtest.core.LoadGenerator;
import com.k6m.surfer.loadtest.core.MetricsCollector;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/load")
public class LoadTestController {

  private final LoadGenerator loadGenerator;
  private final CsvConverter csvConverter;
  private final Config config;

  public LoadTestController(LoadGenerator loadGenerator, CsvConverter csvConverter, Config config) {
    this.config = config;
    this.loadGenerator = loadGenerator;
    this.csvConverter = csvConverter;
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

    try {
      RequestLog requestLog = new RequestLog(
          UUID.randomUUID().toString(),
          url,
          RequestLog.HttpMethod.valueOf(method.toUpperCase()),
          LocalDateTime.now(),
          body
      );

      Path filePath = Paths.get(
          config.getHome().getLoadTestHistoryDirectory().getAbsolutePath(),
          "load_test_log.csv"
      );

      csvConverter.writeCsv(
          config.getHome().getLoadTestHistoryDirectory().toPath(),
          List.of(requestLog)
      );
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to start load test");
    }


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

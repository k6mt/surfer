package com.github.k6mt.surfer.loadtest.controller;

import com.github.k6mt.surfer.config.HomeConfig;
import com.github.k6mt.surfer.util.CsvConverter;
import com.github.k6mt.surfer.logger.RequestLog;
import com.github.k6mt.surfer.loadtest.core.LoadGenerator;
import com.github.k6mt.surfer.loadtest.core.MetricsCollector;
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
  private final HomeConfig homeConfig;

  public LoadTestController(LoadGenerator loadGenerator, CsvConverter csvConverter,
      HomeConfig homeConfig) {
    this.homeConfig = homeConfig;
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
          LocalDateTime.now().toString(),
          body
      );

      Path filePath = Paths.get(
          homeConfig.getHome().getLoadTestHistoryDirectory().getAbsolutePath(),
          "load_test_log.csv"
      );

      csvConverter.writeCsv(
          filePath,
          List.of(requestLog)
      );
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to start load test");
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
    metrics.put("isRunning", loadGenerator.isRunning());
    return ResponseEntity.ok(metrics);
  }
}

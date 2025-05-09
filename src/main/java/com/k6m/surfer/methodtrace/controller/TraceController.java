package com.k6m.surfer.methodtrace.controller;

import com.k6m.surfer.config.HomeConfig;
import com.k6m.surfer.logger.RequestLog;
import com.k6m.surfer.methodtrace.Trace;
import com.k6m.surfer.methodtrace.Tracer;
import com.k6m.surfer.util.CsvConverter;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trace")
public class TraceController {

  private final Tracer tracer;
  private final CsvConverter csvConverter;
  private final HomeConfig homeConfig;

  public TraceController(Tracer tracer, HomeConfig homeConfig, CsvConverter csvConverter) {
    this.tracer = tracer;
    this.homeConfig = homeConfig;
    this.csvConverter = csvConverter;
  }

  @GetMapping("")
  public ResponseEntity<Trace> getTrace(@RequestHeader("X-Surfer-Header") String traceId,
      @RequestParam("url") String url,
      @RequestParam("method") String method,
      @RequestParam(value = "body", required = false) String body) {

    try {
      RequestLog requestLog = new RequestLog(
          UUID.randomUUID().toString(),
          url,
          RequestLog.HttpMethod.valueOf(method.toUpperCase()),
          LocalDateTime.now(),
          body
      );
      Path filePath = Paths.get(
          homeConfig.getHome().getAPIHistoryDirectory().getAbsolutePath(),
          "api_trace_log.csv"
      );
      csvConverter.writeCsv(
          filePath,
          List.of(requestLog)
      );
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .build();
    }

    // return trace and remove it from the map
    Trace trace = tracer.getTraceMap().remove(traceId);

    if (trace == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(trace);
  }

  @GetMapping("/history")
  public ResponseEntity<List<RequestLog>> getHistory() {
    try{
      File historyDir = homeConfig.getHome().getAPIHistoryDirectory();
      File traceLogFile = new File(historyDir, "api_trace_log.csv");
      String path = traceLogFile.getAbsolutePath();

      return ResponseEntity.status(HttpStatus.OK).body(csvConverter.readCsv(
          path,
          RequestLog.class));
    }catch (Exception e){
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}

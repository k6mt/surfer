package com.k6m.surfer.methodtrace.controller;

import com.k6m.surfer.methodtrace.Trace;
import com.k6m.surfer.methodtrace.Tracer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trace")
public class TraceController {

  private final Tracer tracer;

  public TraceController(Tracer tracer) {
    this.tracer = tracer;
  }

  @GetMapping("")
  public ResponseEntity<Trace> getTrace(@RequestHeader("X-Surfer-Header") String traceId) {
    // return trace and remove it from the map
    Trace trace = tracer.getTraceMap().remove(traceId);
    if (trace == null) {
      return ResponseEntity.notFound().build();
    } else {
      return ResponseEntity.ok(trace);
    }
  }
}

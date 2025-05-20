package com.github.k6mt.surfer.apiscan.controller;

import com.github.k6mt.surfer.apiscan.core.SurferApiAnalyzer;
import com.github.k6mt.surfer.apiscan.core.SurferApiScanner;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/scan")
public class ApiScanController {

  private final SurferApiScanner surferApiScanner;
  private final SurferApiAnalyzer surferApiAnalyzer;

  public ApiScanController(SurferApiScanner surferApiScanner,
      SurferApiAnalyzer surferApiAnalyzer) {
    this.surferApiScanner = surferApiScanner;
    this.surferApiAnalyzer = surferApiAnalyzer;
  }

  @GetMapping("")
  public ResponseEntity<Map<String, Object>> analyze(@RequestParam("methodType") String methodType,
      @RequestParam("encodeUrl") String encodeUrl) {
    String url = URLDecoder.decode(encodeUrl, StandardCharsets.UTF_8);
    return ResponseEntity.ok(surferApiAnalyzer.analyzedApi(methodType, url));
  }

  @GetMapping("/list")
  public ResponseEntity<Map<String, List<Map<String, String>>>> scan() {
    return ResponseEntity.ok(surferApiScanner.apiScan());
  }


}

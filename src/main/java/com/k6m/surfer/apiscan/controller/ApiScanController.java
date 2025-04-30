package com.k6m.surfer.apiscan.controller;

import com.k6m.surfer.apiscan.core.SurferApiAnalyzer;
import com.k6m.surfer.apiscan.core.SurferApiScanner;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/scan")
public class ApiScanController {

  private final SurferApiScanner surferApiScanner;
  private final SurferApiAnalyzer surferApiAnalyzer;

  // temporary map
  HashMap<String, Object> map = new HashMap<>();

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
  public ResponseEntity<List<Map<String, String>>> scan() {
    return ResponseEntity.ok(surferApiScanner.apiScan());
  }

  @GetMapping("/trace")
  public ResponseEntity<Object> trace(@RequestHeader String UUID) {
    Object result = map.get(UUID);
    if (result == null) {
      return ResponseEntity.status(404).body("UUID not found");
    }
    return ResponseEntity.ok(result);
  }
}

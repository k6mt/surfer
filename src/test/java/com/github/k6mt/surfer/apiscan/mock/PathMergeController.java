package com.github.k6mt.surfer.apiscan.mock;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/base")
public class PathMergeController {

  @GetMapping("/one")
  public String one() {
    return "one";
  }

  @PostMapping("two")
  public String two() {
    return "two";
  }
}

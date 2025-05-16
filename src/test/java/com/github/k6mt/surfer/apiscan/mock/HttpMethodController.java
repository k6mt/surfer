package com.github.k6mt.surfer.apiscan.mock;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/http")
public class HttpMethodController {

  @GetMapping("/get")
  public String get() {
    return "get";
  }

  @PostMapping("/post")
  public String post() {
    return "post";
  }

  @PutMapping("/put")
  public String put() {
    return "put";
  }

  @DeleteMapping("/delete")
  public String delete() {
    return "delete";
  }

  @RequestMapping(value = "/request", method = RequestMethod.PATCH)
  public String request() {
    return "request";
  }
}

package com.k6m.surfer.apiscan.mock;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class SampleController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello";
    }

    @PostMapping("/submit")
    public String submit(@RequestBody String body) {
        return "Submitted";
    }
}

package com.k6m.surfer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * packageName    : com.k6m.surfer.controller
 * fileName       : HelloController
 * author         : cheonbi
 * date           : 25. 4. 29.
 * description    :
 */


@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }
}

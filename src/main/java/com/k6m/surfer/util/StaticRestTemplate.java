package com.k6m.surfer.util;

import org.springframework.web.client.RestTemplate;

public class StaticRestTemplate {

  private static RestTemplate instance = new RestTemplate();

  public static RestTemplate getInstance() {
    return instance;
  }

}

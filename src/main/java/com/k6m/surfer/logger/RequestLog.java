package com.k6m.surfer.logger;

import com.k6m.surfer.util.LocalDateTimeConverter;
import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;

import java.time.LocalDateTime;

public class RequestLog extends Log {

  @CsvBindByName(column = "requestId", required = true)
  private String requestId;

  @CsvBindByName(column = "url", required = true)
  private String url;

  @CsvBindByName(column = "httpMethod", required = true)
  private HttpMethod httpMethod;

  @CsvCustomBindByName(column = "timestamp", converter = LocalDateTimeConverter.class)
  private LocalDateTime requestTime;

  @CsvBindByName(column = "requestBody", required = false)
  private String requestBody;

  public enum HttpMethod {
    GET, POST, PUT, DELETE, HEAD, OPTIONS
  }

  public RequestLog(String requestId, String url, HttpMethod httpMethod, LocalDateTime requestTime, String requestBody) {
    this.requestId = requestId;
    this.url = url;
    this.httpMethod = httpMethod;
    this.requestTime = requestTime;
    this.requestBody = requestBody;
  }

  public RequestLog() {
  }

  public String getRequestId() {
    return requestId;
  }

  public void setRequestId(String requestId) {
    this.requestId = requestId;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public HttpMethod getHttpMethod() {
    return httpMethod;
  }

  public void setHttpMethod(HttpMethod httpMethod) {
    this.httpMethod = httpMethod;
  }

  public LocalDateTime getRequestTime() {
    return requestTime;
  }

  public void setRequestTime(LocalDateTime requestTime) {
    this.requestTime = requestTime;
  }

  public String getRequestBody() {
    return requestBody;
  }

  public void setRequestBody(String requestBody) {
    this.requestBody = requestBody;
  }
}

package com.k6m.surfer.logger;

import com.opencsv.bean.CsvBindByPosition;
import java.time.LocalDateTime;

public class RequestLog extends Log {

  @CsvBindByPosition(position = 0, required = true)
  private String requestId;

  @CsvBindByPosition(position = 1, required = true)
  private String url;

  @CsvBindByPosition(position = 2, required = true)
  private HttpMethod httpMethod;

  @CsvBindByPosition(position = 3, required = true)
  private LocalDateTime requestTime;

  @CsvBindByPosition(position = 4, required = false)
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


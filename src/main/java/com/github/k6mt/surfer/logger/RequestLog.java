package com.github.k6mt.surfer.logger;

import com.opencsv.bean.CsvBindByPosition;

public class RequestLog extends Log {

  @CsvBindByPosition(position = 0, required = true)
  private String requestId;

  @CsvBindByPosition(position = 1, required = true)
  private String url;

  @CsvBindByPosition(position = 2, required = true)
  private HttpMethod httpMethod;

  @CsvBindByPosition(position = 3, required = true)
  private String requestTime;

  @CsvBindByPosition(position = 4, required = false)
  private String requestBody;

  public enum HttpMethod {
    GET, POST, PUT, DELETE, HEAD, OPTIONS
  }

  public RequestLog(String requestId, String url, HttpMethod httpMethod, String requestTime,
      String requestBody) {
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

  public String getRequestTime() {
    return requestTime;
  }

  public void setRequestTime(String requestTime) {
    this.requestTime = requestTime;
  }

  public String getRequestBody() {
    return requestBody;
  }

  public void setRequestBody(String requestBody) {
    this.requestBody = requestBody;
  }

}


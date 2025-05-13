package com.k6m.surfer.error.repository;

import com.k6m.surfer.error.core.ErrorInfo;

public interface ErrorRepository {


  void storeError(String traceId, ErrorInfo errorInfo);

  ErrorInfo getError(String traceId);

  void cleanError(String traceId);
}

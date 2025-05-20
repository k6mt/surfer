package com.github.k6mt.surfer.error.repository;

import com.github.k6mt.surfer.error.core.ErrorInfo;

public interface ErrorRepository {


  void storeError(String traceId, ErrorInfo errorInfo);

  ErrorInfo getError(String traceId);

  void cleanError(String traceId);
}

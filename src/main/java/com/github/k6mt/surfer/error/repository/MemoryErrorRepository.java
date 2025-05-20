package com.github.k6mt.surfer.error.repository;

import com.github.k6mt.surfer.error.core.ErrorInfo;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class MemoryErrorRepository implements ErrorRepository {

  private static final Map<String, ErrorInfo> errorStore = new ConcurrentHashMap<>();

  @Override
  public void storeError(String traceId, ErrorInfo errorInfo) {
    errorStore.put(traceId, errorInfo);
  }

  @Override
  public ErrorInfo getError(String traceId) {
    return errorStore.get(traceId);
  }

  @Override
  public void cleanError(String traceId) {
    errorStore.remove(traceId);
  }
}

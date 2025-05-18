package com.github.k6mt.surfer.loadtest.core;


import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class MetricsCollector {

  private static final ConcurrentMap<String, AtomicLong> successMap    = new ConcurrentHashMap<>();
  private static final ConcurrentMap<String, AtomicLong> failureMap    = new ConcurrentHashMap<>();
  private static final ConcurrentMap<String, AtomicLong> latencyMapNano = new ConcurrentHashMap<>();

  public static void recordSuccess(String testId, long elapsedNano) {
    successMap.computeIfAbsent(testId, id -> new AtomicLong()).incrementAndGet();
    latencyMapNano.computeIfAbsent(testId, id -> new AtomicLong()).addAndGet(elapsedNano);
  }
  public static void recordFailure(String testId) {
    failureMap.computeIfAbsent(testId, id -> new AtomicLong()).incrementAndGet();
  }
  public static void reset(String testId) {
    successMap.remove(testId);
    failureMap.remove(testId);
    latencyMapNano.remove(testId);
  }
  public static long getSuccessCount(String testId) {
    return successMap.getOrDefault(testId, new AtomicLong()).get();
  }
  public static long getFailureCount(String testId) {
    return failureMap.getOrDefault(testId, new AtomicLong()).get();
  }
  public static double getAverageResponseMillis(String testId) {
    long s = getSuccessCount(testId);
    long totalNano = latencyMapNano.getOrDefault(testId, new AtomicLong()).get();
    return s == 0 ? 0 : ((double) totalNano / s) / 1_000_000.0;
  }
}



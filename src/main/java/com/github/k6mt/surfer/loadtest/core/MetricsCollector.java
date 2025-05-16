package com.github.k6mt.surfer.loadtest.core;


import org.springframework.stereotype.Component;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class MetricsCollector {

  private static final AtomicLong successCount = new AtomicLong(0);
  private static final AtomicLong failureCount = new AtomicLong(0);
  private static final AtomicLong totalResponseTimeNano = new AtomicLong(0);

  public static void recordSuccess(long elapsedNano) {
    successCount.incrementAndGet();
    totalResponseTimeNano.addAndGet(elapsedNano);
  }

  public static void recordFailure() {
    failureCount.incrementAndGet();
  }

  public static long getSuccessCount() {
    return successCount.get();
  }

  public static long getFailureCount() {
    return failureCount.get();
  }

  public static double getAverageResponseMillis() {
    long successes = successCount.get();
    return successes == 0 ? 0 : (totalResponseTimeNano.get() / successes) / 1_000_000.0;
  }

  public static void reset() {
    successCount.set(0);
    failureCount.set(0);
    totalResponseTimeNano.set(0);
  }
}



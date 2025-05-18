package com.github.k6mt.surfer.loadtest.core;

import com.github.k6mt.surfer.util.SurferRuntimePort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.concurrent.*;

import org.springframework.http.HttpMethod;
import org.springframework.web.reactive.function.BodyInserters;

@Service
public class LoadGenerator {

    private final SurferRuntimePort surferRuntimePort;
    private final WebClient webClient = WebClient.create();

    private final Map<String, Boolean> runningMap = new ConcurrentHashMap<>();
    private final Map<String, ExecutorService> executorMap = new ConcurrentHashMap<>();
    private final Map<String, ScheduledExecutorService> schedulerMap = new ConcurrentHashMap<>();


    private ExecutorService executorService;
    private volatile boolean running = false;

    private String targetUrl;
    private HttpMethod httpMethod;
    private String requestBody;

    public LoadGenerator(SurferRuntimePort surferRuntimePort) {
        this.surferRuntimePort = surferRuntimePort;
    }

    public void start(String testId, String url, String method, String body,
                      int threadCount, int requestPerSecond, int durationSeconds) {

        //Remove Previous Execution
        if (runningMap.getOrDefault(testId, false)) {
            stop(testId);
        }

        runningMap.put(testId, true);
        ExecutorService exec = Executors.newCachedThreadPool();
        executorMap.put(testId, exec);


        String targetUrl = url;
        HttpMethod httpMethod = HttpMethod.valueOf(method.toUpperCase());
        String requestBody = body;

        // worker 스레드 풀에 요청 작업 제출
        for (int i = 0; i < threadCount; i++) {
            exec.submit(() -> sendRequests(testId, targetUrl, httpMethod, requestBody, requestPerSecond, durationSeconds));
        }

        // durationSeconds 후 자동 정지 스케줄러
        ScheduledExecutorService sched = Executors.newSingleThreadScheduledExecutor();
        schedulerMap.put(testId, sched);
        sched.schedule(() -> {
            stop(testId);
            sched.shutdown();
            System.out.println("[LoadTest][" + testId + "] duration expired. Auto-stopped.");
        }, durationSeconds, TimeUnit.SECONDS);
    }


    /**
     * 특정 testId에 대한 요청 루프
     */
    private void sendRequests(String testId, String targetUrl, HttpMethod httpMethod, String requestBody,
                              int requestPerSecond, int durationSeconds) {

        long endTime = System.currentTimeMillis() + durationSeconds * 1000L;

        while (runningMap.getOrDefault(testId, false) && System.currentTimeMillis() < endTime) {
            for (int i = 0; i < requestPerSecond; i++) {
                long startNano = System.nanoTime();

                String resolvedUrl = resolveUrl(targetUrl);

                WebClient.RequestBodySpec req = webClient.method(httpMethod).uri(resolvedUrl);

                if (httpMethod == HttpMethod.POST || httpMethod == HttpMethod.PUT) {
                    req = (WebClient.RequestBodySpec) req.body(BodyInserters.fromValue(requestBody != null ? requestBody : ""));
                }

                req.retrieve()
                        .toBodilessEntity()
                        .doOnSuccess(response -> {
                            long elapsed = System.nanoTime() - startNano;
                            MetricsCollector.recordSuccess(testId, elapsed);
                        })
                        .doOnError(error -> {
                            MetricsCollector.recordFailure(testId);
                        })
                        .subscribe();

            }

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

    }


  public void stop(String testId) {
    runningMap.put(testId, false);

    ExecutorService exec = executorMap.remove(testId);
    if (exec != null) exec.shutdownNow();

    ScheduledExecutorService schedule = schedulerMap.remove(testId);
    if (schedule != null) schedule.shutdownNow();
  }

  public boolean isRunning(String testId) {
    return runningMap.getOrDefault(testId, false);
  }

  private String resolveUrl(String rawUrl) {
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      return rawUrl;
    }
    return "http://localhost:" + surferRuntimePort.getPort() + rawUrl;
  }

}


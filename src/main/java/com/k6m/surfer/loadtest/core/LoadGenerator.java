package com.k6m.surfer.loadtest.core;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.springframework.http.HttpMethod;
import org.springframework.web.reactive.function.BodyInserters;

@Service
public class LoadGenerator {

    private final WebClient webClient = WebClient.create();
    private final ExecutorService executorService = Executors.newCachedThreadPool();
    private volatile boolean running = false;

    private String targetUrl;
    private HttpMethod httpMethod;
    private String requestBody;

  public void start(String url, String method, String body, int threadCount, int requestPerSecond, int durationSeconds) {
        running = true;
        this.targetUrl = url;
        this.httpMethod = HttpMethod.valueOf(method.toUpperCase());
        this.requestBody = body;

        for (int i = 0; i < threadCount; i++) {
            executorService.submit(() -> sendRequests(requestPerSecond, durationSeconds));
        }
    }

    private void sendRequests(int requestPerSecond, int durationSeconds) {
        long endTime = System.currentTimeMillis() + (durationSeconds * 1000);

        while (running && System.currentTimeMillis() < endTime) {
            for (int i = 0; i < requestPerSecond; i++) {
                long start = System.nanoTime();

                WebClient.RequestBodySpec requestSpec = webClient.method(httpMethod).uri(targetUrl);

                if (httpMethod == HttpMethod.POST || httpMethod == HttpMethod.PUT) {
                    requestSpec = (WebClient.RequestBodySpec) requestSpec.body(BodyInserters.fromValue(requestBody != null ? requestBody : ""));
                }

                requestSpec.retrieve()
                        .toBodilessEntity()
                        .doOnSuccess(response -> {
                            long elapsed = System.nanoTime() - start;
                            MetricsCollector.recordSuccess(elapsed);
                        })
                        .doOnError(error -> {
                            MetricsCollector.recordFailure();
                        })
                        .subscribe();
            }

            try {
                Thread.sleep(1000); // 1초마다 요청
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public void stop() {
        running = false;
    }
}


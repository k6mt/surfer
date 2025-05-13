package com.k6m.surfer.error.core;

import com.k6m.surfer.config.ConfigProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@ConditionalOnProperty(prefix = "surfer.config.ai", name = "provider", havingValue = "anthropic")
public class AnthropicClient implements AIClient {

    private final RestTemplate restTemplate;
    private final ConfigProperties configProperties;

    public AnthropicClient(RestTemplate restTemplate, ConfigProperties configProperties) {
        this.restTemplate = restTemplate;
        this.configProperties = configProperties;
    }

    @Override
    public String getAnalysis(String prompt) {
        if (!configProperties.getAi().isEnabled()) {
            return "AI FEATURE IS DISABLED";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", configProperties.getAi().getApiKey());
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", configProperties.getAi().getModelName());
            requestBody.put("prompt", "\n\nHuman: " + prompt + "\n\nAssistant:");
            requestBody.put("temperature", configProperties.getAi().getTemperature());
            requestBody.put("max_tokens_to_sample", configProperties.getAi().getMaxTokens());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            Map<String, Object> response = restTemplate.postForObject(
                    configProperties.getAi().getApiEndpoint(),
                    request,
                    Map.class
            );

            if (response != null && response.containsKey("completion")) {
                return (String) response.get("completion");
            }
            return "Failed to retrieve AI analysis results.";
        } catch (Exception e) {
            return "Anthropic service error: " + e.getMessage();
        }
    }
}
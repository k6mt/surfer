package com.k6m.surfer.ai.core;

import com.k6m.surfer.config.ConfigProperties;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(prefix = "surfer.config.ai", name = "provider", havingValue = "openai")
public class OpenAIClient implements AIClient {

    private final RestTemplate restTemplate;
    private final ConfigProperties configProperties;

    public OpenAIClient(@Qualifier("surferRestTemplate")RestTemplate restTemplate, ConfigProperties configProperties) {
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
            headers.set("Authorization", "Bearer " + configProperties.getAi().getApiKey());

            Map<String, Object> messageObj = new HashMap<>();
            messageObj.put("role", "user");
            messageObj.put("content", prompt);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", configProperties.getAi().getModelName());
            requestBody.put("messages", List.of(messageObj));
            requestBody.put("temperature", configProperties.getAi().getTemperature());
            requestBody.put("max_tokens", configProperties.getAi().getMaxTokens());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            Map<String, Object> response = restTemplate.postForObject(
                    configProperties.getAi().getApiEndpoint(),
                    request,
                    Map.class
            );

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    if (message != null && message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }
            return "Failed to retrieve AI analysis results.";
        } catch (Exception e) {
            return "OpenAI service error: " + e.getMessage();
        }
    }
}
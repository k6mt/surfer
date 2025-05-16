package com.k6m.surfer.ai.core;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnMissingBean(value = AIClient.class, ignored = DefaultAIClient.class)
public class DefaultAIClient implements AIClient {

    @Override
    public String getAnalysis(String prompt) {
        return "No AI provider configured or provider not supported. Check your configuration.";
    }
}
package com.k6m.surfer.error.core;

import com.k6m.surfer.ai.core.AIClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ErrorAnalysisService {

    private final AIClient aiClient;

    public ErrorAnalysisService(AIClient aiClient) {
        this.aiClient = aiClient;
    }
    
    public String analyzeError(ErrorInfo errorInfo) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Please analyze the following Java error:\n\n");
        prompt.append("Class: ").append(errorInfo.getClassName()).append("\n");
        prompt.append("Method: ").append(errorInfo.getMethodName()).append("\n");
        prompt.append("Error message: ").append(errorInfo.getMessage()).append("\n\n");
        prompt.append("Source code:\n");
        prompt.append("Please provide your analysis in Korean language only. The response should be detailed but easy to understand.");
        
        List<String> sourceLines = errorInfo.getSourceLines();
        int errorLineIndex = errorInfo.getErrorLineIndex();
        
        for (int i = 0; i < sourceLines.size(); i++) {
            if (i == errorLineIndex) {
                prompt.append("=> ");
            } else {
                prompt.append("   ");
            }
            prompt.append(sourceLines.get(i)).append("\n");
        }
        
        prompt.append("\nStack trace:\n").append(errorInfo.getStackTrace());
        
        return aiClient.getAnalysis(prompt.toString());
    }
}
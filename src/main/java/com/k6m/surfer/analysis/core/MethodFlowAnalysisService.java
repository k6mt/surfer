package com.k6m.surfer.analysis.core;

import com.k6m.surfer.ai.core.AIClient;
import com.k6m.surfer.methodtrace.Trace;
import com.k6m.surfer.util.SourceCapture;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MethodFlowAnalysisService {

    private final AIClient aiClient;
    private final SourceCapture sourceCapture;

    public MethodFlowAnalysisService(AIClient aiClient, SourceCapture sourceCapture) {
        this.aiClient = aiClient;
        this.sourceCapture = sourceCapture;
    }

    /**
     * Sends method execution trace with source code to AI for analysis.
     * @param trace Method execution trace
     * @return AI analysis result
     */
    public String analyzeMethodFlow(Trace trace) {
        String prompt = buildAnalysisPrompt(trace);
        return aiClient.getAnalysis(prompt);
    }

    private String buildAnalysisPrompt(Trace trace) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Please analyze the method execution flow and source code below. Identify performance issues, potential bugs, design patterns, and suggest improvements.\n\n");
        prompt.append("Please provide your analysis in Korean language only.");

        // Add method source code
        prompt.append("# Source Code\n");
        String rootMethodSource = sourceCapture.captureMethodSource(trace.getClassName(), trace.getMethodName());
        prompt.append("## Root Method\n");
        prompt.append("```java\n");
        prompt.append(rootMethodSource);
        prompt.append("\n```\n\n");

        // Add called methods source code if needed
        if (trace.getNextTraces() != null && !trace.getNextTraces().isEmpty()) {
            prompt.append("## Called Methods Source\n");
            Map<String, String> capturedSources = new HashMap<>();
            for (Trace nextTrace : trace.getNextTraces()) {
                String key = nextTrace.getClassName() + "." + nextTrace.getMethodName();
                if (!capturedSources.containsKey(key)) {
                    String methodSource = sourceCapture.captureMethodSource(
                        nextTrace.getClassName(), nextTrace.getMethodName());
                    capturedSources.put(key, methodSource);

                    prompt.append("### " + key + "\n");
                    prompt.append("```java\n");
                    prompt.append(methodSource);
                    prompt.append("\n```\n\n");
                }
            }
        }

        // Add execution trace
        prompt.append("# Method Execution Trace\n");
        prompt.append("## Root Method\n");
        prompt.append("- Class: ").append(trace.getClassName()).append("\n");
        prompt.append("- Method: ").append(trace.getMethodName()).append("\n");
        prompt.append("- Execution Time: ").append(trace.getResultTimeMs()).append("ms\n");

        if (trace.getParameters() != null && trace.getParameters().length > 0) {
            prompt.append("- Parameters:\n");
            for (int i = 0; i < trace.getParameters().length; i++) {
                Object param = trace.getParameters()[i];
                prompt.append("  - Parameter ").append(i).append(": ")
                    .append(param != null ? param.toString() : "null").append("\n");
            }
        }

        if (trace.getReturnValue() != null) {
            prompt.append("- Return Value: ").append(trace.getReturnValue().toString()).append("\n");
        }

        if (trace.getExceptionMessage() != null) {
            prompt.append("- Exception Message: ").append(trace.getExceptionMessage()).append("\n");
        }

        if (trace.getNextTraces() != null && !trace.getNextTraces().isEmpty()) {
            prompt.append("\n## Called Sub-Methods\n");
            addNestedTraces(prompt, trace.getNextTraces(), 1);
        }

        return prompt.toString();
    }

    private void addNestedTraces(StringBuilder prompt, List<Trace> traces, int depth) {
        String indent = "  ".repeat(depth);

        for (Trace trace : traces) {
            prompt.append(indent).append("- ").append(trace.getClassName())
                .append(".").append(trace.getMethodName()).append("\n");
            prompt.append(indent).append("  - Execution Time: ").append(trace.getResultTimeMs()).append("ms\n");

            if (trace.getExceptionMessage() != null) {
                prompt.append(indent).append("  - Exception Occurred: ").append(trace.getExceptionMessage()).append("\n");
            }

            if (trace.getNextTraces() != null && !trace.getNextTraces().isEmpty()) {
                prompt.append(indent).append("  - Called Methods:\n");
                addNestedTraces(prompt, trace.getNextTraces(), depth + 2);
            }
        }
    }
}
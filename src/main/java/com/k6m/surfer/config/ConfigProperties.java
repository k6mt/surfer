package com.k6m.surfer.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "surfer.config")
public class ConfigProperties {

  private boolean enabled = true;
  private boolean arguments = true;
  private boolean result = true;
  private String homePath;

  private AI ai = new AI();

  /*
   * Check if the YAML configuration is loaded correctly.
   */
  @PostConstruct
  public void logConfig() {
    System.out.println("📢 ConfigProperties loaded:");
    System.out.println("  enabled = " + enabled);
    System.out.println("  arguments = " + arguments);
    System.out.println("  result = " + result);
    System.out.println("  homePath = " + homePath);

    // AI 설정은 AI가 활성화된 경우에만 상세 로그 출력
    System.out.println("  AI enabled = " + ai.isEnabled());

    if (ai.isEnabled()) {
      System.out.println("  AI settings:");
      System.out.println("    provider = " + ai.getProvider());
      System.out.println("    modelName = " + ai.getModelName());
      System.out.println("    apiEndpoint = " + ai.getApiEndpoint());
      System.out.println("    apiKey = " + (ai.getApiKey() != null ? "[CONFIGURED]" : "[NOT CONFIGURED]"));
      System.out.println("    temperature = " + ai.getTemperature());
      System.out.println("    maxTokens = " + ai.getMaxTokens());
      System.out.println("    errorRetentionDays = " + ai.getErrorRetentionDays());
    }
  }

  public static class AI {
    private boolean enabled = false;
    private String provider = "openai"; // openai, anthropic, azure, etc.
    private String modelName = "gpt-4";
    private String apiEndpoint = "https://api.openai.com/v1/chat/completions";
    private String apiKey;
    private double temperature = 0.7;
    private int maxTokens = 1000;
    private int errorRetentionDays = 7; // 에러 정보 보관 기간 (일)

    // Getter/Setter
    public boolean isEnabled() {
      return enabled;
    }

    public void setEnabled(boolean enabled) {
      this.enabled = enabled;
    }

    public String getProvider() {
      return provider;
    }

    public void setProvider(String provider) {
      this.provider = provider;
    }

    public String getModelName() {
      return modelName;
    }

    public void setModelName(String modelName) {
      this.modelName = modelName;
    }

    public String getApiEndpoint() {
      return apiEndpoint;
    }

    public void setApiEndpoint(String apiEndpoint) {
      this.apiEndpoint = apiEndpoint;
    }

    public String getApiKey() {
      return apiKey;
    }

    public void setApiKey(String apiKey) {
      this.apiKey = apiKey;
    }

    public double getTemperature() {
      return temperature;
    }

    public void setTemperature(double temperature) {
      this.temperature = temperature;
    }

    public int getMaxTokens() {
      return maxTokens;
    }

    public void setMaxTokens(int maxTokens) {
      this.maxTokens = maxTokens;
    }

    public int getErrorRetentionDays() {
      return errorRetentionDays;
    }

    public void setErrorRetentionDays(int errorRetentionDays) {
      this.errorRetentionDays = errorRetentionDays;
    }
  }

  // Getter/Setter
  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public boolean isArguments() {
    return arguments;
  }

  public void setArguments(boolean arguments) {
    this.arguments = arguments;
  }

  public boolean isResult() {
    return result;
  }

  public void setResult(boolean result) {
    this.result = result;
  }

  public String getHomePath() {
    return homePath;
  }

  public void setHomePath(String homePath) {
    this.homePath = homePath;
  }

  public AI getAi() {
    return ai;
  }

  public void setAi(AI ai) {
    this.ai = ai;
  }
}

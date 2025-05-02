package com.k6m.surfer.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "surfer.config")
public class ConfigProperties {

  private boolean enabled = true;
  private boolean arguments = true;
  private boolean result = true;
  private String homePath;

  /*
   * Check if the YAML configuration is loaded correctly.
   */
  @PostConstruct
  public void logConfig() {
    System.out.println("📢 ConfigProperties loaded:");
    System.out.println("  enabled = " + enabled);
    System.out.println("  arguments = " + arguments);
    System.out.println("  result = " + result);
    System.out.println(" homePath = " + homePath);
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
}

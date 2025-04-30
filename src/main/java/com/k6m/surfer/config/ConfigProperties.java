package com.k6m.surfer.config;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "suffer.config")
public class ConfigProperties {

  private boolean enabled = true;
  private boolean arguments = true;
  private boolean result = true;

  /*
   * Check if the YAML configuration is loaded correctly.
   */
  @PostConstruct
  public void logConfig() {
    System.out.println("📢 ConfigProperties loaded:");
    System.out.println("  enabled = " + enabled);
    System.out.println("  arguments = " + arguments);
    System.out.println("  result = " + result);
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
}

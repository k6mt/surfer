package com.k6m.apisuffer.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(ConfigProperties.PREFIX)
public class ConfigProperties {

    /**
     * Config Server properties prefix.
     */
    public static final String PREFIX = "suffer.config";

    /**
     * Flag indicating config is enabled.
     */
    private boolean enabled = true;

    /**
     *  Flag indicating whether to display the input arguments.
     */
    private boolean arguments = true;

    /**
     * Flag indicating whether to display the result.
     */
    private boolean result = true;

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

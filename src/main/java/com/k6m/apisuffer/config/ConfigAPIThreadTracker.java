package com.k6m.apisuffer.config;

import com.k6m.apisuffer.core.APIThreadTracker;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class ConfigAPIThreadTracker {

	@Bean
	public APIThreadTracker apiThreadTracker() {
		return new APIThreadTracker();
	}
}

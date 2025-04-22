package com.k6m.apisuffer.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@EnableConfigurationProperties(ConfigProperties.class)
@ConditionalOnProperty(name = ConfigProperties.PREFIX + ".enabled", matchIfMissing = true)
@Configuration(proxyBeanMethods = false)
@EnableAspectJAutoProxy
public class ConfigAutoConfiguration {

}

package com.github.k6mt.surfer.config;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * packageName    : com.k6m.surfer.config fileName       : SuferSpaAutoConfiguration author
 * : cheonbi date           : 25. 4. 30. description    :
 */

@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@ConditionalOnMissingBean(name = "k6m_surfer")
@AutoConfigureAfter(WebMvcAutoConfiguration.class)
public class SurferSpaAutoConfiguration implements WebMvcConfigurer {

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/k6m-surfer").setViewName("forward:/k6m-surfer/index.html");
    registry.addViewController("/k6m-surfer/").setViewName("forward:/k6m-surfer/index.html");
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/k6m-surfer/**")
        .addResourceLocations("classpath:/META-INF/resources/k6m-surfer/")
        .resourceChain(true)
        .addResolver(new PathResourceResolver() {
          @Override
          protected Resource getResource(String resourcePath, Resource location)
              throws IOException {
            Resource requested = location.createRelative(resourcePath);
            return (requested.exists() && requested.isReadable()) ? requested
                : location.createRelative("index.html");
          }
        });
  }
}

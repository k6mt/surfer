package com.k6m.surfer;

import com.k6m.surfer.apiscan.controller.ApiScanController;
import com.k6m.surfer.apiscan.core.SurferApiAnalyzer;
import com.k6m.surfer.apiscan.core.SurferApiScanner;
import com.k6m.surfer.loadtest.controller.LoadTestController;
import com.k6m.surfer.loadtest.core.LoadGenerator;
import com.opencsv.bean.StatefulBeanToCsv;
import java.io.Writer;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@EnableConfigurationProperties(ConfigProperties.class)
public class SurferAutoConfiguration {

  @Bean
  LoadGenerator loadGenerator() {
    return new LoadGenerator();
  }
  @Bean
  public CsvConverter csvConverter() {
    return new CsvConverter();
  }

  @Bean
  public Config config() {
    return new Config();
  }

  @Bean
  LoadTestController loadTestController(CsvConverter csvConverter, Config config) {
    return new LoadTestController(loadGenerator(), csvConverter, config);
  }

  @Bean
  SurferApiScanner surferApiScanner(){return new SurferApiScanner(detectMainPackage());}

  @Bean
  SurferApiAnalyzer surferApiAnalyzer(SurferApiScanner surferApiScanner){
    return new SurferApiAnalyzer(surferApiScanner);
  };

  @Bean
  ApiScanController apiScanController(SurferApiScanner surferApiScanner, SurferApiAnalyzer surferApiAnalyzer) {
    return new ApiScanController(surferApiScanner, surferApiAnalyzer);
  }

  @Bean
  public Advisor traceAdvisor() {
    AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
    String basePackage = detectMainPackage();

    String expression = basePackage.isBlank()
        ? "execution(public * *(..))"
        : String.format("execution(public * %s..*(..))", basePackage);

    pointcut.setExpression(expression);

    return new DefaultPointcutAdvisor(pointcut, new SurferMethodInterceptor(basePackage));
  }

  private String detectMainPackage() {
    for (StackTraceElement element : Thread.currentThread().getStackTrace()) {
      if (element.getMethodName().equals("main")) {
        String className = element.getClassName();
        int lastDot = className.lastIndexOf('.');
        return lastDot > 0 ? className.substring(0, lastDot) : "";
      }
    }
    return "";
  }


}

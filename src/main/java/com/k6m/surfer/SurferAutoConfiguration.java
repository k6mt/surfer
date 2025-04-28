package com.k6m.surfer;

import com.k6m.surfer.loadtest.controller.LoadTestController;
import com.k6m.surfer.loadtest.core.LoadGenerator;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
public class SurferAutoConfiguration {

  @Bean
  LoadGenerator loadGenerator() {
    return new LoadGenerator();
  }

  @Bean
  LoadTestController loadTestController() {
    return new LoadTestController(loadGenerator());
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

  @Bean
  public ApplicationRunner surferApiScannerRunner(){
    return args -> {
      String basePackage = detectMainPackage();
      new SurferApiScanner(basePackage).apiScan();
    };
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

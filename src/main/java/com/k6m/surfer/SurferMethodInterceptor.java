package com.k6m.surfer;

import java.util.Arrays;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;

public class SurferMethodInterceptor implements MethodInterceptor {
  private final String basePackage;

  public SurferMethodInterceptor(String basePackage) {
    this.basePackage = basePackage;
  }

  @Override
  public Object invoke(MethodInvocation invocation) throws Throwable {
    String method = invocation.getMethod().getDeclaringClass().getName() + "." + invocation.getMethod().getName();
    System.out.println("→ 호출: " + method);
    System.out.println("  파라미터: " + Arrays.toString(invocation.getArguments()));

    System.out.println("------ stackTrace start ------");
    Arrays.stream(Thread.currentThread().getStackTrace())
        .filter(stack -> stack.getClassName().startsWith(basePackage))
        .forEach(System.out::println);
    System.out.println("------ stackTrace end ------");


    Object result = invocation.proceed(); // 실제 메서드 실행
    System.out.println("  결과: " + result); // 실행 결과 출력
    System.out.println("← 종료: " + method);
    return result;
  }
}

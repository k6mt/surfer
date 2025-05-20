package com.github.k6mt.surfer.error.core;

import java.util.List;

public class ErrorInfo {

  private final String className;
  private final String methodName;
  private final int errorLine;
  private final String message;
  private final List<String> sourceLines;
  private final int errorLineIndex;
  private final String stackTrace;
  private final List<Object> arguments;

  public ErrorInfo(
      String className,
      String methodName,
      int errorLine,
      String message,
      List<String> sourceLines,
      int errorLineIndex,
      String stackTrace,
      List<Object> arguments
  ) {
    this.className = className;
    this.methodName = methodName;
    this.errorLine = errorLine;
    this.message = message;
    this.sourceLines = sourceLines;
    this.errorLineIndex = errorLineIndex;
    this.stackTrace = stackTrace;
    this.arguments = arguments;
  }

  public String getClassName() {
    return className;
  }

  public String getMethodName() {
    return methodName;
  }

  public int getErrorLine() {
    return errorLine;
  }

  public String getMessage() {
    return message;
  }

  public List<String> getSourceLines() {
    return sourceLines;
  }

  public int getErrorLineIndex() {
    return errorLineIndex;
  }

  public String getStackTrace() {
    return stackTrace;
  }

  public List<Object> getArguments() {
    return arguments;
  }
}

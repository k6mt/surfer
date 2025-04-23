package com.k6m.apisuffer.core;

import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Map;
import lombok.Getter;

@Getter
public class ApiCallMetadata {

	private String className;
	private String methodName;
	private long startTime;
	private long endTime;
	private Object[] parameters;
	private Object returnValue;
	private Throwable exception;
	private int depth;

	public ApiCallMetadata(String className, String methodName, Object[] parameters) {
		this.className = className;
		this.methodName = methodName;
		this.parameters = parameters;
	}

	public long getDuration() {
		return endTime - startTime;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		String indent = " ".repeat(depth * 2);

		sb.append(indent).append("┌─ ").append(className).append(".").append(methodName).append("()\n");

		if (parameters != null && parameters.length > 0) {
			sb.append(indent).append("│  Parameters: ");
			for (int i = 0; i < parameters.length; i++) {
				sb.append(formatParameter(parameters[i]));
				if (i < parameters.length - 1) sb.append(", ");
			}
			sb.append("\n");
		}

		if (returnValue != null) {
			sb.append(indent).append("│  Return: ").append(formatParameter(returnValue)).append("\n");
		}

		if (exception != null) {
			sb.append(indent).append("│  Exception: ").append(exception.getClass().getName())
					.append(": ").append(exception.getMessage()).append("\n");
		}

		sb.append(indent).append("└─ Duration: ").append(getDuration()).append("ms\n");

		return sb.toString();
	}

	private String formatParameter(Object param) {
		if (param == null) return "null";

		if (param.getClass().isArray()) {
			return formatArray(param);
		} else if (param instanceof Collection<?>) {
			return "Collection[size=" + ((Collection<?>)param).size() + "]";
		} else if (param instanceof Map) {
			return "Map[size=" + ((Map<?,?>)param).size() + "]";
		} else {
			return param.toString();
		}
	}

	private String formatArray(Object array) {
		int length = Array.getLength(array);
		return "Array[size=" + length + "]";
	}

	public void updateStartTime(long startTime) {
		this.startTime = startTime;
	}

	public void updateEndTime(long endTime) {
		this.endTime = endTime;
	}

	public void updateDepth(int depth) {
		this.depth = depth;
	}

	public void updateReturnValue(Object returnValue) {
		this.returnValue = returnValue;
	}

	public void updateException(Throwable exception) {
		this.exception = exception;
	}

}

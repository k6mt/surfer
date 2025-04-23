package com.k6m.apisuffer.core;

import java.util.Date;
import java.util.Stack;
import java.util.logging.ConsoleHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class APIThreadTracker {

	private static final ThreadLocal<Stack<ApiCallMetadata>> CALL_STACK = ThreadLocal.withInitial(
			Stack::new);
	private static final Logger logger = Logger.getLogger(APIThreadTracker.class.getName());

	public void startCall(ApiCallMetadata callMetadata) {
		callMetadata.updateStartTime(System.currentTimeMillis());

		Stack<ApiCallMetadata> stack = CALL_STACK.get();

		callMetadata.updateDepth(stack.size());

		// 스택에 푸시
		stack.push(callMetadata);

		// 로그 출력 (시작)
		logger.info("➤ " + callMetadata.getClassName() + "." + callMetadata.getMethodName() + "() 호출 시작");
	}

	public void endCall(ApiCallMetadata callMetadata) {
		callMetadata.updateEndTime(System.currentTimeMillis());

		// 스택에서 팝
		Stack<ApiCallMetadata> stack = CALL_STACK.get();
		if (!stack.isEmpty()) {
			stack.pop();
		}

		// 로그 출력 (종료 및 상세 정보)
		logger.info(callMetadata.toString());
	}

	public APIThreadTracker() {
		// 로거 설정
		configureLogger();
	}

	private void configureLogger() {
		// 로거 포맷 설정
		Handler consoleHandler = new ConsoleHandler();
		consoleHandler.setFormatter(new SimpleFormatter() {
			private static final String format = "[%1$tF %1$tT] %2$s %n";

			@Override
			public synchronized String format(LogRecord lr) {
				return String.format(format,
						new Date(lr.getMillis()),
						lr.getMessage()
				);
			}
		});

		logger.setUseParentHandlers(false);
		logger.addHandler(consoleHandler);
		logger.setLevel(Level.INFO);
	}
}

package com.k6m.surfer.util;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.springframework.http.HttpStatus;

public class ApiUtils {

    /**
     * Creates a successful API response
     *
     * @param response Response data
     * @param <T>      Type of response data
     * @return ApiResult object containing success status and response data
     */
    public static <T> ApiResult<T> success(T response) {
        return new ApiResult<>(true, response, null);
    }

    /**
     * Creates an error API response from an exception
     *
     * @param throwable The exception that occurred
     * @param status    HTTP status code
     * @return ApiResult object containing error status and error information
     */
    public static ApiResult<?> error(Throwable throwable, HttpStatus status) {
        return new ApiResult<>(false, null, new ApiError(throwable, status));
    }

    /**
     * Creates an error API response from a message
     *
     * @param message Error message
     * @param status  HTTP status code
     * @return ApiResult object containing error status and error information
     */
    public static ApiResult<?> error(String message, HttpStatus status) {
        return new ApiResult<>(false, null, new ApiError(message, status));
    }

    /**
     * Internal class that represents API error information
     */
    public static class ApiError {

        private final String message;
        private final int status;

        ApiError(Throwable throwable, HttpStatus status) {
            this(throwable.getMessage(), status);
        }

        ApiError(String message, HttpStatus status) {
            this.message = message;
            this.status = status.value();
        }

        public String getMessage() {
            return message;
        }

        public int getStatus() {
            return status;
        }

        @Override
        public String toString() {
            return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("message", message)
                .append("status", status)
                .toString();
        }
    }

    /**
     * Internal class that represents API response result
     *
     * @param <T> Type of response data
     */
    public static class ApiResult<T> {

        private final boolean success;
        private final T response;
        private final ApiError error;

        private ApiResult(boolean success, T response, ApiError error) {
            this.success = success;
            this.response = response;
            this.error = error;
        }

        public boolean isSuccess() {
            return success;
        }

        public ApiError getError() {
            return error;
        }

        public T getResponse() {
            return response;
        }

        @Override
        public String toString() {
            return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("success", success)
                .append("response", response)
                .append("error", error)
                .toString();
        }
    }
}
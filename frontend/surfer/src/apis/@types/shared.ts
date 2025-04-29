export namespace Shared {
  export interface ErrorResponse {
    data: null;
    error: {
      code: string;
      message: string;
    };
    success: boolean;
  }

  export interface commonResponse<T> {
    data: T;
    error: null;
    success: boolean;
  }
}

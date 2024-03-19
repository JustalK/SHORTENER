export interface ExceptionType {
  code: string;
  message: string;
}

export interface ExceptionServiceType {
  createException(code: string): ExceptionType;
}

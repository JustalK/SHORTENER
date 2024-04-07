import { ExceptionType } from '@root/types';
export interface ExceptionServiceType {
  createException(code: string): ExceptionType;
}

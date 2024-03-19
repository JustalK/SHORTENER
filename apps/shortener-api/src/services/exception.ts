/**
 * The service for managing everything related to the exception
 * @module ExceptionService
 */

import { ERROR } from '@libs/constants';
import { type ExceptionType, ExceptionServiceType } from '@interfaces/error';

/**
 * Class for managing the exception
 */
class ExceptionService implements ExceptionServiceType {
  /**
   * Create exception based on the code
   * @param code {string} The error code
   * @returns {Object} An object composed of code and error
   */
  createException(code: string): ExceptionType {
    return {
      code,
      message: ERROR[code].MESSAGE,
    };
  }
}

const exceptionService = new ExceptionService();

export default exceptionService;

/**
 * The service for managing everything related to the exception
 * @module ExceptionService
 */

import { ERROR } from '@libs/constants';
import { ExceptionServiceType } from '@interfaces/error.interface';
import { ExceptionType } from '@root/types';

/**
 * Class for managing the exception
 */
class ExceptionService implements ExceptionServiceType {
  private static instance: ExceptionService;

  private constructor() {
    // Cannot be instantiated
  }

  public static getInstance() {
    if (!ExceptionService.instance) {
      ExceptionService.instance = new ExceptionService();
    }

    return ExceptionService.instance;
  }
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

export default ExceptionService.getInstance();

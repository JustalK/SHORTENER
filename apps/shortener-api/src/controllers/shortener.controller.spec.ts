import express from 'express';
import { ShortenerType } from '@root/types/src';
import { ExceptionType } from '@root/types/src';
import { ShortenerController } from './shortener.controller';
import { ShortenerServiceType } from '@interfaces/shortener.interface';
import { ExceptionServiceType } from '@interfaces/error.interface';
import { ShortenerDaoType } from '@interfaces/shortener.interface';
import shortenerModel from '@models/shortener.model';
const httpMocks = require('node-mocks-http');

describe('App', () => {
  let shortenerService: ShortenerServiceType;
  let exceptionService: ExceptionServiceType;
  let shortenerDao: ShortenerDaoType;
  beforeAll(() => {
    shortenerService = {
      shortenUrl: async (longURL: string) => {
        return new shortenerModel({ longURL }) as ShortenerType;
      },
      isExpired: () => {
        return true;
      },
      getShortenUrl: async () => {
        return new shortenerModel() as ShortenerType;
      },
    };
    exceptionService = {
      createException: () => {
        return {
          code: 'X0000',
          message: 'Test Message',
        } as ExceptionType;
      },
    };
    shortenerDao = {
      saveShortURLValidator: async () => {
        return {
          code: 'X0000',
          message: 'Test Message',
        } as ExceptionType;
      },
      redirectToLongURLValidator: () => {
        return {
          code: 'X0000',
          message: 'Test Message',
        } as ExceptionType;
      },
    };
  });
  it('should render successfully', async () => {
    const shortenerController = ShortenerController.getInstance({
      shortenerService,
      exceptionService,
      shortenerDao,
    });

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/user/42',
      body: {
        longURL: 'azazeae',
      },
    });
    const response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    await shortenerController.saveShortURL(request, response);
    expect(response.statusCode).toEqual(500);
    expect(response._getData().error.code).toEqual('X0000');
    expect(response._getData().error.message).toEqual('Test Message');
  });
  it('should render successfully 2', async () => {
    const shortenerController = ShortenerController.getInstance({
      shortenerService,
      exceptionService,
      shortenerDao: {
        saveShortURLValidator: async () => {
          return null;
        },
        redirectToLongURLValidator: () => {
          return {
            code: 'X0000',
            message: 'Test Message',
          } as ExceptionType;
        },
      },
    });

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/user/42',
      body: {
        longURL: 'azazeae',
      },
    });
    const response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    await shortenerController.saveShortURL(request, response);
    expect(response.statusCode).toEqual(200);
    expect(response._getData().longURL).toEqual('azazeae');
    expect(response._getData().shortURL).toBeDefined();
  });
});

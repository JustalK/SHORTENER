import httpMocks from 'node-mocks-http';
import { ShortenerType } from '@root/types/src';
import { ExceptionType } from '@root/types/src';
import { ShortenerController } from './shortener.controller';
import { ShortenerServiceType } from '@interfaces/shortener.interface';
import { ExceptionServiceType } from '@interfaces/error.interface';
import { ShortenerDaoType } from '@interfaces/shortener.interface';
import shortenerModel from '@models/shortener.model';

describe('ShortenerController', () => {
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
  it('[SUCCESS][saveShortURL] Create a shortURL from an longURL', async () => {
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
        longURL: 'https://www.google.com/',
      },
    });
    const response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    await shortenerController.saveShortURL(request, response);
    expect(response.statusCode).toEqual(200);
    expect(response._getData().longURL).toEqual('https://www.google.com/');
    expect(response._getData().shortURL).toBeDefined();
  });
  it('[FAIL][saveShortURL] The validator fail', async () => {
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
  it('[FAIL][saveShortURL] Trigger error on shortenUrl', async () => {
    const shortenerController = ShortenerController.getInstance({
      shortenerService: {
        shortenUrl: async () => {
          throw Error();
        },
        isExpired: () => {
          return true;
        },
        getShortenUrl: async () => {
          return new shortenerModel() as ShortenerType;
        },
      },
      exceptionService: {
        createException: () => {
          return {
            code: 'X0001',
            message: 'Unexpected Message',
          } as ExceptionType;
        },
      },
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
    expect(response.statusCode).toEqual(500);
    expect(response._getData().error.code).toEqual('X0001');
    expect(response._getData().error.message).toEqual('Unexpected Message');
  });
  it.only('[FAIL][redirectToLongURL] The validator fail', async () => {
    const shortenerController = ShortenerController.getInstance({
      shortenerService,
      exceptionService,
      shortenerDao,
    });

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/whatever',
      params: {
        short: 'azazeae',
      },
    });
    const response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    await shortenerController.redirectToLongURL(request, response);
    expect(response.statusCode).toEqual(500);
    expect(response._getData().error.code).toEqual('X0000');
    expect(response._getData().error.message).toEqual('Test Message');
  });
  it('[FAIL][redirectToLongURL] Trigger error on shortenUrl', async () => {
    const shortenerController = ShortenerController.getInstance({
      shortenerService: {
        shortenUrl: async (longURL: string) => {
          return new shortenerModel({ longURL }) as ShortenerType;
        },
        isExpired: () => {
          return true;
        },
        getShortenUrl: async () => {
          throw Error();
        },
      },
      exceptionService: {
        createException: () => {
          return {
            code: 'X0002',
            message: 'Unexpected Message',
          } as ExceptionType;
        },
      },
      shortenerDao: {
        saveShortURLValidator: async () => {
          return null;
        },
        redirectToLongURLValidator: () => {
          return null;
        },
      },
    });

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/whatever',
      params: {
        short: 'azazeae',
      },
    });
    const response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    await shortenerController.redirectToLongURL(request, response);
    expect(response.statusCode).toEqual(500);
    expect(response._getData().error.code).toEqual('X0002');
    expect(response._getData().error.message).toEqual('Unexpected Message');
  });
});

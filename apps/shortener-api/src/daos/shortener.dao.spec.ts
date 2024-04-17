import httpMocks from 'node-mocks-http';
import { ExceptionType } from '@root/types/src';
import { ShortenerDao } from './shortener.dao';
import { ExceptionServiceType } from '@interfaces/error.interface';

describe('ShortenerDao', () => {
  let exceptionService: ExceptionServiceType;
  beforeAll(() => {
    exceptionService = {
      createException: (key: string) => {
        return {
          code: key,
          message: 'Test Message',
        } as ExceptionType;
      },
    };
  });
  it('[SUCCESS][saveShortURLValidator] Send a longURL as google', async () => {
    const shortenerDao = ShortenerDao.getInstance({
      exceptionService,
    });

    const request = httpMocks.createRequest({
      method: 'GET',
      body: {
        longURL: 'https://www.google.com',
      },
    });
    const response = await shortenerDao.saveShortURLValidator(request);
    expect(response).toBeUndefined();
  });
  it('[FAIL][saveShortURLValidator] Send a longURL valid but not reacheable', async () => {
    const shortenerDao = ShortenerDao.getInstance({
      exceptionService,
    });

    const request = httpMocks.createRequest({
      method: 'GET',
      body: {
        longURL: 'https://www.gggoogle.com',
      },
    });
    const response = await shortenerDao.saveShortURLValidator(request);
    expect(response.code).toEqual('X0011');
    expect(response.message).toEqual('Test Message');
  });
  it('[FAIL][saveShortURLValidator] Wrong param sent', async () => {
    const shortenerDao = ShortenerDao.getInstance({
      exceptionService,
    });

    const request = httpMocks.createRequest({
      method: 'GET',
      body: {
        whatever: 'azazeae',
      },
    });
    const response = await shortenerDao.saveShortURLValidator(request);
    expect(response.code).toEqual('X0002');
    expect(response.message).toEqual('Test Message');
  });
  it('[FAIL][saveShortURLValidator] Send a longURL which is not a valid url', async () => {
    const shortenerDao = ShortenerDao.getInstance({
      exceptionService,
    });

    const request = httpMocks.createRequest({
      method: 'GET',
      body: {
        longURL: 'azazeae',
      },
    });
    const response = await shortenerDao.saveShortURLValidator(request);
    expect(response.code).toEqual('X0003');
    expect(response.message).toEqual('Test Message');
  });
  it('[SUCCESS][redirectToLongURLValidator] Wrong param sent', async () => {
    const shortenerDao = ShortenerDao.getInstance({
      exceptionService,
    });

    const request = httpMocks.createRequest({
      method: 'GET',
      params: {
        short: 'azazeae',
      },
    });
    const response = shortenerDao.redirectToLongURLValidator(request);
    expect(response).toBeUndefined();
  });
  it('[FAIL][redirectToLongURLValidator] Create a shortURL from an longURL', async () => {
    const shortenerDao = ShortenerDao.getInstance({
      exceptionService,
    });

    const request = httpMocks.createRequest({
      method: 'GET',
      params: {
        whatever: 'azazeae',
      },
    });
    const response = shortenerDao.redirectToLongURLValidator(request);
    expect(response.code).toEqual('X0006');
    expect(response.message).toEqual('Test Message');
  });
});

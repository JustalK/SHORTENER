import httpMocks from 'node-mocks-http';
import { ServerRoute } from './server.route';

describe('ServerRoute', () => {
  it('[SUCCESS][handleRedirect] Test if the handleRedirect is called', async () => {
    const controller = ServerRoute.getInstance({
      router: {
        get: () => {
          return null;
        },
      } as any,
    });
    const response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    const result = await controller.handleRedirect(null, response);
    expect(result).toBeUndefined();
  });
  it('[SUCCESS][handleHealthcheck] Test if the handleHealthcheck is called', async () => {
    const controller = ServerRoute.getInstance({
      router: {
        get: () => {
          return null;
        },
      } as any,
    });
    const response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter,
    });
    await controller.handleHealthcheck(null, response);
    expect(response._getData().status).toEqual('running');
  });
});

import { ShortenerController } from '@controllers/shortener.controller';
import { ShortenerRoute } from './shortener.route';
import { IRouter } from 'express';

describe('ShortenerRoute', () => {
  let shortenerController: ShortenerController;
  beforeAll(() => {
    shortenerController = {
      saveShortURL: () => {
        return null;
      },
      redirectToLongURL: null,
    } as any;
  });
  it('[SUCCESS][handlePost] Test if the saveShortURL is called', async () => {
    const controller = ShortenerRoute.getInstance({
      shortenerController,
      router: {
        post: () => {
          return null;
        },
      } as any,
    });
    const result = await controller.handlePost(null, null);
    console.log(result);
    expect(result).toBeNull();
  });
});

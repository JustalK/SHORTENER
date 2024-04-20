import { ShortenerController } from '@controllers/shortener.controller';
import { RedirectRoute } from './redirect.route';

describe('RedirectRoute', () => {
  let shortenerController: ShortenerController;
  beforeAll(() => {
    shortenerController = {
      redirectToLongURL: () => {
        return null;
      },
    } as any;
  });
  it('[SUCCESS][handleGet] Test if the redirectToLongURL is called', async () => {
    const controller = RedirectRoute.getInstance({
      shortenerController,
      router: {
        get: () => {
          return null;
        },
      } as any,
    });
    const result = await controller.handleGet(null, null);
    expect(result).toBeNull();
  });
});

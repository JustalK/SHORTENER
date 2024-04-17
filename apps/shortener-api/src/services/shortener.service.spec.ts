import { ShortenerType } from '@root/types/src';
import { ShortenerService } from './shortener.service';
import shortenerModel from '@models/shortener.model';
import {
  ShortenerDbType,
  ShortenerServiceType,
} from '@interfaces/shortener.interface';

describe('ExceptionService', () => {
  let service: ShortenerServiceType;
  let repository: ShortenerDbType;
  beforeAll(() => {
    repository = {
      save: () => {
        return null;
      },
      getByShortUrl: () => {
        return null;
      },
      getByLongUrl: () => {
        return null;
      },
      incrementByShortUrl: () => {
        return null;
      },
      updateByShortUrl: () => {
        return null;
      },
      isExist: () => {
        return null;
      },
      getObj: () => {
        return null;
      },
    };
  });
  it('[SUCCESS][isExpired] Test a shortener not expired', () => {
    service = ShortenerService.getInstance({ repository });
    const shortener = new shortenerModel({
      longURL: 'https://www.google.com',
    }) as ShortenerType;
    const result = service.isExpired(shortener);
    expect(result).toBeFalsy();
  });
  it('[SUCCESS][isExpired] Test a shortener expired', () => {
    service = ShortenerService.getInstance({ repository });
    const d = new Date();
    d.setFullYear(d.getFullYear() - 10);
    const shortener = new shortenerModel({
      longURL: 'https://www.google.com',
      createdDate: d,
    }) as ShortenerType;
    const result = service.isExpired(shortener);
    expect(result).toBeTruthy();
  });
  it('[SUCCESS][shortenUrl] Test a shortener gotten from longURL that exist', async () => {
    const tmpRepository = {
      ...repository,
      isExist: async () => {
        return {
          longURL: [
            new shortenerModel({
              longURL: 'https://www.google3.com',
            }) as ShortenerType,
          ],
          shortURL: [],
        };
      },
      getObj: () => {
        return new shortenerModel({
          longURL: 'https://www.google.com',
        }) as ShortenerType;
      },
      getByLongUrl: async () => {
        return new shortenerModel({
          longURL: 'https://www.google2.com',
        }) as ShortenerType;
      },
    } as ShortenerDbType;
    service = ShortenerService.getInstance({ repository: tmpRepository });
    const result = await service.shortenUrl('https://www.google.com');
    expect(result.longURL).toEqual('https://www.google2.com');
    expect(result.countUsage).toBeDefined();
    expect(result.isArchive).toBeDefined();
    expect(result.shortURL).toBeDefined();
  });
  it('[SUCCESS][shortenUrl] Test a shortener gotten from longURL that exist', async () => {
    const tmpRepository = {
      ...repository,
      isExist: async () => {
        return {
          longURL: [],
          shortURL: [
            new shortenerModel({
              longURL: 'https://www.google3.com',
            }) as ShortenerType,
          ],
        };
      },
      getObj: () => {
        return new shortenerModel({
          longURL: 'https://www.google.com',
        }) as ShortenerType;
      },
      updateByShortUrl: async () => {
        return new shortenerModel({
          longURL: 'https://www.google4.com',
        }) as ShortenerType;
      },
    } as ShortenerDbType;
    service = ShortenerService.getInstance({ repository: tmpRepository });
    const result = await service.shortenUrl('https://www.google.com');
    expect(result.longURL).toEqual('https://www.google4.com');
    expect(result.countUsage).toBeDefined();
    expect(result.isArchive).toBeDefined();
    expect(result.shortURL).toBeDefined();
  });
  it('[SUCCESS][shortenUrl] Test a shortener gotten from longURL that exist', async () => {
    const tmpRepository = {
      ...repository,
      isExist: async () => {
        return {
          longURL: [],
          shortURL: [],
        };
      },
      getObj: () => {
        return new shortenerModel({
          longURL: 'https://www.google.com',
        }) as ShortenerType;
      },
      save: async () => {
        return new shortenerModel({
          longURL: 'https://www.google5.com',
        }) as ShortenerType;
      },
    } as ShortenerDbType;
    service = ShortenerService.getInstance({ repository: tmpRepository });
    const result = await service.shortenUrl('https://www.google.com');
    expect(result.longURL).toEqual('https://www.google5.com');
    expect(result.countUsage).toBeDefined();
    expect(result.isArchive).toBeDefined();
    expect(result.shortURL).toBeDefined();
  });
  it('[SUCCESS][shortenUrl] Test a shortener gotten from longURL that exist', async () => {
    const tmpRepository = {
      ...repository,
      incrementByShortUrl: async () => {
        return new shortenerModel({
          longURL: 'https://www.google.com',
          countUsage: 1,
        }) as ShortenerType;
      },
      getByShortUrl: async () => {
        return new shortenerModel({
          longURL: 'https://www.google.com',
          shortURL: 'wjsdfsddf',
          countUsage: 1,
        }) as ShortenerType;
      },
    } as ShortenerDbType;
    service = ShortenerService.getInstance({ repository: tmpRepository });
    const result = await service.getShortenUrl('wjsdfsddf');
    expect(result.shortURL).toEqual('wjsdfsddf');
    expect(result.longURL).toEqual('https://www.google.com');
    expect(result.countUsage).toEqual(1);
  });
});

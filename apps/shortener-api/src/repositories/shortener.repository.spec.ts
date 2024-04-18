import mongoose from 'mongoose';
import ShortenerModel from '@models/shortener.model';
import { ShortenerRepository } from './shortener.repository';
import { ShortenerType } from '@root/types/src';

describe('ExceptionService', () => {
  let orm: typeof mongoose;
  beforeAll(() => {
    orm = {
      connection: null,
    } as typeof mongoose;
    model = null;
  });
  it('[SUCCESS][getObj] Create an object with getObj', () => {
    const repository = ShortenerRepository.getInstance({
      orm,
      model: ShortenerModel,
    });
    const result = repository.getObj({
      longURL: 'http://www.google.com',
    }) as ShortenerType;
    expect(result._id).toBeDefined();
    expect(result.longURL).toBeDefined();
    expect(result.isArchive).toBeDefined();
    expect(result.createdDate).toBeDefined();
    expect(result.countUsage).toBeDefined();
    expect(result.shortURL).toBeDefined();
    expect(result.id).toBeDefined();
  });
  it('[SUCCESS][getByShortUrl] Get a shortener from a shortURL', async () => {
    const shortener = new ShortenerModel({
      longURL: 'https://www.google.com',
      shortURL: 'qsd4564',
    }) as ShortenerType;
    const repository = ShortenerRepository.getInstance({
      orm,
      model: {
        findOne: async () => {
          return shortener;
        },
      } as typeof ShortenerModel,
    });
    const result = await repository.getByShortUrl(shortener);
    expect(result.longURL).toEqual('https://www.google.com');
    expect(result.shortURL).toEqual('qsd4564');
  });
  it('[SUCCESS][getByLongUrl] Get a shortener from a shortURL', async () => {
    const shortener = new ShortenerModel({
      longURL: 'https://www.google.com',
      shortURL: 'qsd4564',
    }) as ShortenerType;
    const repository = ShortenerRepository.getInstance({
      orm,
      model: {
        findOne: async () => {
          return shortener;
        },
      } as typeof ShortenerModel,
    });
    const result = await repository.getByLongUrl(shortener);
    expect(result.longURL).toEqual('https://www.google.com');
    expect(result.shortURL).toEqual('qsd4564');
  });
  it('[SUCCESS][incrementByShortUrl] Increment', async () => {
    const shortener = new ShortenerModel({
      longURL: 'https://www.google.com',
      shortURL: 'qsd4564',
    }) as ShortenerType;
    const repository = ShortenerRepository.getInstance({
      orm,
      model: {
        findOneAndUpdate: async () => {
          return shortener;
        },
      } as typeof ShortenerModel,
    });
    const result = await repository.incrementByShortUrl(
      shortener,
      'countUsage' as any
    );
    expect(result.longURL).toEqual('https://www.google.com');
    expect(result.shortURL).toEqual('qsd4564');
  });
  it('[SUCCESS][updateByShortUrl] update a shortener by shortURL', async () => {
    const shortener = new ShortenerModel({
      longURL: 'https://www.google.com',
      shortURL: 'qsd4564',
    }) as ShortenerType;
    const repository = ShortenerRepository.getInstance({
      orm,
      model: {
        findOneAndUpdate: async () => {
          return shortener;
        },
      } as typeof ShortenerModel,
    });
    const result = await repository.updateByShortUrl(shortener);
    expect(result.longURL).toEqual('https://www.google.com');
    expect(result.shortURL).toEqual('qsd4564');
  });
  it('[SUCCESS][updateByShortUrl] update a shortener by shortURL', async () => {
    const shortener = new ShortenerModel({
      longURL: 'https://www.google.com',
      shortURL: 'qsd4564',
    }) as ShortenerType;
    const repository = ShortenerRepository.getInstance({
      orm,
      model: {
        aggregate: () => {
          return {
            facet: (test) => {
              return true;
            },
          };
        },
      } as any,
    });
    const result = await repository.isExist({
      longURL: 'https://www.google.com',
      shortURL: 'qsd4564',
    });
    // Dont know how to do for the moment
  });
  it('[SUCCESS][save] Save a shortener in the db', async () => {
    const shortener = new ShortenerModel({
      longURL: 'https://www.google.com',
      shortURL: 'qsd4564',
    }) as ShortenerType;
    const repository = ShortenerRepository.getInstance({
      orm: {
        connection: {
          startSession: () => {
            return {
              startTransaction: () => {
                return true;
              },
              commitTransaction: async () => {
                return true;
              },
              endSession: () => {
                return true;
              },
            };
          },
        },
      } as any,
      model: {
        create: async (data) => {
          const { longURL, shortURL } = data[0];
          return [new ShortenerModel({ longURL, shortURL })];
        },
      } as typeof ShortenerModel,
    });
    const result = await repository.save(shortener);
    expect(result.longURL).toEqual('https://www.google.com');
    expect(result.shortURL).toEqual('qsd4564');
  });
  it('[FAIL][save] Fail to save a shortener ', async () => {
    const shortener = new ShortenerModel({
      longURL: 'https://www.google.com',
      shortURL: 'qsd4564',
    }) as ShortenerType;
    const repository = ShortenerRepository.getInstance({
      orm: {
        connection: {
          startSession: () => {
            return {
              startTransaction: () => {
                return true;
              },
              abortTransaction: async () => {
                return true;
              },
            };
          },
        },
      } as any,
      model: {
        create: null,
      } as typeof ShortenerModel,
    });
    const result = await repository.save(shortener);
    expect(result).toBeUndefined();
  });
});

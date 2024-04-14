import ENVIRONMENT from '@src/environment';

describe('Environment test', () => {
  it('Test if some value has been set', () => {
    expect(typeof ENVIRONMENT.MODE).toBe('string');
  });
});

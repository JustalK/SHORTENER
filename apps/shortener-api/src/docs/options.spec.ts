import options from './options';

describe('Environment test', () => {
  it('Test if some value has been set', () => {
    expect(options.definition.openapi).toEqual('3.1.0');
  });
});

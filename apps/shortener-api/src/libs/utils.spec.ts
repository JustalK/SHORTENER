import utils from './utils';

describe('Utils', () => {
  it('Mode', () => {
    expect(utils.mode('production')).toEqual('production');
    expect(utils.mode(undefined)).toEqual('development');
  });
  it('createRandomString', () => {
    expect(utils.createRandomString(5).length).toEqual(5);
    expect(utils.createRandomString(8).length).toEqual(8);
    expect(utils.createRandomString(31).length).toEqual(21);
  });
});

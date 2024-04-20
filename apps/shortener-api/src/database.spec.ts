import { Database } from '@src/database';

describe('Database test', () => {
  it('Test if init has been called during initialization', () => {
    const init = jest
      .spyOn(Database.prototype, 'init')
      .mockImplementation(() => console.log('test'));
    const consoleSpy = jest.spyOn(console, 'log');
    const database = new Database('mongodb://127.0.0.1:27017?replicaSet=rs0');
    expect(consoleSpy).toHaveBeenCalledWith('test');
    expect(init).toHaveBeenCalled();
    database.close();
  });
});

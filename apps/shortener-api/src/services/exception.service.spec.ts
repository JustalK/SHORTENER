import exceptionService from './exception.service';

describe('ExceptionService', () => {
  it('CreateException', () => {
    const service = exceptionService.createException('X0011');
    expect(service.code).toEqual('X0011');
    expect(service.message).toBeDefined();
  });
});

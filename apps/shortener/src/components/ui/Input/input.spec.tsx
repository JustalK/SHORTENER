import { render } from '@testing-library/react';

import Input from './Input';

// nx test shortener -- --silent=false
describe('Input', () => {
  it('Test Input creation', () => {
    const { container } = render(
      <Input
        dataCy="testData"
        name="testName"
        value="valTest"
        onChange={() => {
          return true;
        }}
      />
    );
    expect(
      container.getElementsByTagName('input')[0].getAttribute('name')
    ).toEqual('testName');
    expect(
      container.getElementsByTagName('input')[0].getAttribute('data-cy')
    ).toEqual('testData');
    expect(container.getElementsByTagName('input')[0].value).toEqual('valTest');
    expect(container.getElementsByTagName('input').length).toBe(1);
  });
});

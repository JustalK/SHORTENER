import React from 'react';
import { render } from '@testing-library/react';

import Card from './Card';

// nx test shortener -- --silent=false
describe('Card', () => {
  it('Test Card creation', () => {
    const { container } = render(<Card className="my-class-test">Test</Card>);
    expect(
      container.getElementsByClassName('my-class-test')[0].innerHTML
    ).toEqual('Test');
    expect(container.getElementsByClassName('my-class-test').length).toBe(1);
  });
});

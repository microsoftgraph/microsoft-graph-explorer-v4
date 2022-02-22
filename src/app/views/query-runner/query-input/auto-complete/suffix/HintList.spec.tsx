import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { HintList } from './HintList';
import { IHint } from './suffix-util';

afterEach(cleanup);
const renderHintList = (): any => {
  const hints: IHint[] = [
    {
      link: {
        url: 'https://www.microsoft.com/office',
        name: 'MS'
      },
      description: 'Sample hint suggestion'
    }
  ]
  return render(
    <HintList hints={hints} />
  )
}

// eslint-disable-next-line no-console
console.warn = jest.fn()
describe('Tests hint suggestions', () => {
  it('Renders hint list without crashing', () => {
    renderHintList();
  })
})
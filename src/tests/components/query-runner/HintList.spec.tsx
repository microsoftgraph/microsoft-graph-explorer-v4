import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { HintList } from '../../../app/views/query-runner/query-input/auto-complete/suffix/HintList';
import { IHint } from '../../../app/views/query-runner/query-input/auto-complete/suffix/suffix-util';

afterEach(cleanup);
const renderHintList = () : any => {
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
    <HintList hints={hints}/>
  )
}

describe('Tests hint suggestions', () => {
  it('Renders hint list without crashing', () => {
    renderHintList();
  })
})
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import HeadersList from '../../../../app/views/query-runner/request/headers/HeadersList';
import { Header } from '../../../../types/query-runner';

afterEach(cleanup);
const renderHeadersList = () => {
  const headers : Header[] = [
    {
      name: 'Content-Type',
      value: 'application/json'
    },
    {
      name: 'consistencyLevel',
      value: 'eventual'
    }
  ]
  return render(
    <HeadersList handleOnHeaderDelete={jest.fn()} headers = {headers} messages={''}/>
  )
}

// eslint-disable-next-line no-console
console.warn = jest.fn()

describe('Tests HeadersList component', () => {
  it('Renders HeadersList without crashing', () => {
    renderHeadersList();
  })
})
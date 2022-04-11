import { IHistoryItem } from '../../../../types/history';
import { writeHistoryData, readHistoryData, removeHistoryData, bulkRemoveHistoryData } from './history-utils';

describe('Tests history utils', () => {
  it('Returns history data', async () => {
    const historyItem: IHistoryItem = {
      index: 0,
      statusText: 'OK',
      responseHeaders: [],
      result: {},
      url: 'https://api.github.com/search/users?q=tom',
      createdAt: '2020-04-01T00:00:00.000Z',
      method: 'GET',
      headers: [],
      duration: 200,
      status: 200
    }
    await writeHistoryData(historyItem);
    const historyData = await readHistoryData();
    expect(historyData).toBeDefined();
  });

  it('Removes history data', async () => {
    const historyItem: IHistoryItem = {
      index: 0,
      statusText: 'OK',
      responseHeaders: [],
      result: {},
      url: 'https://api.github.com/search/users?q=tom',
      createdAt: '2020-04-01T00:00:00.000Z',
      method: 'GET',
      headers: [],
      duration: 200,
      status: 200
    }
    await writeHistoryData(historyItem);
    const result = await removeHistoryData(historyItem);
    expect(result).toBeTruthy();
  });

  it('Removes bulk of history data and returns undefined because history data is unavailable', async () => {
    const historyData = [
      {
        index: -1,
        statusText: 'OK',
        responseHeaders: [],
        result: {},
        url: 'https://api.github.com/search/users?q=tom',
        createdAt: '2020-04-01T00:00:00.000Z',
        method: 'GET',
        headers: [],
        duration: 200,
        status: 200
      },
      {
        index: -1,
        statusText: 'OK',
        responseHeaders: [],
        result: {},
        url: 'https://api.github.com/search/users?q=tom',
        createdAt: '2020-04-01T00:00:00.000Z',
        method: 'GET',
        headers: [],
        duration: 200,
        status: 200
      }
    ]
    const listOfKeys = historyData.map(item => item.createdAt);
    const result = await bulkRemoveHistoryData(listOfKeys);
    expect(result).toBeUndefined();
  });
})
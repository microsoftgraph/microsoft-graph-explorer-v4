import { IHistoryItem } from '../../types/history';
import { historyCache } from './history-utils';


let historyItems: IHistoryItem[] = [];
jest.mock('localforage', () => {
  return {
    createInstance: jest.fn(() => {
      return {
        setItem: jest.fn((item: IHistoryItem) => {
          historyItems.push(item);
        }),
        getItem: jest.fn((creationTime: string) => {
          return historyItems.find(item => item.createdAt === creationTime);
        }),
        removeItem: jest.fn((creationTime: string) => {
          historyItems.splice(historyItems.findIndex(item => item.createdAt === creationTime), 1);
        }),
        iterate: jest.fn(() => {
          return Promise.resolve();
        }),
        keys: jest.fn(() => {
          return historyItems.map(item => item.createdAt)
        })
      }
    })
  }
});


describe('History utils should', () => {
  it('return history data after new history data is added', async () => {
    const historyItem: IHistoryItem = {
      index: 0,
      statusText: 'OK',
      responseHeaders: [],
      result: {},
      url: 'https://api.github.com/search/users?q=tom',
      createdAt: new Date().toUTCString(),
      method: 'GET',
      headers: [],
      duration: 200,
      status: 200
    }
    expect(historyItems.length).toBe(0);
    await historyCache.writeHistoryData(historyItem);
    const historyData = await historyCache.readHistoryData();
    expect(historyData.length).toBe(1);
  });

  it('remove history item from list of history items and return new list', async () => {
    const historyItem: IHistoryItem = {
      index: 1,
      statusText: 'OK',
      responseHeaders: [],
      result: {},
      url: 'https://api.github.com/search/users?q=tom',
      createdAt: new Date().toString(),
      method: 'GET',
      headers: [],
      duration: 200,
      status: 200
    }
    await historyCache.writeHistoryData(historyItem);
    expect(historyItems.length).toBe(2);
    await historyCache.removeHistoryData(historyItem);
    expect(historyItems.length).toBe(1);
  });

  it('should return unexpired history items', async () => {
    historyItems = []
    const historyItem: IHistoryItem = {
      index: 4,
      statusText: 'OK',
      responseHeaders: [],
      result: {},
      url: 'https://api.github.com/search/users?q=tom',
      createdAt: '2019-06-22T08:09:06.852Z',
      method: 'GET',
      headers: [],
      duration: 200,
      status: 200
    }
    historyItems.push(historyItem);
    expect(historyItems.length).toBe(1);
    const historyData = await historyCache.readHistoryData();
    expect(historyData.length).toBe(0);
  });
})
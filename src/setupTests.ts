import { GlobalWithFetchMock } from 'jest-fetch-mock';

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock'); // tslint:disable-line
customGlobal.fetchMock = customGlobal.fetch;

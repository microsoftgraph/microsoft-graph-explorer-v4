import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'jest-canvas-mock';

const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock'); // tslint:disable-line
customGlobal.fetchMock = customGlobal.fetch;
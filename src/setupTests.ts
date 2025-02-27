import { GlobalWithFetchMock } from 'jest-fetch-mock';
import 'jest-canvas-mock';
import crypto from 'crypto';

const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock'); // tslint:disable-line
customGlobal.fetchMock = customGlobal.fetch;

Object.defineProperty(global, 'crypto', {
  writable: true,
  value: {
    getRandomValues: (arr: Uint8Array) => crypto.getRandomValues(arr),
    subtle: {}
  }
});

// Mock MSAL
jest.mock('@azure/msal-browser');
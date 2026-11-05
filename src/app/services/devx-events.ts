import { createAction } from '@reduxjs/toolkit';
import { IDevxAPI } from '../../types/devx-api';
import { ISampleQuery } from '../../types/query-runner';
import { IResource } from '../../types/resources';

export const devxConfigurationChanged = createAction<{
  configuration: IDevxAPI;
  samples?: ISampleQuery[];
  resources?: { [version: string]: IResource };
}>('devxApi/configurationChanged');

export const devxAccountSynced = createAction<{ accountKey: string; eligible: boolean }>('devxApi/accountSynced');

export const devxErrorCleared = createAction('devxApi/errorCleared');

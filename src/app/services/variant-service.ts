/* eslint-disable max-len */
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { VariantAssignmentClientSettings } from 'expvariantassignmentsdk/src/contracts/VariantAssignmentClientSettings';
import { VariantAssignmentServiceClient } from 'expvariantassignmentsdk/src/contracts/VariantAssignmentServiceClient';
import { VariantAssignmentRequest } from 'expvariantassignmentsdk/src/interfaces/VariantAssignmentRequest';

import { errorTypes, telemetry } from '../../telemetry';
import { readFromLocalStorage, saveToLocalStorage } from '../utils/local-storage';
import { EXP_URL } from './graph-constants';

interface TasResponse {
  Id: string;
  Parameters: Parameters;
}
interface Parameters {
  [key: string]: string | boolean | number;
}

class VariantService {

  private endpoint = EXP_URL;
  private expResponse: TasResponse[] | null = [];
  private assignmentContext: string = '';

  public async initialize() {
    const settings: VariantAssignmentClientSettings = { endpoint: this.endpoint };
    this.createUser();
    const request: VariantAssignmentRequest =
    {
      parameters: this.getParameters()
    };

    const client = new VariantAssignmentServiceClient(settings);
    try {
      const response = await client.getVariantAssignments(request);
      this.expResponse = response.featureVariables as TasResponse[] | null;
      this.assignmentContext = response.assignmentContext;
    } catch (error) {
      telemetry.trackException(new Error(errorTypes.UNHANDLED_ERROR), SeverityLevel.Error, error as object);
    }
  }

  public createUser() {
    const userid = telemetry.getUserId();
    saveToLocalStorage('userid', userid.toString());
  }

  public getAssignmentContext() {
    return this.assignmentContext;
  }

  public getFeatureVariables(namespace: string, flagname: string) {
    const defaultConfig = this.expResponse?.find(c => c.Id === namespace);
    return defaultConfig?.Parameters[flagname];
  }

  // Parameters will include randomization units (you can have more than one in a single call!)
  // and audience filters like market/region, browser, ismsft etc.,
  private getParameters(): Map<string, string[]> {
    const map: Map<string, string[]> = new Map<string, string[]>();
    map.set('userid', [readFromLocalStorage('userid')]);
    return map;
  }
}

export default new VariantService();
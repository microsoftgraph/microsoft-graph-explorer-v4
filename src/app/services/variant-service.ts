/* eslint-disable max-len */
import { VariantAssignmentRequest } from 'expvariantassignmentsdk/src/interfaces/VariantAssignmentRequest';
import {VariantAssignmentServiceClient} from 'expvariantassignmentsdk/src/contracts/VariantAssignmentServiceClient';
import { VariantAssignmentClientSettings } from 'expvariantassignmentsdk/src/contracts/VariantAssignmentClientSettings';
import { errorTypes, telemetry } from '../../telemetry';
import { readFromLocalStorage, saveToLocalStorage } from '../utils/local-storage';
import { EXP_URL } from './graph-constants';
import { SeverityLevel } from '@microsoft/applicationinsights-web';


interface TasResponse {
  Id: string;
  Parameters: Parameters;
}
interface Parameters {
  [key: string]: string | boolean | number;
}
class VariantService {

  static myInstance: VariantService = null as any;
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
    const response = await client.getVariantAssignments(request);
    Promise.resolve(response).then((r) => {
      if (r){
        this.expResponse = r.featureVariables as TasResponse[] | null;
        this.assignmentContext = r.assignmentContext;
      }
    })
      .catch((error) => {
        telemetry.trackException(new Error(errorTypes.UNHANDLED_ERROR), SeverityLevel.Error, error);
      });
  }

  public createUser() {
    const userid = telemetry.getUserId();
    saveToLocalStorage('userid', userid.toString());
  }

  public getAssignmentContext() {
    return this.assignmentContext;
  }

  public async getFeatureVariables(namespace: string, flagname: string) {
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
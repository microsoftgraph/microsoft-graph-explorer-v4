/* eslint-disable max-len */
import { VariantAssignmentRequest } from 'expvariantassignmentsdk/src/interfaces/VariantAssignmentRequest';
import {VariantAssignmentServiceClient} from 'expvariantassignmentsdk/src/contracts/VariantAssignmentServiceClient';
import { VariantAssignmentClientSettings } from 'expvariantassignmentsdk/src/contracts/VariantAssignmentClientSettings';
import { telemetry } from '../../telemetry';


interface TasResponse {
  Id: string;
  Parameters: Parameters;
}
interface Parameters {
  [key: string]: string | boolean | number;
}
class VariantService {

  static myInstance: VariantService = null as any;
  private endpoint = 'https://default.exp-tas.com/exptas76/9b835cbf-9742-40db-84a7-7a323a77f3eb-gedev/api/v1/tas';
  private expResponse: TasResponse[] | null = [];
  private assignmentContext: string = '';

  public async initialize() {
    const settings: VariantAssignmentClientSettings = { endpoint: this.endpoint };
    const request: VariantAssignmentRequest =
        {
          parameters: this.getParameters()
        };

    const client = new VariantAssignmentServiceClient(settings);
    const response = await client.getVariantAssignments(request);
    Promise.resolve(response).then((r) => {
      this.expResponse = r.featureVariables as TasResponse[] | null;
      this.assignmentContext = r.assignmentContext;
    });
  }

  public getAssignmentContext() {
    return this.assignmentContext;
  }

  public async getFeatureVariables(namespace: string, flagname: string) {
    const defaultConfig = this.expResponse?.find(c => c.Id === namespace);
    return defaultConfig?.Parameters[flagname];
  }

  // Parameters will include randomization units (you can have more than one in a single call!!)
  // and audience filters like market/region, browser, ismsft etc.,
  private getParameters(): Map<string, string[]> {
    const map: Map<string, string[]> = new Map<string, string[]>();
    map.set('userId', [telemetry.getUserId()]);
    return map;
  }
}

export default new VariantService();
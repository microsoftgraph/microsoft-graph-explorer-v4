/* eslint-disable max-len */
import { VariantAssignmentRequest } from 'expvariantassignmentsdk/src/interfaces/VariantAssignmentRequest';
import {VariantAssignmentServiceClient} from 'expvariantassignmentsdk/src/contracts/VariantAssignmentServiceClient';
import { VariantAssignmentClientSettings } from 'expvariantassignmentsdk/src/contracts/VariantAssignmentClientSettings';
import { setToLS, getFromLS } from '../../themes/theme-utils';
import { authenticationWrapper } from '../../modules/authentication';
// import {v4 as uuidv4} from 'uuid';


interface TasResponse {
  Id: string;
  Parameters: Parameters;
}
interface Parameters {
  [key: string]: string | boolean | Number;
}
class VariantService {

  static myInstance: VariantService = null as any;
  private endpoint = 'https://default.exp-tas.com/exptas76/9b835cbf-9742-40db-84a7-7a323a77f3eb-gedev/api/v1/tas';
  private expResponse: TasResponse[] | null = [];
  private assignmentContext: string = '';


  // This is the call which will fetch the assignment response and store the result into a globally accessible variable
  // for the rest of our code to access.
  public async initialize() {
    const settings: VariantAssignmentClientSettings = { endpoint: this.endpoint };
    this.createUser();
    const request: VariantAssignmentRequest =
        {
          parameters: this.getParameters()
        };


    // eslint-disable-next-line max-len
    // We first create a client with the typescript SDK to handle the request. Note that the only setting needed by default,
    // is the endpoint you want to call.
    const client = new VariantAssignmentServiceClient(settings);
    // We then make a call with the required parameters.
    // Parameters will include randomization units (you can have more than one in a single call!!)
    // and audience filters like market/region, browser, ismsft etc.,
    const response = await client.getVariantAssignments(request);
    Promise.resolve(response).then((r) => {
      this.expResponse = r.featureVariables as TasResponse[] | null;
      this.assignmentContext = r.assignmentContext;
      console.log(r.assignmentContext);
    });
  }


  public createUser() {
    // We create a random user profile for our case. Ideally, all these values should be extracted out of
    // the incoming call as part of a middleware or enrichment prior to making the assignment call.
    const clientid = 123456789;
    setToLS('clientid', clientid.toString());

    // For simplicity we also create and store the user session which will be consistent until a restart
    setToLS('sessionid',  !authenticationWrapper.getSessionId());
  }

  public getAssignmentContext() {
    return this.assignmentContext;
  }

  // Here we create a simple constructor for our test application. In real examples, your product might be already integrated with a config
  // provider or an ini file. An alternate approach is to hard-code the values within the context of the code spread across multiple locations.

  public async getFeatureVariables(namespace: string, flagname: string) {
    //The default namespace is created as an example. You can choose to update it later.
    const defaultConfig = this.expResponse?.find(c => c.Id === namespace);
    return defaultConfig?.Parameters[flagname];
  }

  private getParameters(): Map<string, string[]> {
    const map: Map<string, string[]> = new Map<string, string[]>();

    // The response will be randomized based on id
    // if (AppinsightsTelemetry.getTelemetryFlag())
    // {
    //   if (getFromLS('user_id_telemetry') == null)
    //   {
    //     setToLS('user_id_telemetry',uuidv4())
    //   }
    //   map.set('env', [getFromLS('env')]);
    //   map.set('clientid', [getFromLS('user_id_telemetry')]);
    //   map.set('market', [getFromLS('market')]);
    // }
    // else
    // {
    // map.set('env', [getFromLS('env')]);
    map.set('clientid', [getFromLS('clientid')]);
    // map.set('market', [getFromLS('market')]);
    // }

    // You can add additional audience filters to enable running more targeted experiments.
    // In order for these to be useful, you will need to create these audience filters and start some experiments that
    // leverage these values.
    map.set('browser', [getFromLS('browser')]);
    return map;
  }
}

export default new VariantService();
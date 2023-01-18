import { authenticationWrapper } from '../../../modules/authentication';
import { AppAction } from '../../../types/action';
import { IRequestOptions } from '../../../types/request';
import {
  GET_POLICY_ERROR,
  GET_POLICY_PENDING,
  GET_POLICY_SUCCESS
} from '../redux-constants';

interface IPolicyValues {
  email: number,
  screenshot: number,
  feedback: number
}

export function getPoliciesSuccess(response: object): AppAction {
  return {
    type: GET_POLICY_SUCCESS,
    response
  };
}

export function getPoliciesError(response: object): AppAction {
  return {
    type: GET_POLICY_ERROR,
    response
  };
}

export function getPoliciesPending(): AppAction {
  return {
    type: GET_POLICY_PENDING,
    response: null
  };
}

export function getPolicies() {
  return async (dispatch: Function) => {
    try {
      const policyUrl = getPolicyUrl();
      const token = await authenticationWrapper.getOcpsToken();

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token

      };
      const options: IRequestOptions = { headers, method: 'GET' };
      dispatch(getPoliciesPending());


      const response = await fetch(policyUrl, options);
      if (!response.ok) {
        throw response;
      }
      const res = await response.json();
      const policy = getPolicy(res);
      return dispatch(getPoliciesSuccess(policy));
    } catch (error) {
      return dispatch(getPoliciesError({ error }));
    }
  }
}


export function getPolicy(response: any): IPolicyValues {
  const values: IPolicyValues = {
    email: 0,
    screenshot: 0,
    feedback: 0
  };
  const policies = response.value[0]?.policiesPayload;
  if (policies) {
    for (const policiesPayload of policies) {
      if (policiesPayload.settingId.includes('L_EmailCollection')) {
        values.email = parseInt(policiesPayload.value, 10);
      }
      if (policiesPayload.settingId.includes('L_Screenshot')) {
        values.screenshot = parseInt(policiesPayload.value, 10);
      }
      if (policiesPayload.settingId.includes('L_SendFeedback')) {
        values.feedback = parseInt(policiesPayload.value, 10);
      }
    }
  }
  return values;
}

export function getPolicyUrl(): string {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return 'https://sip.clients.config.office.net/user/v1.0/web/policies';
  } else {
    return 'https://clients.config.office.net/user/v1.0/web/policies';
  }
}
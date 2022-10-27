import { GET_POLICY_ERROR, GET_POLICY_PENDING, GET_POLICY_SUCCESS } from '../../../app/services/redux-constants';
import {
  getPoliciesSuccess, getPoliciesError, getPoliciesPending, getPolicies, getPolicy, getPolicyUrl
} from '../../../app/services/actions/ocps-action-creators';
import configureMockStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';
import thunk from 'redux-thunk';
import { authenticationWrapper } from '../../../modules/authentication';
import { AppAction } from '../../../types/action';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

authenticationWrapper.getOcpsToken = jest.fn(() => Promise.resolve('token'));

describe('OCPS action creators', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
  });
  it('should dispatch GET_POLICY_SUCCESS when getPoliciesSuccess(policyObject) is called', () => {
    // Arrange
    const policyObject = {
      email: 1,
      screenshot: 1,
      feedback: 20
    }
    const expectedAction: AppAction = {
      type: GET_POLICY_SUCCESS,
      response: policyObject
    }

    // Act
    const action = getPoliciesSuccess(policyObject);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('should dispatch GET_POLICY_ERROR when getPoliciesError() is called', () => {
    // Arrange
    const error = {};
    const expectedAction: AppAction = {
      type: GET_POLICY_ERROR,
      response: error
    }

    // Act
    const action = getPoliciesError(error);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('should dispatch GET_POLICY_PENDING when getPoliciesPending() is called', () => {
    // Arrange
    const expectedAction: AppAction = {
      type: GET_POLICY_PENDING,
      response: null
    }

    // Act
    const action = getPoliciesPending();

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('should dispatch GET_POLICY_PENDING and GET_POLICY_SUCCESS when getPolicies() is called', () => {
    // Arrange
    const store = mockStore({});
    const expectedActions = [
      {
        type: GET_POLICY_PENDING
      },
      {
        type: GET_POLICY_SUCCESS,
        response: {
          email: 0, screenshot: 0, feedback: 0
        }
      }
    ]
    fetch.mockResponseOnce(JSON.stringify({
      ok: true,
      email: 0,
      screenshot: 0,
      feedback: 0,
      value: [
        { randomValue: 0 }
      ]
    }));
    // @ts-ignore
    store.dispatch(getPolicies())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      })
      .catch((e: Error) => { throw e });
  });

  it('should return policy values when getPolicy()', () => {
    // Arrange
    const response = {
      email: 0,
      screenshot: 0,
      feedback: 0,
      value: [
        {
          policiesPayload: {
            settingId: ['L_EmailCollection', 'L_Screenshot', 'L_SendFeedback'],
            value: '20'
          }
        }
      ]
    }

    // Act
    const policyValues = getPolicy(response)

    // Assert
    expect(policyValues.email).toEqual(0);
    expect(policyValues.screenshot).toEqual(0);
    expect(policyValues.feedback).toEqual(0);
  });

  it('should return a policy url when getPolicyUrl() is called', () => {
    // Arrange
    const url = getPolicyUrl();

    // Assert
    expect(url).toBeTruthy();
  });
})
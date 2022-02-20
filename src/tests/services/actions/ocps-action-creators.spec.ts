import { GET_POLICY_ERROR, GET_POLICY_PENDING, GET_POLICY_SUCCESS } from '../../../app/services/redux-constants';
import {
  getPoliciesSuccess, getPoliciesError, getPoliciesPending, getPolicies, getPolicy, getPolicyUrl
} from '../../../app/services/actions/ocps-action-creators';
import configureMockStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';
import thunk from 'redux-thunk';
import { authenticationWrapper } from '../../../modules/authentication';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

authenticationWrapper.getOcpsToken = jest.fn(() => Promise.resolve('token'));

describe('Tests OCPS action creators', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    fetchMock.resetMocks();
  });
  it('tests response with valid policies object ', () => {
    // Arrange
    const response = {
      email: 1,
      screenshot: 1,
      feedback: 20
    }
    const expectedAction = {
      type: GET_POLICY_SUCCESS,
      response
    }

    // Act
    const action = getPoliciesSuccess(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests the error object response when policies fetch fails', () => {
    // Arrange
    const error = {};
    const expectedAction = {
      type: GET_POLICY_ERROR,
      response: error
    }

    // Act
    const action = getPoliciesError(error);

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('tests get policies pending', () => {
    // Arrange
    const expectedAction = {
      type: GET_POLICY_PENDING
    }

    // Act
    const action = getPoliciesPending();

    // Assert
    expect(action).toEqual(expectedAction);
  })

  it('Tests getPolicies() and returns an empty array', () => {
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

  it('Tests getPolicy which returns policy values', () => {
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

  })

  it('Tests policy url generation', () => {
    // Arrange
    const url = getPolicyUrl();

    // Assert
    expect(url).toBeTruthy();
  })
})
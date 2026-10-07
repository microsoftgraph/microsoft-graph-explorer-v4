jest.mock('../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackException: jest.fn(), getUserId: jest.fn().mockReturnValue('user-123') },
  errorTypes: { UNHANDLED_ERROR: 'UNHANDLED_ERROR' }
}));
jest.mock('../utils/local-storage', () => ({
  readFromLocalStorage: jest.fn().mockReturnValue('user-123'),
  saveToLocalStorage: jest.fn()
}));
jest.mock('./graph-constants', () => ({
  EXP_URL: 'https://exp.example.com'
}));
jest.mock('expvariantassignmentsdk/src/contracts/VariantAssignmentClientSettings', () => ({
  VariantAssignmentClientSettings: jest.fn()
}));
jest.mock('expvariantassignmentsdk/src/contracts/VariantAssignmentServiceClient', () => ({
  VariantAssignmentServiceClient: jest.fn().mockImplementation(() => ({
    getVariantAssignments: jest.fn().mockResolvedValue({
      featureVariables: [
        { Id: 'ns1', Parameters: { flag1: true, flag2: 'value2' } }
      ],
      assignmentContext: 'ctx-123'
    })
  }))
}));
jest.mock('expvariantassignmentsdk/src/interfaces/VariantAssignmentRequest', () => ({}));

import variantService from './variant-service';

describe('VariantService', () => {
  it('returns undefined before initialization', () => {
    const result = variantService.getFeatureVariables('unknown', 'flag');
    expect(result).toBeUndefined();
  });

  it('returns feature variables after initialization', async () => {
    await variantService.initialize();
    expect(variantService.getFeatureVariables('ns1', 'flag1')).toBe(true);
    expect(variantService.getFeatureVariables('ns1', 'flag2')).toBe('value2');
  });

  it('returns assignment context after initialization', async () => {
    await variantService.initialize();
    expect(variantService.getAssignmentContext()).toBe('ctx-123');
  });

  it('returns undefined for non-existent namespace', async () => {
    await variantService.initialize();
    expect(variantService.getFeatureVariables('unknown-ns', 'flag1')).toBeUndefined();
  });
});

describe('campaignDefinitions', () => {
  it('should export campaign definitions array', () => {
    const CampaignDefinitions = require('./campaignDefinitions').default;
    expect(Array.isArray(CampaignDefinitions)).toBe(true);
    expect(CampaignDefinitions.length).toBeGreaterThan(0);
    expect(CampaignDefinitions[0]).toHaveProperty('CampaignId');
  });
});

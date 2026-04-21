import {
  DirectReports, Files, FullPersonCard, Groups,
  InsightsTrending, Messages, Profile, Site, Sites, User, Users
} from './index';

describe('adaptivecards-templates', () => {
  it('exports DirectReports template', () => {
    expect(DirectReports).toBeDefined();
    expect(typeof DirectReports).toBe('object');
  });

  it('exports Files template', () => {
    expect(Files).toBeDefined();
  });

  it('exports FullPersonCard template', () => {
    expect(FullPersonCard).toBeDefined();
  });

  it('exports Groups template', () => {
    expect(Groups).toBeDefined();
  });

  it('exports InsightsTrending template', () => {
    expect(InsightsTrending).toBeDefined();
  });

  it('exports Messages template', () => {
    expect(Messages).toBeDefined();
  });

  it('exports Profile template', () => {
    expect(Profile).toBeDefined();
  });

  it('exports Site template', () => {
    expect(Site).toBeDefined();
  });

  it('exports Sites template', () => {
    expect(Sites).toBeDefined();
  });

  it('exports User template', () => {
    expect(User).toBeDefined();
  });

  it('exports Users template', () => {
    expect(Users).toBeDefined();
  });
});

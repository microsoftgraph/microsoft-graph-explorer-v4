import { getSuggestions } from './suggestions-filter';
import { AutoCompleteOption } from '../../../types/auto-complete';

describe('suggestions-filter', () => {
  const createOptions = (links: string[] = [], values: any[] = []): AutoCompleteOption => ({
    url: 'test',
    parameters: [{
      verb: 'get',
      values,
      links
    }]
  });

  describe('getSuggestions', () => {
    it('should return path options for URL ending with /', () => {
      const options = createOptions(['users', 'groups', 'me']);
      const result = getSuggestions('/', options);
      expect(result).toEqual(['users', 'groups', 'me']);
    });

    it('should return query parameters for URL with ?', () => {
      const values = [
        { name: '$select' },
        { name: '$filter' },
        { name: '$top' }
      ];
      const options = createOptions([], values);
      const result = getSuggestions('users?', options);
      expect(result).toEqual(['$select', '$filter', '$top']);
    });

    it('should return query properties for URL with =', () => {
      const values = [
        { name: '$select', items: ['displayName', 'mail', 'id'] }
      ];
      const options = createOptions([], values);
      const result = getSuggestions('users?$select=', options);
      expect(result).toEqual(['displayName', 'mail', 'id']);
    });

    it('should return empty array when options is null', () => {
      const result = getSuggestions('/', null as any);
      expect(result).toEqual([]);
    });

    it('should return empty array when no parameters match verb', () => {
      const options: AutoCompleteOption = {
        url: 'test',
        parameters: [{
          verb: 'post',
          values: [],
          links: ['users']
        }]
      };
      const result = getSuggestions('/', options);
      expect(result).toEqual([]);
    });

    it('should return empty array when parameters is null', () => {
      const options: AutoCompleteOption = {
        url: 'test',
        parameters: null as any
      };
      const result = getSuggestions('/', options);
      expect(result).toEqual([]);
    });

    it('should return empty array for properties when no matching section', () => {
      const values = [
        { name: '$filter', items: ['id', 'name'] }
      ];
      const options = createOptions([], values);
      const result = getSuggestions('users?$select=', options);
      expect(result).toEqual([]);
    });
  });
});

import { SortOrder } from '../../types/enums';
import { dynamicSort } from './dynamic-sort';
interface INameAge {
  name: string
  age: number
}
describe('Dynamic Sort', () => {

  it('should sort an array of objects in ascending order', () => {
    const arrayToSort = [
      { name: 'Ann', age: 14 },
      { name: 'Lucy', age: 18 },
      { name: 'Diana', age: 11 }
    ];

    const expected = [
      { name: 'Ann', age: 14 },
      { name: 'Diana', age: 11 },
      { name: 'Lucy', age: 18 }
    ];

    const sortedArray = arrayToSort.sort(dynamicSort<INameAge>('name', SortOrder.ASC));
    expect(expected).toEqual(sortedArray);
  });

  it('should sort an array of objects in descending order', () => {
    const arrayToSort = [
      { name: 'Ann', age: 14 },
      { name: 'Lucy', age: 18 },
      { name: 'Diana', age: 11 }
    ];

    const expected = [
      { name: 'Lucy', age: 18 },
      { name: 'Diana', age: 11 },
      { name: 'Ann', age: 14 }
    ];

    const sortedArray = arrayToSort.sort(dynamicSort<INameAge>('name', SortOrder.DESC));
    expect(expected).toEqual(sortedArray);
  });
});

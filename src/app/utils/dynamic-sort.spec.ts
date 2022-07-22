import { dynamicSort } from './dynamic-sort';
import { SortOrder } from '../../types/enums';

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

    const sortedArray = arrayToSort.sort(dynamicSort('name', SortOrder.ASC));
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

    const sortedArray = arrayToSort.sort(dynamicSort('name', SortOrder.DESC));
    expect(expected).toEqual(sortedArray);
  });

  it('should return unsorted object array when property does not exist', () => {
    const arrayToSort = [
      { name: 'Ann', age: 14 },
      { name: 'Lucy', age: 18 },
      { name: 'Diana', age: 11 }
    ];

    const sortedArray = arrayToSort.sort(dynamicSort('gender', SortOrder.DESC));
    expect(arrayToSort).toEqual(sortedArray);
  });

  it('should return unsorted object array when property is empty', () => {
    const arrayToSort = [
      { name: 'Ann', age: 14 },
      { name: 'Lucy', age: 18 },
      { name: 'Diana', age: 11 }
    ];

    const sortedArray = arrayToSort.sort(dynamicSort('', SortOrder.DESC));
    expect(arrayToSort).toEqual(sortedArray);
  });

});

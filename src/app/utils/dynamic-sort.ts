import { SortOrder } from '../../types/enums';
/**
 * Sorts a given array by the passed in property in the direction specified
 * @param {string} property the property to sort the array with
 * @param {SortOrder} sortOrder the direction to follow Ascending / Descending
 * You pass this helper to the array sort function
 */
export function dynamicSort<T>(property: keyof T, sortOrder: SortOrder) {
  let order = 1;
  if (sortOrder === SortOrder.DESC) {
    order = -1;
  }
  if (property) {
    return (first: T, second: T) => {
      const result = (first[property] < second[property]) ? -1 : (first[property] > second[property]) ? 1 : 0;
      return result * order;
    };
  }
  return (first: T, second: T) => {
    const result = (first < second) ? -1 : (first > second) ? 1 : 0;
    return result * order;
  };
}

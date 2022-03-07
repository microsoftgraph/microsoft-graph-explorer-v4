import { generateGroupsFromList } from './generate-groups';

function setUp() {
  return [{
    thumbnail: '//placehold.it/168x168',
    key: 'item-0 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    color: 'green',
    shape: 'circle',
    location: 'Portland',
    width: 168,
    height: 168
  },
  {
    thumbnail: '//placehold.it/214x214',
    key: 'item-1 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    color: 'yellow',
    shape: 'square',
    location: 'New York',
    width: 214,
    height: 214
  },
  {
    thumbnail: '//placehold.it/187x187',
    key: 'item-2 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    color: 'yellow',
    shape: 'square',
    location: 'Chicago',
    width: 187,
    height: 187
  },
  {
    thumbnail: '//placehold.it/241x241',
    key: 'item-3 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    color: 'yellow',
    shape: 'circle',
    location: 'Seattle',
    width: 241,
    height: 241
  },
  {
    thumbnail: '//placehold.it/166x166',
    key: 'item-4 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    color: 'red',
    shape: 'square',
    location: 'New York',
    width: 166,
    height: 166
  },
  {
    thumbnail: '//placehold.it/249x249',
    key: 'item-5 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    color: 'blue',
    shape: 'circle',
    location: 'Portland',
    width: 249,
    height: 249
  },
  {
    thumbnail: '//placehold.it/205x205',
    key: 'item-6 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    color: 'yellow',
    shape: 'triangle',
    location: 'Portland',
    width: 205,
    height: 205
  },
  {
    thumbnail: '//placehold.it/205x205',
    key: 'item-7 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    color: 'blue',
    shape: 'triangle',
    location: 'Los Angeles',
    width: 205,
    height: 205
  },
  {
    thumbnail: '//placehold.it/234x234',
    key: 'item-8 Lorem ipsum dolor sit',
    name: 'Lorem ipsum dolor sit amet,',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
    color: 'red',
    shape: 'triangle',
    location: 'Chicago',
    width: 234,
    height: 234
  }];
}

describe('Generate Groups', () => {

  it('should generate groups from a given list', () => {
    const sourceList = setUp();
    const groups = generateGroupsFromList(sourceList, 'color');
    expect(groups.length).toEqual(4);
  });

  it('should return empty list for non-existent property', () => {
    const sourceList = setUp();
    const groups = generateGroupsFromList(sourceList, 'colors');
    expect(groups.length).toEqual(0);
  });
});

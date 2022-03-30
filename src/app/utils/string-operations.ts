declare global {
  interface String {
    toSentenceCase(): string;
    contains(searchText: string): boolean;
  }
}

/**
 * Converts the first character to uppercase if character is alphanumeric and the rest to lowercase
 */
String.prototype.toSentenceCase = function (): string {
  return `${this.charAt(0).toUpperCase()}${this.toLowerCase().slice(1)}`;
};

/**
 * Performs a case-insenstive search of a substring within a string and
 * returns true if searchString appears as a substring of a string
 * @param searchString search string
 */
String.prototype.contains = function (searchString: string): boolean {
  return this.toLowerCase().includes(searchString.toLowerCase());
};

export {};

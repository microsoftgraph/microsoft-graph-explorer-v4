declare global {
  interface String {
    toSentenceCase(): String;
  }
}

String.prototype.toSentenceCase = function () {
  return `${this.charAt(0).toUpperCase()}${this.toLowerCase().slice(1)}`;
};

export {};

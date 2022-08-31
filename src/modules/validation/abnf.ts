import { apgApi, apgLib } from 'apg-js';
import { rules } from './definition';

interface ValidationResult {
  inputLength: number;
  length: number;
  matched: number;
  maxMatched: number;
  maxTreeDepth: number;
  nodeHits: number;
  state: number;
  subBegin: number;
  subEnd: number;
  subLength: number;
  success: boolean;
}

export class ValidatedUrl {

  private parser;
  private grammarObject = this.generateGrammarObject();

  constructor() {
    this.parser = new apgLib.parser();
  }

  private generateGrammarObject() {
    const grammar = new apgApi(rules);
    grammar.generate();

    if (grammar.errors.length) {
      throw Error('ABNF grammar has errors');
    }
    return grammar.toObject();
  }


  public validate(graphUrl: string): ValidationResult {
    const result = this.parser.parse(this.grammarObject, 'odataUri', decodeURI(graphUrl));
    return result;
  }
}
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
  private static grammar: any;
  private static parser = new apgLib.parser();


  public static getGrammar() {
    if (!ValidatedUrl.grammar) {
      ValidatedUrl.grammar = this.generateGrammarObject();
    }
    return ValidatedUrl.grammar;
  }

  private static generateGrammarObject() {
    const api = new apgApi(rules);
    api.generate();

    if (api.errors.length) {
      throw Error('ABNF grammar has errors');
    }
    return api.toObject();
  }

  public validate(graphUrl: string): ValidationResult {
    const result = ValidatedUrl.parser.parse(ValidatedUrl.getGrammar(), 'odataUri', decodeURI(graphUrl));
    return result;
  }
}
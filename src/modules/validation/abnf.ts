import { apgApi, apgLib } from 'apg-js';
import { rules } from './definition';

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
      throw new Error('ABNF grammar has errors');
    }
    return grammar.toObject();
  }

  public validate() {
    const graphUrl = 'https://graph.microsoft.com/beta/groups';
    const result = this.parser.parse(this.grammarObject, this.grammarObject?.rules![0].name, graphUrl);
    return result.success;
  }
}
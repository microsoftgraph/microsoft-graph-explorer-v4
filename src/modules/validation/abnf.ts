import 'apg-js/dist/apg-api-bundle';
import { odataAbnfCache } from '../cache/odataAbnfRules.cache';

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

const { apgLib } = globalThis as any;
export class ValidatedUrl {
  private static grammar: any;
  private static parser = new apgLib.parser();

  public static getGrammar() {
    if (!ValidatedUrl.grammar) {
      this.generateGrammarObject().then(grammar=>{ ValidatedUrl.grammar = grammar});
    }
    return ValidatedUrl.grammar;
  }
  private static async generateGrammarObject() {
    const grammar = await odataAbnfCache.readGrammar();
    return grammar;
  }

  public validate(graphUrl: string): ValidationResult {
    let decodedGraphUrl = graphUrl;
    try { decodedGraphUrl = decodeURI(graphUrl); } catch (error) { /* empty */ }
    const grammar = ValidatedUrl.getGrammar()
    let result = ValidatedUrl.parser.parse(
      grammar,
      'odataUri',
      decodedGraphUrl
    );

    if (!result.success) {
      const pathname = new URL(decodedGraphUrl).pathname.replace('/v1.0/','').replace('/beta/', '');
      result = ValidatedUrl.parser.parse(
        grammar,
        'odataRelativeUri',
        pathname
      );
    }
    return result;
  }
}
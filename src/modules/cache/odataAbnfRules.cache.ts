import 'apg-js/dist/apg-api-bundle';
import localforage from 'localforage';
import { ODATA_ABNF_RULES_OBJECT_KEY } from '../../app/services/graph-constants';

const odataAbnfStorage = localforage.createInstance({
  storeName: 'odataAbnf',
  name: 'GE_V4'
});

const { apgApi } = globalThis as any;


export const odataAbnfCache = (function () {
  const saveGrammar = async (text: string)=>{
    const api = new apgApi(text)
    api.generate()
    if (api.errors.length > 0) {
      throw new Error('ABNF grammar has failed to generate')
    }
    // Note: stringifying here loses the callbacks and toString function. They're not needed for this
    // therefore this is ok.
    await odataAbnfStorage.setItem(ODATA_ABNF_RULES_OBJECT_KEY, JSON.stringify(api.toObject()))
  }

  const readGrammar = async (): Promise<object> =>{
    const grammar  = await odataAbnfStorage.getItem(ODATA_ABNF_RULES_OBJECT_KEY) as string;
    if (grammar) {return JSON.parse(grammar);}
    return {};
  }

  return {saveGrammar, readGrammar}
})()
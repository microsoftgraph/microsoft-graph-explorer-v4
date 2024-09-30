import localforage from 'localforage';
import { ODATA_ABNF_RULES_OBJECT_KEY } from '../../app/services/graph-constants';

const odataAbnfStorage = localforage.createInstance({
  storeName: 'odataAbnf',
  name: 'GE_V4'
});


export const odataAbnfCache = (function () {
  const saveGrammar = async (text: string)=>{
    await odataAbnfStorage.setItem(ODATA_ABNF_RULES_OBJECT_KEY, text)
  }

  const readGrammar = async (): Promise<string> =>{
    const rules  = await odataAbnfStorage.getItem(ODATA_ABNF_RULES_OBJECT_KEY) as string;
    if (rules) {return rules;}
    return '';
  }

  return {saveGrammar, readGrammar}
})()
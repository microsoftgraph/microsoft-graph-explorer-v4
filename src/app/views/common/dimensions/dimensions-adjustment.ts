export function convertVhToPx(height: string, adjustment: number) {
  const newHeight = parseFloat(height.replace('vh', '')) / 100
        * document.documentElement.clientHeight;
  return Math.floor(newHeight - adjustment) + 'px';
}

export function convertPxToVh(px: number){
  const innerHeight = window.innerHeight;
  const convertedHeight = (100*px)/innerHeight;
  return convertedHeight+ 'vh';
}

export function getResponseHeight(height: string, responseAreaExpanded: boolean) {
  let responseHeight = height;
  if (responseAreaExpanded) {
    responseHeight = '90vh';
  }
  return responseHeight;
}

export function getResponseEditorHeight(adjustment: number){
  const queryResponseElement = document.getElementsByClassName('query-response')[0];
  let responseHeight = '';
  if(queryResponseElement){
    const queryResponseElementHeight = queryResponseElement?.clientHeight;
    responseHeight = `${queryResponseElementHeight-adjustment}px`
  }
  return responseHeight;
}
export function convertVhToPx(height: string, adjustment: number) {
    const newHeight = parseFloat(height.replace('vh', '')) / 100
        * document.documentElement.clientHeight;
    return Math.floor(newHeight - adjustment) + 'px';
}

export function getResponseHeight(height: any, responseAreaExpanded: any) {
    let responseHeight = height;
    if (responseAreaExpanded) {
        responseHeight = '90vh';
    }
    return responseHeight;
}
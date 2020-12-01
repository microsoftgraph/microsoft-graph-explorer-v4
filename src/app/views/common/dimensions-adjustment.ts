export function convertVhToPx(height: string, adjustment: any) {
    const newHeight = parseFloat(height.replace('vh', '')) / 100
        * document.documentElement.clientHeight;
    return Math.floor(newHeight - adjustment) + 'px';
}
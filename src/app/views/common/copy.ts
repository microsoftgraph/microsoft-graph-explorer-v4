export const copy = (id: string, text?: string): Promise<any> => {
  if (text) {
    return genericCopy(text);
  }
  
  return copyTextArea(id);
};

function genericCopy(text: string) {
  const element = document.createElement('textarea');
  element.value = text;
  document.body.appendChild(element);
  element.select();

  document.execCommand('copy');
  document.body.removeChild(element);
  
  return Promise.resolve('copied');
}

function copyTextArea(id: string) {
  const textArea: any = document.getElementById(id);
  textArea.focus();
  textArea.select();

  document.execCommand('copy');
  document.execCommand('unselect');

  textArea.blur();

  return Promise.resolve('copied');
}
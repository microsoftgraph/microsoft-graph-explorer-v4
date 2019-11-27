export function genericCopy(text: string) {
  const element = document.createElement('textarea');
  element.value = text;
  document.body.appendChild(element);
  element.select();

  document.execCommand('copy');
  document.body.removeChild(element);
  
  return Promise.resolve('copied');
}

export function copy(id: string) {
  const textArea: any = document.getElementById(id);
  textArea.focus();
  textArea.select();

  document.execCommand('copy');
  document.execCommand('unselect');

  textArea.blur();

  return Promise.resolve('copied');
}
export function downloadToLocal(content: any, filename: string) {
  const blob = new Blob([JSON.stringify(content)], { type: 'text/json' });

  const elem = window.document.createElement('a');
  elem.href = window.URL.createObjectURL(blob);
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}
export const copy = (id: string): Promise<any> => {
  const shareQueryParams: any = document.getElementById(id);
  shareQueryParams.focus();
  shareQueryParams.select();

  document.execCommand('copy');
  document.execCommand('unselect');

  shareQueryParams.blur();

  return Promise.resolve('copied');
};

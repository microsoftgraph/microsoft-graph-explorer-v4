import { key } from 'localforage';
import { telemetry } from '../../../telemetry';
import { IQuery } from '../../../types/query-runner';

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

export function trackedGenericCopy(
  text: string,
  componentName: string,
  sampleQuery?: IQuery,
  properties?: { [key: string]: string }
) {
  genericCopy(text);
  telemetry.trackCopyButtonClickEvent(componentName, sampleQuery, properties);
}

export function copyAndTrackText(
  text: string,
  componentName: string,
  properties?: { [key: string]: string }
) {
  genericCopy(text);
  telemetry.trackCopyButtonClickEvent(componentName, undefined, properties);
}

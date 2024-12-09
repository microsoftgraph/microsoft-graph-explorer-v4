import { telemetry, eventTypes } from '../../../telemetry';

function downloadToLocal(content: any, filename: string) {
  const blob = new Blob([JSON.stringify(content, null, 4)], {
    type: 'text/json'
  });
  download(blob, filename);
}

function download(blob: Blob, filename: string) {
  const elem = window.document.createElement('a');
  elem.href = window.URL.createObjectURL(blob);
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

function trackDownload(filename: string, componentName: string) {
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
    componentName,
    filename
  });
}

export {
  downloadToLocal,
  trackDownload
};

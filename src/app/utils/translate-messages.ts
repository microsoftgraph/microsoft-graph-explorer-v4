import messages from '../../messages';

export function translateMessage(messageId: string): string {
  return getTranslation(messageId, 'en-US') || messageId;
}

function getTranslation(messageId: string, locale: string) {
  const localeMessages: object = (messages as { [key: string]: object })[locale];
  if (localeMessages) {
    const key: any = Object.keys(localeMessages).find(k => k === messageId);
    const message = (localeMessages as { [key: string]: object })[key];
    if (message) {
      return message.toString();
    }
  }
  return null;
}
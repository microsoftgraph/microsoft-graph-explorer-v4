import messages from '../../messages';
import { geLocale } from '../../appLocale';

export function translateMessage(messageId: string) {
  const translatedMessage: string = getTranslation(messageId, geLocale);
  if (translatedMessage) {
    return translatedMessage;
  }
  return getTranslation(messageId, 'en-US') || messageId;
}

function getTranslation(messageId: string, locale: string) {
  const localeMessages = (messages as { [key: string]: object })[locale];
  if (localeMessages) {
    const message: any = Object.keys(localeMessages).find(k => k === messageId);
    if (message) {
      return message;
    }
  }
  return null;
}
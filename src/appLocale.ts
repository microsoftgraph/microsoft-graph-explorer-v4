const localeMap: any = {
  'de-de': 'de-DE',
  'en-us': 'en-US',
  'es-es': 'es-ES',
  'fr-fr': 'fr-FR',
  'ja-jp': 'ja-JP',
  'pt-br': 'pt-BR',
  'ru-ru': 'ru-RU',
  'zh-cn': 'zh-CN'
};

function getTryItLocale() {
  return new URLSearchParams(location.search).get('locale');
}

function getPortalLocale(): string {
  return location.pathname.split('/')[1].toLocaleLowerCase();
}

const hostDocumentLocale = getTryItLocale() || getPortalLocale();

export const geLocale = hostDocumentLocale && localeMap[hostDocumentLocale] || 'en-US';

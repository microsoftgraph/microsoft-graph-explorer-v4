function redactPii(str: string)
{
  const piiRegex = [
    {
      name: 'EMAIL_ADDRESS',
      regex: /([a-z0-9_\-.+]+)@\w+(\.\w+)*/gi
    },
    {
      name: 'BASE64_STRING',
      regex: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/g
    },
    {
      name: 'ID',
      regex: /(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}/gi
    },
    {
      name: 'PHONE_NUMBER',
      regex: /(\(?\+?[0-9]{1,2}\)?[-. ]?)?(\(?[0-9]{3}\)?|[0-9]{3})[-. ]?([0-9]{3}[-. ]?[0-9]{4}|\b[A-Z0-9]{7}\b)/g
    },
    {
      name: 'NUMBER',
      regex: /(?<=\/)\d+\b/g
    }
  ];
  piiRegex.forEach(pii => {
    str = str.replace(pii.regex, `{${pii.name}}`);
  });
  return str;
}

export function sanitizeUrl(url: string)
{
  // exclude query parameters from url, they might contain sensitive data
  url = url.split('?')[0];

  return redactPii(url);
}
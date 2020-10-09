export function normalizeQueryUrl(incomingUrl: string) {
  // Matches scp and roles claims from token claims as logged by AGS
  const scpRegex = 'scp=([^,;]+)';
  const rolesRegex = 'roles=(\[[^\]]+\])';

  // Matches patterns like "('<1f7ff346-c174-45e5-af38-294e51d9969a>')" or "('<key>')"
  const keyIdRegex = /\(\'\<?\{?[ ?0-9a-zA-Z-]*\}?\>?\'\)/g;

  // Matches patterns like "(query=<key>)" or "(itemat=<key>,mode=<mode>)"
  const functionParamInitialRegex = '@"=.*?,"';
  const functionParamFinalRegex = /(?<=\=).[^,]*(?=\))/g;

  // PII Regex
  const piiRegexes = [
    {
      name: 'email',
      regex: /([a-z0-9_\-.+]+)@\w+(\.\w+)*/gi
    }
  ];

  incomingUrl = incomingUrl.toLowerCase();

  // Drop query string
  incomingUrl = incomingUrl.split('?')[0];

  // Drop casts that use the /$/ pattern
  incomingUrl = incomingUrl.split('/$/')[0];

  // Normalize parameters in param=<arbitraryKey> format with param={value} format
  incomingUrl = incomingUrl.replace(functionParamInitialRegex, '={value}');
  incomingUrl = incomingUrl.replace(functionParamFinalRegex, '{value}');

  // Replace IDs and ID placeholders with generic {id}
  incomingUrl = incomingUrl.replace(keyIdRegex, '/{id}');

  // Drop entity/action namespace
  incomingUrl = incomingUrl.replace('microsoft.graph.', '');

  // Trim off $value
  if (incomingUrl.endsWith('/$value') || incomingUrl.endsWith('/$count'))
  {
    incomingUrl = incomingUrl.substring(0, incomingUrl.length - 7);
  }

  // Trim off $ref
  if (incomingUrl.endsWith('/$ref'))
  {
    incomingUrl = incomingUrl.substring(0, incomingUrl.length - 5);
  }

  // Trim any delta queries
  if (incomingUrl.endsWith('/delta'))
  {
    incomingUrl = incomingUrl.substring(0, incomingUrl.length - 6);
  }

  // redact PII
  piiRegexes.forEach(pii => {
    incomingUrl = incomingUrl.replace(pii.regex, `{${pii.name}}`);
  });

  return incomingUrl;
}

export function stringToHash(input: string) {
  let hash = 0;
  if (input.length === 0) {
    return hash;
  }

  for (let index = 0; index < input.length; index++) {
    const char = input.charCodeAt(index);
    // eslint-disable-next-line no-bitwise
    hash = ((hash << 5) - hash) + char;
    // eslint-disable-next-line no-bitwise
    hash = hash & hash;
  }
  return hash;
}
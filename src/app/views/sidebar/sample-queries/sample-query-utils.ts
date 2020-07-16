export function isJsonString(str: string) {
  try {
    const parsedString = JSON.parse(str);
    if (parsedString && typeof parsedString === "object") {
      return true;
    }
  } catch (e) {
    return false;
  }
  return true;
}

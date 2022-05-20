import packageJsonFile from '../../../package.json';

export function getVersion() {
  return packageJsonFile.version || 0;
}
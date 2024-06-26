import { Environment } from 'monaco-editor/esm/vs/editor/editor.api';

export {};
declare global {
  interface Window {
    ClientId: string | undefined
    MonacoEnvironment: Environment;
  }
}

window.ClientId = window.ClientId || undefined;

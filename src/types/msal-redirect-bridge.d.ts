// moduleResolution "node" ignores package.json "exports", so TypeScript cannot find this subpath's types on its own.
declare module '@azure/msal-browser/redirect-bridge' {
  export function broadcastResponseToMainFrame(): Promise<void>;
}

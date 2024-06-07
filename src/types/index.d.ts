export {};
declare global {
  interface Window {
    ClientId: string | undefined
  }
}

window.ClientId = window.ClientId || undefined;

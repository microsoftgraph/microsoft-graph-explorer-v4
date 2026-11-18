import { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge';

// Entry point for redirect.html. Kept free of app code so the bridge only hands the auth response back to the opener.
broadcastResponseToMainFrame().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Graph Explorer could not complete sign-in:', error);
});

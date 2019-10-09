import { authProvider, msalApplication } from './MsalAgent';

export async function logIn(): Promise<any> {
  try {
    const accessToken = await authProvider.getAccessToken();
    return accessToken;
  } catch (error) {
    return null;
  }
}

export function logOut() {
  msalApplication.logout();
}

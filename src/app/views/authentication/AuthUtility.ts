import { MSALAuthenticationProvider } from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProvider';
import { DEFAULT_USER_SCOPES, USER_INFO_URL, USER_PICTURE_URL } from '../../services/graph-constants';

const clientId = 'cb2d7367-7429-41c6-ab18-6ecb336139a6';
const graphScopes = [DEFAULT_USER_SCOPES];
const options = { redirectUri: window.location };
const authProvider = new MSALAuthenticationProvider(clientId, graphScopes, options);

export async function getAccessToken(): Promise<string> {
    try {
      const accessToken = await authProvider.getAccessToken();
      return accessToken;
    } catch (error) {
      throw error;
    }
}

export async function getUserInfo(queryActions: any) {
  const userInfo = (queryActions) ? await queryActions.runQuery({
    sampleUrl: USER_INFO_URL,
  }) : null;
  const jsonUserInfo = userInfo.response.body;
  return jsonUserInfo;
}

export async function getImageUrl(queryActions: any) {
  const userPicture = (queryActions) ? await queryActions.runQuery({
    sampleUrl: USER_PICTURE_URL,
  }) : null;
  const buffer = await userPicture.response.body.arrayBuffer();
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  const imageUrl = URL.createObjectURL(blob);
  return imageUrl;
}

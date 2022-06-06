import * as NETATMO_CONFIG from './config.json';
import { IHomeCoachData } from './types';

async function getAccessToken(): Promise<string> {
  const request = new Request('https://api.netatmo.com/oauth2/token') as any;
  request.method = 'POST';

  const params = {
    client_id: NETATMO_CONFIG.CLIENT_ID,
    client_secret: NETATMO_CONFIG.CLIENT_SECRET,
    grant_type: 'password',
    username: NETATMO_CONFIG.USERNAME,
    password: NETATMO_CONFIG.PASSWORD,
    scope: 'read_homecoach',
  };
  for (const [key, value] of Object.entries(params)) {
    request.addParameterToMultipart(key, value);
  }

  const data = await request.loadJSON();

  if (data.error) {
    return Promise.reject(JSON.stringify(data.error));
  } else if (!data.access_token) {
    return Promise.reject(
      `No access token in response: ${JSON.stringify(data)}`
    );
  }

  return data.access_token;
}

async function getHomeCoachData(accessToken: string): Promise<IHomeCoachData> {
  const request = new Request(
    'https://api.netatmo.com/api/gethomecoachsdata'
  ) as any;
  request.headers = { Authorization: `Bearer ${accessToken}` };

  const data = await request.loadJSON();

  if (data.error) {
    return Promise.reject(JSON.stringify(data.error));
  } else if (data.status !== 'ok') {
    return Promise.reject(`Status not ok: ${data.status}`);
  }

  return data;
}

export async function fetchData(): Promise<IHomeCoachData> {
  try {
    const accessToken = await getAccessToken();
    return getHomeCoachData(accessToken);
  } catch (err) {
    return Promise.reject(err);
  }
}

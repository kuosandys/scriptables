import { IConfig, IHomeCoachData } from './types';

async function getAccessToken(config: IConfig): Promise<string> {
  const request = new Request('https://api.netatmo.com/oauth2/token') as any;
  request.method = 'POST';

  const params = {
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    grant_type: 'password',
    username: config.USERNAME,
    password: config.PASSWORD,
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

export async function fetchData(config: IConfig): Promise<IHomeCoachData> {
  try {
    const accessToken = await getAccessToken(config);
    return getHomeCoachData(accessToken);
  } catch (err) {
    return Promise.reject(err);
  }
}

import { IHomeCoachData } from './types';
import * as NETATMO_CONFIG from './config.json';

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
    throw new Error(JSON.stringify(data.error));
  } else if (!data.access_token) {
    throw new Error(`No access token in response: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

async function getHomeCoachData(accessToken: string): Promise<IHomeCoachData> {
  const request = new Request(
    'https://api.netatmo.com/api/gethomecoachsdata'
  ) as any;
  request.headers = { Authorization: `Bearer ${accessToken}` };

  const data = request.loadJSON();

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }

  return data;
}

async function createWidget(data: IHomeCoachData): Promise<ListWidget> {
  const widget = new ListWidget();

  // display station name
  widget.addText(data.body.devices[0].station_name);

  return widget;
}

try {
  const accessToken = await getAccessToken();
  const homeCoachData = await getHomeCoachData(accessToken);
  const widget = await createWidget(homeCoachData);

  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    // for development
    widget.presentSmall();
  }
} catch (err) {
  console.log((err as Error).message);
}

Script.complete();

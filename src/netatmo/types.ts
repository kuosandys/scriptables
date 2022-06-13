export interface IHomeCoachData {
  body: IHomeCoachDataBody;
  status: string;
  time_exec: string;
  time_server: string;
}

interface IHomeCoachDataBody {
  devices: IDevice[];
  user: IUser;
}

interface IDevice {
  _id: string;
  date_setup: number;
  last_setup: number;
  type: string;
  last_status_store: number;
  module_name: string;
  firmware: number;
  last_upgrade: number;
  wifi_status: number;
  reachable: boolean; // if the station has connected to Netatmo cloud within the last 4 hours
  co2_calibrating: boolean;
  station_name: string;
  data_type: DeviceDataType[];
  place: IPlace;
  dashboard_data: IDashboardData;
  name: string;
  read_only: boolean;
}

type DeviceDataType =
  | 'Temperature'
  | 'CO2'
  | 'Humidity'
  | 'Noise'
  | 'Pressure'
  | 'health_idx';

interface IPlace {
  altitude: number;
  city: string;
  country: string;
  timezone: string;
  location: string[]; // [lat, lon]
}

interface IDashboardData {
  time_utc: number; // to closest minute
  Temperature: number; // in C
  CO2: number; // in ppm
  Humidity: number; // in %
  Noise: number;
  Pressure: number; // surface pressure aka atmospheric pressure in mbar
  AbsolutePressure: number; // sea-level pressure in mbar
  health_idx: number; // health index
  min_temp: number;
  max_temp: number;
  date_max_temp: number;
  date_min_temp: number;
}

interface IUser {
  mail: string;
  administrative: IAdministrative;
}

interface IAdministrative {
  lang: string;
  reg_local: string;
  country: string;
  unit: '0' | '1'; // 0 = metric, 1 = imperial
  windunit: 0 | 1 | 2 | 3 | 4; // 0 = km/h, 1 = mph, 2 = m/s, 3 = bft, 4 = kn
  pressureunit: 0 | 1 | 2; // 0 = mbar, 1 = inHg, 2 = mmHg
  feels_like_algo: 0 | 1; // 0 = humidex, 1 = heat-index
}

export interface IDeviceDisplayData {
  stationName: string;
  time: Date;
  unit: 0 | 1; // 0 = metric, 1 = imperial
  pressureunit: 0 | 1 | 2; // 0 = mbar, 1 = inHg, 2 = mmHg
  temperature: number; // in C
  co2: number; // in ppm
  humidity: number; // in %
  noise: number; // in dB
  healthIdx: number; // health index
  pressure: number; // surface pressure aka atmospheric pressure in mbar
}

export type HealthIdx = -1 | 0 | 1 | 2 | 3 | 4;

export interface IConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  USERNAME: string;
  PASSWORD: string;
}

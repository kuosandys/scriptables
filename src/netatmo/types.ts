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
  reachable: boolean;
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
  time_utc: number;
  Temperature: number;
  CO2: number;
  Humidity: number;
  Noise: number;
  Pressure: number;
  AbsolutePressure: number;
  health_idx: number;
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
  unit: string;
  windunit: number;
  pressureunit: number;
  feels_like_algo: number;
}

import { IDeviceDisplayData, IHomeCoachData } from './types';

export function convertTemperature(temperature: number, unit: number): number {
  if (unit === 1) {
    return celciusToFahrenheit(temperature);
  }
  return temperature;
}

export function convertPressure(pressure: number, unit: number): number {
  switch (unit) {
    case 0:
      return pressure;
    case 1:
      return mBarToInHg(pressure);
    case 2:
      return mbarTommHg(pressure);
    default:
      return pressure;
  }
}

export function celciusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function mBarToInHg(mBar: number): number {
  return mBar * 0.02952998751;
}

export function mbarTommHg(mBar: number): number {
  return mBar / 1.33322;
}

export function parseData(rawData: IHomeCoachData): IDeviceDisplayData[] {
  const unit = rawData.body.user.administrative.unit === '1' ? 1 : 0;
  const pressureunit = rawData.body.user.administrative.pressureunit;

  const devices: IDeviceDisplayData[] = [];

  for (const d of rawData.body.devices) {
    // Ignore unreachable devices for now
    if (!d.reachable) continue;

    const device: IDeviceDisplayData = {
      stationName: d.station_name,
      time: new Date(d.dashboard_data.time_utc * 1000),
      unit,
      pressureunit,
      temperature: convertTemperature(d.dashboard_data.Temperature, unit),
      humidity: d.dashboard_data.Humidity,
      pressure: convertPressure(d.dashboard_data.Pressure, pressureunit),
      co2: d.dashboard_data.CO2,
      noise: d.dashboard_data.Noise,
      healthIdx: d.dashboard_data.health_idx,
    };

    devices.push(device);
  }

  return devices;
}

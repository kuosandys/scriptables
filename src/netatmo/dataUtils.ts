import { HealthIdx, IDeviceDisplayData, IHomeCoachData } from './types';

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

export function mapHealthIdxToDescription(idx: number): string {
  switch (idx) {
    case 4:
      return 'hazardous';
    case 3:
      return 'unhealthy';
    case 2:
      return 'poor';
    case 1:
      return 'fair';
    case 0:
      return 'healthy';
    default:
      return 'unknown';
  }
}

export function mapTemperatureToHealthIdx(temperature: number): HealthIdx {
  switch (true) {
    case temperature < 15 || temperature >= 30:
      return 4;
    case temperature < 16 || temperature >= 27:
      return 3;
    case temperature < 17 || temperature >= 26:
      return 2;
    case temperature < 18 || temperature >= 23:
      return 1;
    default:
      return 0;
  }
}

export function mapHumidityToHealthIdx(humidity: number): HealthIdx {
  switch (true) {
    case humidity < 15 || humidity >= 80:
      return 4;
    case humidity < 20 || humidity >= 70:
      return 3;
    case humidity < 30 || humidity >= 60:
      return 2;
    case humidity < 40 || humidity >= 50:
      return 1;
    default:
      return 0;
  }
}

export function mapCO2ToHealthIdx(co2: number): HealthIdx {
  switch (true) {
    case co2 >= 1600:
      return 4;
    case co2 >= 1400:
      return 3;
    case co2 >= 1150:
      return 2;
    case co2 >= 900:
      return 1;
    default:
      return 0;
  }
}

export function mapNoiseToHealthIdx(noise: number): HealthIdx {
  switch (true) {
    case noise >= 80:
      return 4;
    case noise >= 70:
      return 3;
    case noise >= 65:
      return 2;
    case noise >= 50:
      return 1;
    default:
      return 0;
  }
}

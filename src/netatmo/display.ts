import { IDeviceDisplayData } from './types';

const TEMPERATURE_UNIT_MAP = {
  0: '°C',
  1: '°F',
};

const PRESSURE_UNIT_MAP = {
  0: 'mbar',
  1: 'inHg',
  2: 'mmHg',
};

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diff / 1000 / 60);
  const diffHours = Math.floor(diff / 1000 / 60 / 60);
  const diffDays = Math.floor(diff / 1000 / 60 / 60 / 24);

  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
}

function formatDashboardData(data: IDeviceDisplayData): Record<string, string> {
  const temperatureUnit = TEMPERATURE_UNIT_MAP[data.unit];
  const pressureunit = PRESSURE_UNIT_MAP[data.pressureunit];

  return {
    'Temperature': `${data.temperature} ${temperatureUnit}`,
    'Humidity': `${data.humidity} %`,
    'Pressure': `${data.pressure} ${pressureunit}`,
    'CO2': `${data.co2} ppm`,
    'Noise': `${data.noise} dB`,
    'Health index': `${data.healthIdx}`,
  };
}

export async function createWidget(
  data: IDeviceDisplayData[]
): Promise<ListWidget> {
  const widget = new ListWidget();

  for (const d of data) {
    // display station name
    widget.addText(d.stationName);

    // display last sync time
    const relativeTime = getRelativeTime(d.time);
    widget.addText(`Last updated: ${relativeTime}`);

    // display dashboard data
    const dashboardData = formatDashboardData(d);
    for (const [key, value] of Object.entries(dashboardData)) {
      widget.addText(`${key}: ${value}`);
    }
  }

  return widget;
}

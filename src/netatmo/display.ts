import {
  mapCO2ToHealthIdx,
  mapHealthIdxToDescription,
  mapHumidityToHealthIdx,
  mapNoiseToHealthIdx,
  mapTemperatureToHealthIdx,
} from './dataUtils';
import { HealthIdx, IDeviceDisplayData } from './types';

const TEMPERATURE_UNIT_MAP = {
  0: '°C',
  1: '°F',
};

const PRESSURE_UNIT_MAP = {
  0: 'mbar',
  1: 'inHg',
  2: 'mmHg',
};

const FONT = {
  name: 'Menlo',
  size: 12,
};

const FONTS = {
  heading: new Font(FONT.name, FONT.size + 3),
  body: new Font(FONT.name, FONT.size),
  small: new Font(FONT.name, FONT.size - 2),
};

const COLORS = {
  blue: new Color('#6ab0f3'),
  green: new Color('#92d192'),
  yellow: new Color('#ffd479'),
  orange: new Color('#fca369'),
  red: new Color('#f2777a'),
  grey: new Color('#b3b9c5'),
  black: new Color('#000000'),
};

function formatDashboardData(
  data: IDeviceDisplayData
): Record<string, { value: string; healthIdx: HealthIdx }> {
  const temperatureUnit = TEMPERATURE_UNIT_MAP[data.unit];
  const pressureunit = PRESSURE_UNIT_MAP[data.pressureunit];

  return {
    'temp': {
      value: `${data.temperature.toFixed(1)} ${temperatureUnit}`,
      healthIdx: mapTemperatureToHealthIdx(data.temperature),
    },
    'humidity': {
      value: `${data.humidity.toFixed(1)} %`,
      healthIdx: mapHumidityToHealthIdx(data.humidity),
    },
    'pressure': {
      value: `${data.pressure.toFixed(0)} ${pressureunit}`,
      healthIdx: -1,
    },
    'CO₂': {
      value: `${data.co2.toFixed(0)} ppm`,
      healthIdx: mapCO2ToHealthIdx(data.co2),
    },

    'noise': {
      value: `${data.noise.toFixed(0)} dB`,
      healthIdx: mapNoiseToHealthIdx(data.noise),
    },
  };
}

function mapHealthIdxToColor(healthIdx: number): Color {
  switch (healthIdx) {
    case 0:
      return COLORS.blue;
    case 1:
      return COLORS.green;
    case 2:
      return COLORS.yellow;
    case 3:
      return COLORS.orange;
    case 4:
      return COLORS.red;
    default:
      return COLORS.grey;
  }
}

export async function createWidget(
  data: IDeviceDisplayData[]
): Promise<ListWidget> {
  const widget = new ListWidget();
  widget.backgroundColor = COLORS.black;

  for (const d of data) {
    // display station name and health index
    const stationName = widget.addText(
      `${d.stationName} is ${mapHealthIdxToDescription(d.healthIdx)}`
    );
    stationName.font = FONTS.heading;
    stationName.textColor = mapHealthIdxToColor(d.healthIdx);

    widget.addSpacer(3);

    // display last sync time
    const relativeDateFormatter = new RelativeDateTimeFormatter();
    const relativeDate = relativeDateFormatter.string(d.time, new Date());
    const lastUpdated = widget.addText(`last updated ${relativeDate}`);
    lastUpdated.font = FONTS.small;
    lastUpdated.textColor = COLORS.grey;

    widget.addSpacer(FONT.size / 2);

    const body = widget.addStack();

    // display dashboard data
    const leftStack = body.addStack();
    leftStack.layoutVertically();
    const rightStack = body.addStack();
    rightStack.layoutVertically();

    const dashboardData = formatDashboardData(d);
    for (const [k, v] of Object.entries(dashboardData)) {
      const key = leftStack.addText(`${k.padEnd(8, ' ')} | `);
      key.font = FONTS.body;
      key.textColor = COLORS.grey;

      const value = rightStack.addText(v.value);
      value.font = FONTS.body;
      value.textColor = mapHealthIdxToColor(v.healthIdx);
    }
  }

  return widget;
}

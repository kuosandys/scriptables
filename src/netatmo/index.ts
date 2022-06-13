import { parseData } from './dataUtils';
import { createWidget } from './display';
import { fetchData } from './fetch';

try {
  const netatmoConfig = importModule('netatmo-config');
  const homeCoachData = await fetchData(netatmoConfig);
  const devicesData = parseData(homeCoachData);
  const widget = await createWidget(devicesData);

  if (config.runsInWidget) {
    Script.setWidget(widget);
  } else {
    // for development
    widget.presentMedium();
  }
} catch (err) {
  console.log((err as Error).message);
}

Script.complete();

import { parseData } from './dataUtils';
import { createWidget } from './display';
import { createErrorWidget } from './error';
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
  const errorMessage = (err as Error).message ?? (err as any).toString();

  if (config.runsInWidget) {
    Script.setWidget(await createErrorWidget(errorMessage));
  } else {
    // for development
    console.log(errorMessage);
  }
}

Script.complete();

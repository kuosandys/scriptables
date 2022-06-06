import { parseData } from './dataUtils';
import { createWidget } from './display';
import { fetchData } from './fetch';

try {
  const homeCoachData = await fetchData();
  const devicesData = parseData(homeCoachData);
  const widget = await createWidget(devicesData);

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

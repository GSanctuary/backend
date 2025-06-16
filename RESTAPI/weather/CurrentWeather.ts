import { RESTHandler, RESTMethods, RESTRoute } from '../../server';
import { getCurrentWeather } from '../../services/weather';

const handler: RESTHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { latitude, longitude } = req.query;
  if (typeof latitude !== 'string' || typeof longitude !== 'string') {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  const latNumber = parseFloat(latitude);
  const lonNumber = parseFloat(longitude);
  if (isNaN(latNumber) || isNaN(lonNumber)) {
    return res
      .status(400)
      .json({ error: 'Latitude and longitude must be valid numbers' });
  }

  const response = await getCurrentWeather({
    latitude: latNumber,
    longitude: lonNumber,
  });

  return res.status(200).json(response);
};

const CurrentWeather: RESTRoute = {
  method: RESTMethods.GET,
  needsAuth: true,
  path: '/weather/current/',
  run: handler,
};

export default CurrentWeather;

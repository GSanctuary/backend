import { RESTRoute, RESTMethods } from '../server';

export const TestEndpoint = {
  path: '/test',
  method: RESTMethods.GET,
  run: async (req, res, next) => {
    res.send('hello vro');
  },
} as RESTRoute;

export default TestEndpoint;

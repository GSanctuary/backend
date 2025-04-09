import { RESTHandler, RESTMethods } from '../server';

export const TestEndpoint = {
  path: '/test',
  method: RESTMethods.GET,
  run: async (req, res, next) => {
    res.send('hello vro');
  },
} as RESTHandler;

export default TestEndpoint;

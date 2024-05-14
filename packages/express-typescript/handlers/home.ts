import { Handler } from '../types/types';
export const home: Handler = (req, res) => {
  res.send('Hello world');
};
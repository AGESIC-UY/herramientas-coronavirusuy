import { publicKeyByPath } from '../../../modules/gubuy-covid-parse/publicKey';

export default (req, res) => {
  if (req.method === 'POST') {
    try {
      const pk = publicKeyByPath(process.env.PUBLIC_KEY);
      res.status(200).json({ pk });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(error);
      }
    }
  }
};

import axios from 'axios';

export default function buildClient({ req }) {
  if (typeof window == 'undefined') {
    return axios.create({
      baseURL: 'http://www.veggily.xyz',
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
}

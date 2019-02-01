import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function getMatches(summonerName) {
  console.log('api call - get match history');
  return axios
    .post(`${API_URL}/matchlist`, {
      summonerName
    })
    .then(res => res.data);
}

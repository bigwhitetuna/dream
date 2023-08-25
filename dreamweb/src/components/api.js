// api.js
import axios from 'axios';

axios.defaults.withCredentials = true;

const BASE_URL = 'http://127.0.0.1:8000';

export const loginUrl = () => {
    return axios.get(`${BASE_URL}/auth/login`);
};

export const callback = (code) => {
    return axios.get(`${BASE_URL}/auth/callback?code=${code}`);
};

// ... Add other API interactions similarly

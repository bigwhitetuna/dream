// api.js
import axios from 'axios';

axios.defaults.withCredentials = true;

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const loginUrl = () => {
    return axios.get(`${BASE_URL}/auth/login`);
};

export const callback = (code) => {
    return axios.get(`${BASE_URL}/auth/callback?code=${code}`);
};

// ... Add other API interactions similarly

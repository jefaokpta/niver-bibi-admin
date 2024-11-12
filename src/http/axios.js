/**
 * @author Jefferson Alves Reis (jefaokpta) < jefaokpta@hotmail.com >
 * Date: 10/10/24
 */

import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const httpClient = axios.create();

// httpClient.interceptors.request.use((config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
//     return config;
// });

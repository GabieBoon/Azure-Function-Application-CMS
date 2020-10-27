import axios from 'axios'
import store from './store/store'

const instance = axios.create({
  baseURL: 'https://skillsgardenfunction.azurewebsites.net/api',
  headers: { 'Content-Type': 'application/json' },
});

const token = localStorage.getItem('token')
if (token) {
  instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

instance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    store.dispatch('logout')
  }
  if (error.response.status === 404) {
    window.open('/dashboard', '_self');
  }
  return error;
});

export default instance;
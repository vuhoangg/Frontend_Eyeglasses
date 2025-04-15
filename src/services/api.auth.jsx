//src/services/api.auth.jsx
import axios from './axios.customize'; // Đảm bảo axios.customize đã được cấu hình

const loginAPI = (email, password) => {
  const URL_BACKEND = `/auth/login`;
  const data = {
    email: email,
    password: password
  };
  return axios.post(URL_BACKEND, data);
};

const registerAPI = (username, email, password, firstName, lastName, phone, address) => {
  const URL_BACKEND = `/auth/register`;
  const data = {
    username: username,
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    address: address
  };
  return axios.post(URL_BACKEND, data);
};

export {
    loginAPI,
    registerAPI
};
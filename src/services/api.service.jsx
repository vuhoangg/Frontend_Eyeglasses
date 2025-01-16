import axios from './axios.customize';
const createUserAPI = (name, email, password, address ) =>
{
    const URL_BACKEND = "/api/v1/users";
    const data = {name : name ,email: email ,password : password ,address: address ,}
    return axios.post(URL_BACKEND, data )

}
const updateUserAPI = () =>
{

}


export {createUserAPI, updateUserAPI }



import axios from './axios.customize';
const createUserAPI = (name, email, password, address ) =>
{
    const URL_BACKEND = "/api/v1/users";
    const data = {name : name ,email: email ,password : password ,address: address ,}
    return axios.post(URL_BACKEND, data );

}

const fetchAllUserAPI = () =>{
    const URL_BACKEND = "/api/v2/users";
    // const data = {name : name ,email: email ,password : password , address: address ,}
    return axios.get(URL_BACKEND);
}
const updateUserAPI = (_id, name, email, address) =>
{
    const URL_BACKEND = `/api/v1/users/${_id}`;
    const data = {name : name ,email: email, address: address }
    return axios.patch(URL_BACKEND, data );

}


export {createUserAPI, updateUserAPI, fetchAllUserAPI }



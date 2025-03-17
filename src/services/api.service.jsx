import axios from './axios.customize';

// const createUserAPI = (name, email, password, address ) =>
// {
//     const URL_BACKEND = "/api/v1/users";
//     const data = {name : name ,email: email ,password : password ,address: address ,}
//     return axios.post(URL_BACKEND, data );

// }
const createUserAPI = ( username,email,password,phone,firstName,lastName,address,roles, ) =>
{
    const URL_BACKEND = "/user";
    const data = {
        username : username ,
        email: email ,
        password : password ,
        phone: phone,
        firstName: firstName,
        lastName: lastName, 
        address: address ,
        roles: roles,
    }
    return axios.post(URL_BACKEND, data );

}

const fetchAllUserAPI = (page, limit, keyword = "") => {
    let URL_BACKEND = `/user?page=${page}&limit=${limit}`;
    if (keyword) {
        URL_BACKEND += `&username=${keyword}`;
      }
    return axios.get(URL_BACKEND);
};
const updateUserAPI = (id ,username,email,phone,firstName,lastName,address,roles,) =>
{
    const URL_BACKEND = `/user/${id}`;
    const data = {
        username : username ,
        email: email ,
        phone: phone,
        firstName: firstName,
        lastName: lastName, 
        address: address ,
        roles: roles,
    }
    return axios.patch(URL_BACKEND, data );

}
const deleteUserAPI = (id) =>
{
    const URL_BACKEND = `/user/${id}`;
    return axios.delete(URL_BACKEND);

}


export {createUserAPI, updateUserAPI, deleteUserAPI , fetchAllUserAPI }



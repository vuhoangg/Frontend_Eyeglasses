import axios from './axios.customize';

// const createUserAPI = (name, email, password, address ) =>
// {
//     const URL_BACKEND = "/api/v1/users";
//     const data = {name : name ,email: email ,password : password ,address: address ,}
//     return axios.post(URL_BACKEND, data );

// }
const createUserAPI = ( username,email,password,phone,firstName,lastName,address, avartar ,roles, ) =>
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
        address: avartar ,
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
const updateUserAPI = (id ,username,email,phone,firstName,lastName,address,avartar ,roles,) =>
{
    const URL_BACKEND = `/user/${id}`;
    const data = {
        username : username ,
        email: email ,
        phone: phone,
        firstName: firstName,
        lastName: lastName, 
        address: address ,
        avartar: avartar ,
        roles: roles,
    }
    return axios.patch(URL_BACKEND, data );

}
const deleteUserAPI = (id) =>
{
    const URL_BACKEND = `/user/${id}`;
    return axios.delete(URL_BACKEND);

}

const handleUploadFile = (file, folder )=>{
    const URL_BACKEND = `/files/upload`;
    let config = {
        headers: {
            "folder_type": folder,
            "Content-Type": "multipart/form-data",
        }
    }
    const bodyFormData = new FormData();
    bodyFormData.append("fileUpload", file )
    return axios.post(URL_BACKEND, bodyFormData, config )
}

// const updateUserAvatarAPI = (id , avartar ,username,email,phone,firstName,lastName,address,avartar ,roles,) =>
//     {
//         const URL_BACKEND = `/user/${id}`;
//         const data = {
//             avartar : avartar,
//             username : username ,
//             email: email ,
//             phone: phone,
//             firstName: firstName,
//             lastName: lastName, 
//             address: address ,
//             address: avartar ,
//             roles: roles,
//         }
//         return axios.patch(URL_BACKEND, data );
    
//     }


export {createUserAPI, updateUserAPI, deleteUserAPI , fetchAllUserAPI , handleUploadFile,}



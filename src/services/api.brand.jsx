// src/services/api.brand.jsx
import axios from './axios.customize';

const createBrandAPI = (name, description, logo) => {
    const URL_BACKEND = "/brand";
    const data = {
        name: name,
        description: description,
        logo: logo,
    };
    return axios.post(URL_BACKEND, data);
};

const fetchAllBrandAPI = (page, limit, keyword = "") => {
    let URL_BACKEND = `/brand?page=${page}&limit=${limit}`;
    if (keyword) {
        URL_BACKEND += `&name=${keyword}`;
    }
    return axios.get(URL_BACKEND);
};

const updateBrandAPI = (id, name, description, logo) => {
    const URL_BACKEND = `/brand/${id}`;
    const data = {
        name: name,
        description: description,
        logo: logo,
    };
    return axios.patch(URL_BACKEND, data);
};

const deleteBrandAPI = (id) => {
    const URL_BACKEND = `/brand/${id}`;
    return axios.delete(URL_BACKEND);
};

const fetchBrandByIdAPI = (id) => {
    const URL_BACKEND = `/brand/${id}`;
    return axios.get(URL_BACKEND)
        .then(response => response)
        .catch(error => {
            console.error("Error fetching brand:", error);
            throw error;
        });
};
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


export { createBrandAPI, fetchAllBrandAPI, updateBrandAPI, deleteBrandAPI, fetchBrandByIdAPI , handleUploadFile };
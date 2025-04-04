// src/services/api.category.jsx
import axios from './axios.customize';

const createCategoryAPI = (name, description, parent_id) => {
    const URL_BACKEND = "/category";
    const data = {
        name: name,
        description: description,
        parent_id: parent_id,
    };
    return axios.post(URL_BACKEND, data);
};

const fetchAllCategoryAPI = (page, limit, keyword = "") => {
    let URL_BACKEND = `/category?page=${page}&limit=${limit}`;
    if (keyword) {
        URL_BACKEND += `&name=${keyword}`;
    }
    return axios.get(URL_BACKEND);
};

const updateCategoryAPI = (id, name, description, parent_id) => {
    const URL_BACKEND = `/category/${id}`;
    const data = {
        name: name,
        description: description,
        parent_id: parent_id,
    };
    return axios.patch(URL_BACKEND, data);
};

const deleteCategoryAPI = (id) => {
    const URL_BACKEND = `/category/${id}`;
    return axios.delete(URL_BACKEND);
};

const fetchCategoryByIdAPI = (id) => {
    const URL_BACKEND = `/category/${id}`;
    return axios.get(URL_BACKEND)
        .then(response => response)
        .catch(error => {
            console.error("Error fetching category:", error);
            throw error;
        });
};


export { createCategoryAPI, fetchAllCategoryAPI, updateCategoryAPI, deleteCategoryAPI, fetchCategoryByIdAPI };
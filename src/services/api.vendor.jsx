// src/services/api.vendor.jsx
import axios from './axios.customize';

// POST /vendors
const createVendorAPI = (name, email, phoneNumber, address, websiteUrl, logo, description) => {
    const URL_BACKEND = "/vendors";
    const data = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        websiteUrl: websiteUrl,
        logo: logo, // Assuming 'logo' is the filename after upload
        description: description,
    };
    return axios.post(URL_BACKEND, data);
};

// GET /vendors?page=1&limit=10&name=ABC&isActive=true
const fetchAllVendorAPI = (page, limit, name = "", email = "") => {
    let URL_BACKEND = `/vendors?page=${page}&limit=${limit}`;
    if (name) {
        URL_BACKEND += `&name=${name}`;
    }
    if (email) {
        URL_BACKEND += `&email=${email}`;
    }
    // if (isActive !== null) { // Only add if isActive is specified (true or false)
    //     URL_BACKEND += `&isActive=${isActive}`;
    //}
    console.log("Fetching vendors URL:", URL_BACKEND); // Debug log
    return axios.get(URL_BACKEND);
};

// GET /vendors/:id
const fetchVendorByIdAPI = (id) => {
    const URL_BACKEND = `/vendors/${id}`;
    return axios.get(URL_BACKEND);
};

// PATCH /vendors/:id
const updateVendorAPI = (id, name, email, phoneNumber, address, websiteUrl, logo, description, isActive) => {
    const URL_BACKEND = `/vendors/${id}`;
    const data = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        websiteUrl: websiteUrl,
        logo: logo,
        description: description,
        isActive: isActive, // Include isActive for updates
    };
    return axios.patch(URL_BACKEND, data);
};

// DELETE /vendors/:id (Soft Delete)
const deleteVendorAPI = (id) => {
    const URL_BACKEND = `/vendors/${id}`;
    return axios.delete(URL_BACKEND);
};

// Re-use or copy the existing file upload handler if needed for logos
// Assuming it's globally accessible or imported from where it's defined (e.g., api.service.jsx)
// If not, copy the function here:
/*
const handleUploadFile = (file, folder) => {
    const URL_BACKEND = `/files/upload`; // Adjust if your upload endpoint is different
    let config = {
        headers: {
            "folder_type": folder, // Use 'vendor' or similar for the folder
            "Content-Type": "multipart/form-data",
        }
    }
    const bodyFormData = new FormData();
    bodyFormData.append("fileUpload", file);
    return axios.post(URL_BACKEND, bodyFormData, config);
}
*/
// Ensure handleUploadFile is imported/available if used within vendor components

export {
    createVendorAPI,
    fetchAllVendorAPI,
    fetchVendorByIdAPI,
    updateVendorAPI,
    deleteVendorAPI,
    // handleUploadFile, // Export if defined here and needed
};
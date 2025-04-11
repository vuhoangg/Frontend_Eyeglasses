// src/services/api.role.jsx
import axios from './axios.customize';

/**
 * Fetches roles with pagination and optional keyword search.
 *
 * @param {number} page - The page number to fetch (defaults to 1).
 * @param {number} limit - The number of items per page (defaults to 10).
 * @param {string} [keyword=""] - Optional keyword to search by role name.
 *                                (Backend needs to support searching by the 'name' query parameter).
 * @returns {Promise} Axios promise
 */
const fetchAllRolesAPI = (page = 1, limit = 10, keyword = "") => {
    // Start building the URL with base path and pagination
    let URL_BACKEND = `/roles?page=${page}&limit=${limit}`;

    // Add keyword search parameter if provided
    // *** Backend cần hỗ trợ tìm kiếm qua query parameter 'name' ***
    if (keyword) {
        URL_BACKEND += `&name=${keyword}`; // Giả định backend tìm theo 'name'
    }

    console.log("Fetching Roles URL (Simple):", URL_BACKEND); // For debugging
    return axios.get(URL_BACKEND);
};

/**
 * Fetches all *active* roles, specifically for dropdowns/selections.
 * This remains useful for Create/Update User forms.
 * @returns {Promise} Axios promise
 */
const fetchAllActiveRolesAPI = () => {
    // Fetch active roles (backend filters by isActive=true by default or via query param)
    // Using a large limit to get most/all active roles for selection.
    const URL_BACKEND = `/roles?page=1&limit=100&isActive=true`; // Assuming backend supports isActive filter
    return axios.get(URL_BACKEND);
};


// --- Các hàm API khác cho Role (nếu cần) ---
// const createRoleAPI = (name, description, permissions) => { ... }
// const updateRoleAPI = (id, name, description, permissions) => { ... }
// const deleteRoleAPI = (id) => { ... }
// --- ---

export {
    fetchAllRolesAPI,       // Hàm tổng quát cho trang quản lý Role
    fetchAllActiveRolesAPI  // Hàm chuyên dụng cho dropdown chọn Role
    // Export other role API functions here if created
};
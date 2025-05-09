// src/services/api.role.jsx
import axios from './axios.customize';

/**
 * Fetches roles with pagination and optional keyword search.
 * Backend endpoint: GET /roles
 * Query params: page, limit, name (optional), isActive (optional)
 */
const fetchAllRolesAPI = (page = 1, limit = 10, keyword = "", isActive = undefined) => {
    let URL_BACKEND = `/roles?page=${page}&limit=${limit}`;
    if (keyword) {
        URL_BACKEND += `&name=${keyword}`; // Giả định backend tìm theo 'name'
    }
    if (isActive !== undefined) {
        URL_BACKEND += `&isActive=${isActive}`; // Thêm bộ lọc isActive nếu được cung cấp
    }
    console.log("Fetching Roles URL:", URL_BACKEND);
    return axios.get(URL_BACKEND);
};

/**
 * Fetches all *active* roles, useful for dropdowns.
 * Backend endpoint: GET /roles?isActive=true&limit=1000 (adjust limit as needed)
 */
const fetchAllActiveRolesAPI = () => {
    // Using a large limit to try and get all active roles
    const URL_BACKEND = `/roles?page=1&limit=1000&isActive=true`;
    return axios.get(URL_BACKEND);
};

/**
 * Creates a new role.
 * Backend endpoint: POST /roles
 * Body: { name: string, description?: string, permissions?: number[] }
 */
const createRoleAPI = (name, description, permissions) => {
    const URL_BACKEND = "/roles";
    const data = {
        name: name,
        description: description,
        permissions: permissions || [] // Đảm bảo permissions là mảng
    };
    return axios.post(URL_BACKEND, data);
};

/**
 * Updates an existing role by ID.
 * Backend endpoint: PATCH /roles/:id
 * Body: { name?: string, description?: string, permissions?: number[], isActive?: boolean }
 */
const updateRoleAPI = (id, name, description, permissions, isActive) => {
    const URL_BACKEND = `/roles/${id}`;
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (permissions !== undefined) data.permissions = permissions; // Phải là mảng IDs
    if (isActive !== undefined) data.isActive = isActive; // Thêm nếu cần cập nhật trạng thái active

    return axios.patch(URL_BACKEND, data);
};

/**
 * Deletes a role (soft delete by setting isActive=false).
 * Backend endpoint: DELETE /roles/:id
 */
const deleteRoleAPI = (id) => {
    const URL_BACKEND = `/roles/${id}`;
    return axios.delete(URL_BACKEND);
};

/**
 * Fetches a single role by ID.
 * Backend endpoint: GET /roles/:id
 */
const fetchRoleByIdAPI = (id) => {
    const URL_BACKEND = `/roles/${id}`;
    return axios.get(URL_BACKEND);
};


export {
    fetchAllRolesAPI,
    fetchAllActiveRolesAPI,
    createRoleAPI,
    updateRoleAPI,
    deleteRoleAPI,
    fetchRoleByIdAPI
};
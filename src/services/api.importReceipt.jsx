// src/services/api.importReceipt.jsx
import axios from './axios.customize';

// POST /import-receipts
const createImportReceiptAPI = (vendorId, details, receiptCode, notes, importDate, status) => {
    const URL_BACKEND = "/import-receipts";
    const data = {
        vendorId: vendorId,
        details: details.map(item => ({ // Ensure details match the DTO structure
            productId: item.productId,
            quantity: item.quantity,
            importPrice: item.importPrice,
        })),
        receiptCode: receiptCode,
        notes: notes,
        importDate: importDate, // Should be ISO string format if provided e.g., "2024-05-21T10:00:00Z"
        status: status, // e.g., 'PENDING' or 'COMPLETED'
    };
    return axios.post(URL_BACKEND, data);
};

// GET /import-receipts?page=1&limit=10&vendorId=1&status=PENDING&startDate=...&endDate=...
const fetchAllImportReceiptAPI = (page, limit, vendorId = null, receiptCode = "", status = "", startDate = "", endDate = "") => {
    let URL_BACKEND = `/import-receipts?page=${page}&limit=${limit}`;
    if (vendorId) {
        URL_BACKEND += `&vendorId=${vendorId}`;
    }
    if (receiptCode) {
        URL_BACKEND += `&receiptCode=${receiptCode}`;
    }
    if (status) {
        URL_BACKEND += `&status=${status}`;
    }
     if (startDate) {
        URL_BACKEND += `&startDate=${startDate}`; // Expect ISO date string
    }
    if (endDate) {
        URL_BACKEND += `&endDate=${endDate}`;     // Expect ISO date string
    }
    // if (isActive !== null) {
    //     URL_BACKEND += `&isActive=${isActive}`;
    // }
    console.log("Fetching import receipts URL:", URL_BACKEND); // Debug log
    return axios.get(URL_BACKEND);
};

// GET /import-receipts/:id
const fetchImportReceiptByIdAPI = (id) => {
    const URL_BACKEND = `/import-receipts/${id}`;
    return axios.get(URL_BACKEND);
};

// PATCH /import-receipts/:id
// IMPORTANT: This API CANNOT update details array based on backend logic.
// It's primarily for updating notes, status, receiptCode, isActive etc.
const updateImportReceiptAPI = (id, vendorId, receiptCode, notes, importDate, status, isActive) => {
    const URL_BACKEND = `/import-receipts/${id}`;
    const data = {
        // You might not need to send vendorId or importDate for updates unless your backend allows it
         ...(vendorId && { vendorId }), // Conditionally include vendorId if needed
         ...(receiptCode && { receiptCode }),
         ...(notes && { notes }),
         ...(importDate && { importDate }),
         ...(status && { status }), // Crucial for triggering stock updates
         ...(isActive !== undefined && { isActive }), // Allow updating isActive
    };
    return axios.patch(URL_BACKEND, data);
};

// DELETE /import-receipts/:id (Soft Delete)
const deleteImportReceiptAPI = (id) => {
    const URL_BACKEND = `/import-receipts/${id}`;
    return axios.delete(URL_BACKEND);
};


// You might need an API to fetch products for the create/update form's product selection
// Re-use fetchAllProductAPI from api.product.jsx
// import { fetchAllProductAPI } from './api.product';

// You might need an API to fetch vendors for the create/update form's vendor selection
// Re-use fetchAllVendorAPI from api.vendor.jsx

export {
    createImportReceiptAPI,
    fetchAllImportReceiptAPI,
    fetchImportReceiptByIdAPI,
    updateImportReceiptAPI,
    deleteImportReceiptAPI,
};
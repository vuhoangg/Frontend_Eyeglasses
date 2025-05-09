// src/services/api.importReceipt.jsx
import axios from './axios.customize';

// POST /import-receipts
const createImportReceiptAPI = (vendorId, details, receiptCode, notes, importDate, status) => {
    const URL_BACKEND = "/import-receipts";
    const data = {
        vendorId: vendorId,
        details: details.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            importPrice: item.importPrice,
        })),
        receiptCode: receiptCode,
        notes: notes,
        importDate: importDate,
        status: status,
    };
    return axios.post(URL_BACKEND, data);
};

// GET /import-receipts?page=1&limit=10&vendorId=1&status=PENDING&startDate=...&endDate=...&sortBy=creationDate&sortOrder=DESC
const fetchAllImportReceiptAPI = (page, limit, vendorId = null, receiptCode = "", status = "", startDate = "", endDate = "", sortBy = "", sortOrder = "") => {
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
        URL_BACKEND += `&startDate=${startDate}`;
    }
    if (endDate) {
        URL_BACKEND += `&endDate=${endDate}`;
    }
    if (sortBy) {
        URL_BACKEND += `&sortBy=${sortBy}`;
    }
    if (sortOrder) {
        URL_BACKEND += `&sortOrder=${sortOrder}`;
    }
    console.log("Fetching import receipts URL:", URL_BACKEND);
    return axios.get(URL_BACKEND);
};

// GET /import-receipts/:id
const fetchImportReceiptByIdAPI = (id) => {
    const URL_BACKEND = `/import-receipts/${id}`;
    return axios.get(URL_BACKEND);
};

// PATCH /import-receipts/:id
const updateImportReceiptAPI = (id, vendorId, receiptCode, notes, importDate, status, isActive) => {
    const URL_BACKEND = `/import-receipts/${id}`;
    const data = {
         ...(vendorId && { vendorId }),
         ...(receiptCode && { receiptCode }),
         ...(notes && { notes }),
         ...(importDate && { importDate }),
         ...(status && { status }),
         ...(isActive !== undefined && { isActive }),
    };
    return axios.patch(URL_BACKEND, data);
};

// DELETE /import-receipts/:id (Soft Delete)
const deleteImportReceiptAPI = (id) => {
    const URL_BACKEND = `/import-receipts/${id}`;
    return axios.delete(URL_BACKEND);
};

export {
    createImportReceiptAPI,
    fetchAllImportReceiptAPI,
    fetchImportReceiptByIdAPI,
    updateImportReceiptAPI,
    deleteImportReceiptAPI,
};
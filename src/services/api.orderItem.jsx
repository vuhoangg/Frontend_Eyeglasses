// src/services/api.orderItem.jsx
import axios from './axios.customize';

/**
 * Creates a single order item.
 * WARNING: This function is provided based on user request, but calling it
 * repeatedly from the frontend after creating an order is NOT RECOMMENDED
 * due to atomicity and performance issues. The backend's order creation
 * service should ideally handle creating associated order items within a transaction.
 *
 * @param {number} orderId - The ID of the order this item belongs to (obtained after creating the order).
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The quantity of the product.
 * @param {number} price - The price of the product at the time of order.
 * @returns {Promise<AxiosResponse<any>>}
 */
const createOrderItemAPI = (orderId, productId, quantity, price) => {
    const URL_BACKEND = `/order-items`; // Endpoint POST /order-items của bạn
    const data = {
        order_id: orderId,     // Backend DTO/Entity cần trường này (dựa trên code backend bạn cung cấp)
        product_id: productId, // Backend DTO/Entity cần trường này
        quantity: quantity,
        price: price,
    };
    console.warn(`[Frontend Call] Creating OrderItem for Order ID: ${orderId}, Product ID: ${productId}. This approach has risks!`);
    return axios.post(URL_BACKEND, data);
};

// Các hàm fetch khác có thể giữ lại nếu bạn cần xem chi tiết order item sau này
/**
 * Fetches all order items, potentially filtered.
 * @param {number} page
 * @param {number} limit
 * @param {number} [orderId]
 * @param {number} [productId]
 * @returns {Promise<AxiosResponse<any>>}
 */
const fetchAllOrderItemsAPI = (page, limit, orderId = null, productId = null) => {
    let URL_BACKEND = `/order-items?page=${page}&limit=${limit}`;
    if (orderId) {
        URL_BACKEND += `&order_id=${orderId}`;
    }
    if (productId) {
        URL_BACKEND += `&product_id=${productId}`;
    }
    console.log(`Fetching order items: ${URL_BACKEND}`);
    return axios.get(URL_BACKEND);
};

/**
 * Fetches details of a specific order item by its ID.
 * @param {number} id - The ID of the order item.
 * @returns {Promise<AxiosResponse<any>>}
 */
const fetchOrderItemByIdAPI = (id) => {
    const URL_BACKEND = `/order-items/${id}`;
    console.log(`Fetching order item by ID: ${URL_BACKEND}`);
    return axios.get(URL_BACKEND);
};

const fetchOrderItemsByOrderIdAPI = (orderId) => {
    const URL_BACKEND = `/order-items/by-order/${orderId}`; // New endpoint
    console.log(`Fetching order items by Order ID: ${URL_BACKEND}`);
    return axios.get(URL_BACKEND);
};


export {
    createOrderItemAPI, // Export hàm tạo để gọi từ CheckoutPage
    fetchAllOrderItemsAPI,
    fetchOrderItemByIdAPI,
    fetchOrderItemsByOrderIdAPI,
};
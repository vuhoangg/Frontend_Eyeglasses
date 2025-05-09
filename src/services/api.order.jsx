// src/services/api.order.jsx
import axios from './axios.customize';

const createOrderAPI = (userId, orderItems, shippingAddress, paymentMethod, totalAmount, promotionId = null, orderStatusId = 1) => {
    const URL_BACKEND = `/orders`;
    const data = {
        user_id: userId,
        orderItems: orderItems.map(item => ({
            productId: item.productId, // Đảm bảo khớp với cấu trúc item trong giỏ hàng của bạn
            quantity: item.quantity,
            price: item.price // Giá tại thời điểm đặt hàng
        })),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        totalAmount: totalAmount, // Backend có thể tính lại dựa trên items và promotion
        promotion_id: promotionId,
        order_status_id: orderStatusId // Mặc định là 'Chờ xử lý' (ID=1)
    };
    return axios.post(URL_BACKEND, data);
};

// Cập nhật hàm fetchAllOrdersAPI
const fetchAllOrdersAPI = (page, limit, customerName = "", orderStatusId = null, sortBy = "creationDate", sortOrder = "DESC", isActive = null) => {
    let URL_BACKEND = `/orders?page=${page}&limit=${limit}`;

    if (customerName) {
        URL_BACKEND += `&customerName=${encodeURIComponent(customerName)}`;
    }
    if (orderStatusId !== null && orderStatusId !== undefined && orderStatusId !== '') { // Kiểm tra kỹ hơn
        URL_BACKEND += `&order_status_id=${orderStatusId}`;
    }
    if (sortBy) {
        URL_BACKEND += `&sortBy=${sortBy}`;
    }
    if (sortOrder) {
        URL_BACKEND += `&sortOrder=${sortOrder}`;
    }
    if (isActive !== null) {
        URL_BACKEND += `&isActive=${isActive}`;
    }
    console.log("Fetching orders URL:", URL_BACKEND);
    return axios.get(URL_BACKEND);
};

const fetchOrderByIdAPI = (id) => {
    const URL_BACKEND = `/orders/${id}`;
    return axios.get(URL_BACKEND);
};

// Đảm bảo các tham số của updateOrderAPI khớp với backend
const updateOrderAPI = (id, userId, orderStatusId, totalAmount, shippingAddress, paymentMethod, promotionId, isActive) => {
    const URL_BACKEND = `/orders/${id}`;
    const data = {};
    // Chỉ thêm vào data nếu giá trị không phải là undefined để tránh ghi đè không mong muốn ở backend
    if (userId !== undefined) data.user_id = userId;
    if (orderStatusId !== undefined) data.order_status_id = orderStatusId;
    if (totalAmount !== undefined) data.totalAmount = totalAmount;
    if (shippingAddress !== undefined) data.shippingAddress = shippingAddress;
    if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
    if (promotionId !== undefined) data.promotion_id = promotionId; // Cho phép gửi null để xóa promotion
    if (isActive !== undefined) data.isActive = isActive;

    return axios.patch(URL_BACKEND, data);
};

const deleteOrderAPI = (id) => {
    const URL_BACKEND = `/orders/${id}`;
    return axios.delete(URL_BACKEND);
};

export {
    createOrderAPI,
    fetchAllOrdersAPI,
    fetchOrderByIdAPI,
    updateOrderAPI,
    deleteOrderAPI,
};
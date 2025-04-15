//src/services/api.order.jsx
import axios from './axios.customize'; // Đảm bảo đường dẫn đúng

const createOrderAPI = (userId, cartItems, shippingAddress, paymentMethod, totalAmount) => {
    const URL_BACKEND = `/orders`;
    const data = {
        user_id: userId, // Thay đổi userId thành user_id
        cartItems: cartItems.map(item => ({
            productId: item.id, // Assuming 'id' is product ID
            quantity: item.quantity,
            price: item.price
        })),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        totalAmount: totalAmount,
        order_status_id: 1 // ID trạng thái đơn hàng mặc định (ví dụ: 1 là "Đang xử lý")
    };

    return axios.post(URL_BACKEND, data);
};

const fetchAllOrdersAPI = (page, limit, userId = null, orderStatusId = null, isActive = null) => {
    let URL_BACKEND = `/orders?page=${page}&limit=${limit}`;

    if (userId) {
        URL_BACKEND += `&user_id=${userId}`;
    }
    if (orderStatusId) {
        URL_BACKEND += `&order_status_id=${orderStatusId}`;
    }
    if (isActive !== null) {
        URL_BACKEND += `&isActive=${isActive}`;
    }

    return axios.get(URL_BACKEND);
};

const fetchOrderByIdAPI = (id) => {
    const URL_BACKEND = `/orders/${id}`;
    return axios.get(URL_BACKEND);
};

const updateOrderAPI = (id, userId, orderStatusId, totalAmount, shippingAddress, paymentMethod, promotionId) => {
    const URL_BACKEND = `/orders/${id}`;
    const data = {
        user_id: userId,
        order_status_id: orderStatusId,
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        promotion_id: promotionId,
    };
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
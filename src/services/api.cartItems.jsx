// api.cartItem.jsx
import axios from './axios.customize';

const fetchAllCartItemsAPI = (page, limit, userId) => {
  let URL_BACKEND = `/cart-items?page=${page}&limit=${limit}`;
  if (userId) {
      URL_BACKEND += `&user_id=${userId}`; // Lọc theo userId
  }
  return axios.get(URL_BACKEND);
};

const createCartItemAPI = (productId, quantity, price, color, size) => {
  const URL_BACKEND = `/cart-items`;
  const data = {
    product_id: productId,
    quantity: quantity,
    price: price, // Nên lấy giá từ product trên backend thay vì truyền từ frontend để đảm bảo đúng giá
    color: color,
    size: size,
  };
  // Backend sẽ tự lấy userId từ token
  return axios.post(URL_BACKEND, data);
};

const updateCartItemAPI = (id, quantity, color, size) => {
  const URL_BACKEND = `/cart-items/${id}`; // id ở đây là cart_item_id
  const data = {
    quantity: quantity,
    color: color,
    size: size
  };
  // Backend sẽ tự lấy userId từ token và kiểm tra quyền sở hữu cart item
  return axios.patch(URL_BACKEND, data);
};

const deleteCartItemAPI = (id) => { // id ở đây là cart_item_id
  const URL_BACKEND = `/cart-items/${id}`;
  // Backend sẽ tự lấy userId từ token và kiểm tra quyền sở hữu cart item
  return axios.delete(URL_BACKEND);
};

// --- NEW FUNCTION ---
// Hàm này cần backend hỗ trợ endpoint tương ứng, ví dụ: DELETE /cart-items/user
// Hoặc có thể lặp và gọi deleteCartItemAPI cho từng item nếu không có endpoint xóa hàng loạt
const deleteAllCartItemsForUserAPI = (userId) => {
  // Giả định endpoint là /cart-items/user/:userId
  // Nếu không có, bạn cần lấy hết cart item ID của user rồi gọi deleteCartItemAPI lặp lại
  const URL_BACKEND = `/cart-items/user/${userId}`; // Cần endpoint này trên backend
  console.warn("deleteAllCartItemsForUserAPI assumes a backend endpoint DELETE /cart-items/user/:userId exists.");
  return axios.delete(URL_BACKEND);
};
// --- END NEW FUNCTION ---


export {
    fetchAllCartItemsAPI,
    createCartItemAPI,
    updateCartItemAPI,
    deleteCartItemAPI,
    deleteAllCartItemsForUserAPI // Export hàm mới
};
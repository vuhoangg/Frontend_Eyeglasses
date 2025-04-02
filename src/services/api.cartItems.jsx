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


// --- HÀM XÓA CỨNG TẤT CẢ CART ITEMS CỦA USER (Đơn giản hóa) ---
const clearMyCartAPI = () => {
  const URL_BACKEND = `/cart-items/my-cart/clear`; // Endpoint xóa cứng mới
  console.log(`Requesting hard cart deletion: ${URL_BACKEND}`);
  return axios.delete(URL_BACKEND);
};
// --- KẾT THÚC HÀM MỚI ---

export {
    fetchAllCartItemsAPI,
    createCartItemAPI,
    updateCartItemAPI,
    deleteCartItemAPI,
 
    clearMyCartAPI // Đổi tên hàm export cho phù hợp
};
//src/services/api.service.jsx
import axios from './axios.customize';

const createProductAPI = (name, description, price, stock_quantity, category_id, brand_id, imageProduct, sku) => {
  const URL_BACKEND = "/product";
  const data = {
    name: name,
    description: description,
    price: price,
    stock_quantity: stock_quantity,
    category_id: category_id,
    brand_id: brand_id,
    imageProduct: imageProduct,
    sku: sku,
  };
  return axios.post(URL_BACKEND, data);
};

// const fetchAllProductAPI = (page, limit, keyword = "") => {
//   let URL_BACKEND = `/product?page=${page}&limit=${limit}`;
//   if (keyword) {
//     URL_BACKEND += `&name=${keyword}`;  // Tìm kiếm theo tên sản phẩm
//   }
//   return axios.get(URL_BACKEND);
// };

const fetchAllProductAPI = (page, limit, keyword = "", category_id = null, brand_id = null) => {
  let URL_BACKEND = `/product?page=${page}&limit=${limit}`;
  if (keyword) {
      URL_BACKEND += `&name=${keyword}`;  // Tìm kiếm theo tên sản phẩm
  }

  if (category_id) {
      URL_BACKEND += `&category_id=${category_id}`; // Filter by category
  }

  if (brand_id) {
      URL_BACKEND += `&brand_id=${brand_id}`;   // Filter by brand
  }

  return axios.get(URL_BACKEND);
};

const updateProductAPI = (id, name, description, price, stock_quantity, category_id, brand_id, imageProduct, sku) => {
  const URL_BACKEND = `/product/${id}`;
  const data = {
    name: name,
    description: description,
    price: price,
    stock_quantity: stock_quantity,
    category_id: category_id,
    brand_id: brand_id,
    imageProduct: imageProduct,
    sku: sku,
  };
  return axios.patch(URL_BACKEND, data);
};

const deleteProductAPI = (id) => {
  const URL_BACKEND = `/product/${id}`;
  return axios.delete(URL_BACKEND);
};

const fetchProductByIdAPI = (id) => {
  const URL_BACKEND = `/product/${id}`;
  return axios.get(URL_BACKEND)
      .then(response => {
          console.log("Data from API:", response.data); // Log data
          return response;  // Return the entire response
      })
      .catch(error => {
          console.error("Error fetching product:", error);
          throw error; // Re-throw the error
      });
};

const handleUploadFile = (file, folder )=>{
    const URL_BACKEND = `/files/upload`;
    let config = {
        headers: {
            "folder_type": folder,
            "Content-Type": "multipart/form-data",
        }
    }
    const bodyFormData = new FormData();
    bodyFormData.append("fileUpload", file )
    return axios.post(URL_BACKEND, bodyFormData, config )
}

const fetchLatestProductsAPI = () => { // New API call for latest products
  const URL_BACKEND = `/product/latest`;
  return axios.get(URL_BACKEND);
};


const fetchBestSellingProductsAPI = () => {
  const URL_BACKEND = `/product/best-selling`;
  return axios.get(URL_BACKEND);
};

export { createProductAPI, fetchAllProductAPI, updateProductAPI, deleteProductAPI, handleUploadFile,  fetchProductByIdAPI , 
  fetchLatestProductsAPI, // Export new API call
  fetchBestSellingProductsAPI,
 };
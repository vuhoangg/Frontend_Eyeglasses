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

const fetchAllProductAPI = (page, limit, keyword = "") => {
  let URL_BACKEND = `/product?page=${page}&limit=${limit}`;
  if (keyword) {
    URL_BACKEND += `&name=${keyword}`;  // Tìm kiếm theo tên sản phẩm
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

export { createProductAPI, fetchAllProductAPI, updateProductAPI, deleteProductAPI, handleUploadFile };
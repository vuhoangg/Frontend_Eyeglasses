import { Form, Input, Button, Row, Col, notification, Modal, InputNumber } from "antd";
import React, { useState, useEffect } from "react";
import { updateProductAPI, handleUploadFile } from "../../../services/api.product";

const UpdateProduct = ({ isModalOpen, setIsModalOpen, productData, reloadProducts }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock_quantity, setStockQuantity] = useState(0);
  const [category_id, setCategoryId] = useState(0);
  const [brand_id, setBrandId] = useState(0);
  // const [imageProduct, setImageProduct] = useState(""); // Không cần nữa
  const [sku, setSku] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [initialImage, setInitialImage] = useState(""); // Lưu URL ảnh ban đầu

  const [form] = Form.useForm();

  useEffect(() => {
    if (productData) {
      setId(productData.id || "");
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || 0);
      setStockQuantity(productData.stock_quantity || 0);
      setCategoryId(productData.category_id || 0);
      setBrandId(productData.brand_id || 0);
      setSku(productData.sku || "");
      setInitialImage(productData.imageProduct || ""); // Lưu URL ảnh ban đầu

      form.setFieldsValue({
        id: productData.id || "",
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || 0,
        stock_quantity: productData.stock_quantity || 0,
        category_id: productData.category_id || 0,
        brand_id: productData.brand_id || 0,
        sku: productData.sku || "",
      });
    }
    // Reset trạng thái upload khi mở modal
    setSelectedFile(null);
    setPreview(null);
  }, [productData, form]);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOnChangeFile = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onFinish = (values) => {
    console.log("Form Data:", values);
  };

  const handleSubmit = async () => {
    try {
      let imageProduct = initialImage; // Giữ ảnh cũ nếu không có ảnh mới

      if (selectedFile) {
        // Upload ảnh mới nếu có
        const resUpload = await handleUploadFile(selectedFile, "product");
        if (resUpload.data) {
          imageProduct = resUpload.data.fileName;
        } else {
          notification.error({
            message: "Update Product",
            description: "Failed to upload image.",
          });
          return;
        }
      }

      const response = await updateProductAPI(id, name, description, price, stock_quantity, category_id, brand_id, imageProduct, sku);

      if (response.data) {
        notification.success({
          message: "Update Product",
          description: "Product updated successfully!",
        });
        setIsModalOpen(false);
        reloadProducts();
      } else {
        notification.error({
          message: "Update Product",
          description: response.message || "Failed to update product.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Update Product",
        description: error.response?.data?.message || "Failed to update product.",
      });
    }
  };

  return (
    <Modal
      title="Update Product"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter product name" }]}>
              <Input placeholder="Enter product name" onChange={(e) => setName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter description" }]}>
              <Input placeholder="Enter description" onChange={(e) => setDescription(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter price" }]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter price"
                formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/(,*)/g, "")}
                onChange={(value) => setPrice(value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Stock Quantity" name="stock_quantity" rules={[{ required: true, message: "Please enter stock quantity" }]}>
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter stock quantity"
                onChange={(value) => setStockQuantity(value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Category ID" name="category_id" rules={[{ required: true, message: "Please enter category ID" }]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter category ID" onChange={(value) => setCategoryId(value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Brand ID" name="brand_id" rules={[{ required: true, message: "Please enter brand ID" }]}>
              <InputNumber style={{ width: "100%" }} placeholder="Enter brand ID" onChange={(value) => setBrandId(value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="SKU" name="sku" rules={[{ required: true, message: "Please enter SKU" }]}>
              <Input placeholder="Enter SKU" onChange={(e) => setSku(e.target.value)} />
            </Form.Item>
          </Col>

            {/* Thêm upload ảnh vào đây */}
            <Col span={12}>

            <div style={{ marginTop: "30px", position: "relative" }} >
                <label htmlFor="btnUpload" style={{
                  display: "block",
                  width: "fit-content",
                  marginTop: "15px",
                  padding: "5px 10px ",
                  background: "orange",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}>
                  Upload Image
                </label>
                <input
                  hidden
                  id='btnUpload'
                  type="file"
                  onChange={(event) => handleOnChangeFile(event)} 
                 style={{ position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0, // Ẩn input file
                    cursor: "pointer",
                  }}
                />
              </div>

              {preview ? (
                <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                  <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Product Preview" />
                </div>
              ) : (
                initialImage && (
                  <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                    <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={`http://localhost:8082/images/product/${initialImage}`} alt="Product Preview" />
                  </div>
                )
              )}
            </Col>

        </Row>

        {/* <Row gutter={16}>
          <Col span={12}>
              <div style={{ position: "relative" }} >
                <label htmlFor="btnUpload" style={{
                  display: "block",
                  width: "fit-content",
                  marginTop: "15px",
                  padding: "5px 10px ",
                  background: "orange",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}>
                  Upload Image
                </label>
                <input
                  hidden
                  id='btnUpload'
                  type="file"
                  onChange={(event) => handleOnChangeFile(event)} 
                  accept="image/png, image/jpeg"  style={{ position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0, // Ẩn input file
                    cursor: "pointer",
                  }}
                />
              </div>
           
                {preview ? (
                  <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                    <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Product Preview" />
                  </div>
                ) : (
                  initialImage && (
                    <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                      <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={`http://localhost:8082/images/product/${initialImage}`} alt="Product Preview" />
                    </div>
                  )
                )}
          
          </Col>
        </Row> */}

        <Row justify="end" gutter={16}>
          <Col>
            <Button onClick={handleCancel}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Update Product
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateProduct;
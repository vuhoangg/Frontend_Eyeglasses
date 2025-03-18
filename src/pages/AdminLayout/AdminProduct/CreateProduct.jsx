import { Form, Input, Button, Row, Col, notification, InputNumber } from "antd";
import React, { useState } from "react";
import { createProductAPI, handleUploadFile } from "../../../services/api.product";

const CreateProduct = () => {
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


  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Data:", values);
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

  const handleSubmit = async () => {
    try {
      if (!selectedFile) {
        notification.error({
          message: "Create Product",
          description: "Please upload an image for the product.",
        });
        return; // Dừng nếu không có ảnh
      }

      // Upload ảnh trước
      const resUpload = await handleUploadFile(selectedFile, "product");
      if (resUpload.data) {
        const imageProduct = resUpload.data.fileName; // Lấy tên file ảnh từ response
          //console.log("imageProduct", imageProduct)
        // Tạo sản phẩm với tên file ảnh
        const response = await createProductAPI(name, description, price, stock_quantity, category_id, brand_id, imageProduct, sku);
        console.log("Response:", response.data);

        if (response.data) {
          notification.success({
            message: "Create Product",
            description: "Product created successfully!",
          });
          form.resetFields();
          setSelectedFile(null);
          setPreview(null); // Xóa preview sau khi tạo thành công
        } else {
          notification.error({
            message: "Create Product",
            description: "Failed to create product.",
          });
        }
      } else {
        notification.error({
          message: "Create Product",
          description: "Failed to upload image.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Create Product",
        description: error.response?.data?.message || "Failed to create product.",
      });
    }
  };

  return (
    <>
      <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 800, margin: "0 auto" }}>
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
        

            {preview && (
              <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Product Preview" />
              </div>
            )}
          </Col>
        </Row>

      

        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleSubmit} disabled={!selectedFile}>
            Create Product
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateProduct;
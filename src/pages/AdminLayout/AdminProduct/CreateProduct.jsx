import { Form, Input, Button, Row, Col, notification, InputNumber } from "antd";
import React, { useState } from "react";
import { createProductAPI } from "../../../services/api.product";

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock_quantity, setStockQuantity] = useState(0);
  const [category_id, setCategoryId] = useState(0);
  const [brand_id, setBrandId] = useState(0);
  const [imageProduct, setImageProduct] = useState("");
  const [sku, setSku] = useState("");

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form Data:", values);
  };

  const handleSubmit = async () => {
    try {
      const response = await createProductAPI(name, description, price, stock_quantity, category_id, brand_id, imageProduct, sku);
      console.log("Response:", response.data);

      if (response.data) {
        notification.success({
          message: "Create Product",
          description: "Product created successfully!",
        });
        form.resetFields(); // Clear form after successful creation
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
            <Form.Item label="Image Product" name="imageProduct" rules={[{ required: true, message: "Please enter image URL" }]}>
              <Input placeholder="Enter image URL" onChange={(e) => setImageProduct(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="SKU" name="sku" rules={[{ required: true, message: "Please enter SKU" }]}>
              <Input placeholder="Enter SKU" onChange={(e) => setSku(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleSubmit}>
            Create Product
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateProduct;
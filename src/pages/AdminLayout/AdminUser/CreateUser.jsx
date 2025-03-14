import { Form, Input, Button, Select, Row, Col } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";

const CreateUser = () => {
  // State cho từng trường input
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [roles, setRoles] = useState([]);

  const [form] = Form.useForm(); // Khởi tạo form instance của Ant Design

  // Cập nhật giá trị của Form.Item khi state thay đổi
  useEffect(() => {
    form.setFieldsValue({
      username,
      email,
      password,
      phone,
      firstName,
      lastName,
      address,
      roles,
    });
  }, [ username, email, password, phone, firstName, lastName, address, roles, form]);

  const onFinish = (values) => {
    console.log("Form Data:", values);
  };

  const handleSubmit = async () => {
    try {
      const URL_BACKEND = "http://localhost:8082/user";
      const userData = {
        username,
        email,
        password,
        phone,
        firstName,
        lastName,
        address,
        roles,
      };
  
      const response = await axios.post(URL_BACKEND, userData);
      console.log("Response:", response.data);
      alert("User created successfully!");
    } catch (error) {
      console.error("Lỗi khi lưu quyền:", error);
    }
  };

  console.log('>> check Fullname :', username , email,
    password,
    phone,
    firstName,
    lastName,
    address,
    roles, )

  return (
    <>
      <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 800, margin: "0" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter username" }]}>
              <Input placeholder="Enter username" onChange={(e) => setUserName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
              <Input placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter password" }]}>
              <Input.Password placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter phone number" }]}>
              <Input placeholder="Enter phone number" onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Please enter first name" }]}>
              <Input placeholder="Enter first name" onChange={(e) => setFirstName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Please enter last name" }]}>
              <Input placeholder="Enter last name" onChange={(e) => setLastName(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter address" }]}>
              <Input placeholder="Enter address" onChange={(e) => setAddress(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Roles" name="roles" rules={[{ required: true, message: "Please select role" }]}>
            <Input placeholder="Enter Roles " onChange={(e) => setRoles(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleSubmit}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateUser;

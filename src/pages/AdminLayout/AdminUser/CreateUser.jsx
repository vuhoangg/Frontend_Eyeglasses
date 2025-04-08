import { Form, Input, Button, Select, Row, Col, notification } from "antd";
import React, { useState, useEffect } from "react";
import { createUserAPI, handleUploadFile } from "../../../services/api.service";

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
  const [selectedRoleIds, setSelectedRoleIds] = useState([]); // State for selected role IDs
  const [selectedFile, setSelectedFile] = useState(null); // State for selected avatar file
  const [preview, setPreview] = useState(null); // State for avatar preview URL


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
      roleIds: selectedRoleIds,

    });
  }, [ username, email, password, phone, firstName, lastName, address, selectedRoleIds, form]); // Update dependency to selectedRoleIds

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
      let avatarFileName = null;

      if (selectedFile) {
        const resUpload = await handleUploadFile(selectedFile, "user");
        if (resUpload.data) {
          avatarFileName = resUpload.data.fileName;
        } else {
          notification.error({
            message: "Create User",
            description: "Failed to upload avatar.",
          });
          return; // Stop if avatar upload fails
        }
      }

      const response = await createUserAPI(
        username,
        email,
        password,
        phone,
        firstName,
        lastName,
        address,
        avatarFileName, // Use avatarFileName here
        selectedRoleIds // Use selectedRoleIds here
      );

      console.log("Response:", response.data);
      if(response.data) {
        notification.success({
          message: "Create User", description: "Create User Success "
        });
        form.resetFields(); // Reset form fields after successful creation
        setSelectedFile(null); // Clear selected file
        setPreview(null); // Clear preview
        setSelectedRoleIds([]); // Clear selected roles
      }
    } catch (error) {
      notification.error({
        message: "Create User", description: error.response?.data?.message || "Create User Error "
    })

    }
  };

  console.log('>> check Fullname :', username , email,
    password,
    phone,
    firstName,
    lastName,
    address,
    selectedRoleIds, preview )

    // Hàm xử lý khi thay đổi lựa chọn roles
    const handleRoleChange = (values) => {
        setSelectedRoleIds(values);
      };

      // Định nghĩa các options cho Select roles
  // Bạn có thể thay đổi danh sách này theo nhu cầu hoặc lấy từ API
  const roleOptions = [
    { label: "admin", value: 1 },
    { label: "customer", value: 2 },
    { label: "manager", value: 3 },

  ];

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
            <Form.Item
              label="Roles"
              name="roleIds"
              rules={[{ required: true, message: "Please select at least one role" }]}
            >
              <Select
                // mode="multiple"
                placeholder="Select Roles"
                onChange={handleRoleChange}
                options={roleOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
          <Form.Item label="Avatar" name="avartar">
              <div style={{ position: "relative" }} >
                <label htmlFor="btnUpload" style={{
                  display: "block",
                  width: "fit-content",
                  marginTop: "5px",
                  padding: "5px 10px ",
                  background: "orange",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}>
                  Upload Avatar
                </label>
                <input
                  hidden
                  id='btnUpload'
                  type="file"
                  onChange={(event) => handleOnChangeFile(event)}
                  accept="image/png, image/jpeg"
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
                  <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Avatar Preview" />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>


        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={handleSubmit} disabled={!username || !email || !password || !phone || !firstName || !lastName || !address || selectedRoleIds.length === 0}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateUser;
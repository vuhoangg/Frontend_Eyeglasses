import { Form, Input, Button, Row, Col, notification, Modal , Select } from "antd";
import React, { useState, useEffect } from "react";
import { updateUserAPI } from "../../../services/api.service";

const UpdateUser = ({ isModalOpen, setIsModalOpen, userData, reloadUsers }) => {
  // State for each input field
  const [id, setId] = useState("1");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]); 

  const [form] = Form.useForm(); // Initialize Ant Design form instance



  // Update form fields when userData changes
  useEffect(() => {
    if (userData) {
      setId(userData.id || "");
      setUserName(userData.username || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setAddress(userData.address || "");

          // Xử lý roles từ userData
          if (userData.roles && Array.isArray(userData.roles)) {
            setRoles(userData.roles);
            // Lấy ra mảng các ID từ danh sách roles
            const roleIds = userData.roles.map(role => role.id);
            setSelectedRoleIds(roleIds);
          }
    //   setRoles(userData.roles || []);

      // Update Ant Design form values
      form.setFieldsValue({
        id: userData.id || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        address: userData.address || "",
        roleIds: userData.roles?.map(role => role.id) || [], // Điền các ID role vào select
      });
    }
  }, [userData, form]);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log("Form Data:", values);
    handleSubmit();
  };

  const handleSubmit = async () => {
   
    try {
     // Chuẩn bị dữ liệu roles để gửi đi
        // const rolesData = selectedRoleIds.map(roleId => ({ id: roleId }));
        const response = await updateUserAPI(
        id,
        username,
        email,
        phone,
        firstName,
        lastName,
        address,
        selectedRoleIds // Gửi trực tiếp mảng các ID
        // rolesData // Gửi mảng các object roles với id
   
      );
      
      console.log("Response:", response.data);
      
      if (response.data) {
        notification.success({
          message: "Update User",
          description: "User updated successfully"
        });
        
        // Close modal and reload user list
        setIsModalOpen(false);
        if (reloadUsers) {
          reloadUsers();
        }
      }
    } catch (error) {
      notification.error({
        message: "Update User",
        description: error.response?.data?.message || "Error updating user"
      });
    }
  };

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
    <Modal
      title="Update User"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={900}
      height={1000}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item label="ID" name="id" >
            <Input disabled value={id} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Please enter username" }]}>
              <Input placeholder="Enter username" onChange={(e) => setUserName(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
        <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
              <Input placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
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
              label="Vai trò" 
              name="roleIds"
              rules={[{ required: true, message: "Vui lòng chọn ít nhất một vai trò" }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn vai trò"
                onChange={handleRoleChange}
                options={roleOptions}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" gutter={16}>
          <Col>
            <Button onClick={handleCancel}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Update User
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
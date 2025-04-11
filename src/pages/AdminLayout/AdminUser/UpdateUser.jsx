// src/pages/AdminLayout/AdminUser/UpdateUser.jsx
import { Form, Input, Button, Row, Col, notification, Modal , Select } from "antd";
import React, { useState, useEffect } from "react";
import { updateUserAPI, handleUploadFile } from "../../../services/api.service"; // Import handleUploadFile
import { fetchAllRolesAPI } from "../../../services/api.role"; // Import API đã sửa

const UpdateUser = ({ isModalOpen, setIsModalOpen, userData, reloadUsers }) => {
  // State for each input field
  const [id, setId] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file
  const [preview, setPreview] = useState(null); // State for preview image

  const [availableRoles, setAvailableRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [form] = Form.useForm();

  // Fetch roles when modal opens
  useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      try {
        const res = await fetchAllRolesAPI(1, 100);
        if (res.data && res.data.data) {
           const activeRoles = res.data.data.filter(role => role.isActive === true);
           const roleOptions = activeRoles.map(role => ({
            label: role.name,
            value: role.id
          }));
          setAvailableRoles(roleOptions);
        } else {
          notification.error({
            message: "Lỗi tải danh sách vai trò",
            description: res.message || "Không thể lấy dữ liệu vai trò từ server."
          });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi tải danh sách vai trò",
          description: error.message || "Có lỗi xảy ra khi gọi API."
        });
      } finally {
        setLoadingRoles(false);
      }
    };
    if (isModalOpen) {
        loadRoles();
    }
  }, [isModalOpen]);

  // Update form fields and states when userData changes
  useEffect(() => {
    if (userData) {
      setId(userData.id || "");
      setUserName(userData.username || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setAddress(userData.address || "");

      let initialRoleIds = [];
      if (userData.roles && Array.isArray(userData.roles)) {
        initialRoleIds = userData.roles.map(role => role.id);
        setSelectedRoleIds(initialRoleIds);
      } else {
         setSelectedRoleIds([]);
      }

      // Set preview if avatar exists
      setPreview(userData.avartar ? `http://localhost:8082/images/user/${userData.avartar}` : null);

      form.setFieldsValue({
        id: userData.id || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        address: userData.address || "",
        roleIds: initialRoleIds,
        avartar: userData.avartar || null, // Set avatar value in form
      });
    } else {
         form.resetFields();
         setId(""); setUserName(""); setEmail(""); setPhone(""); setFirstName(""); setLastName(""); setAddress("");
         setSelectedRoleIds([]);
         setSelectedFile(null);
         setPreview(null);
    }
  }, [userData, form, isModalOpen]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    console.log("Form Data on Finish:", values);
    const { username, email, phone, firstName, lastName, address, roleIds } = values;

     const userId = id || userData?.id;
     if (!userId) {
         notification.error({ message: "Update User", description: "Không tìm thấy ID người dùng."});
         return;
     }

     const rolesToSend = Array.isArray(roleIds) ? roleIds : (roleIds ? [roleIds] : []);
     let avatarFileName = userData?.avartar || null; // Default to existing avatar

    try {
      if (selectedFile) {
        const resUpload = await handleUploadFile(selectedFile, "user");
        if (resUpload.data && resUpload.data.fileName) {
          avatarFileName = resUpload.data.fileName;
        } else {
          notification.error({
            message: "Cập nhật User",
            description: resUpload.message || "Tải lên avatar thất bại.",
          });
          return;
        }
      }


      const response = await updateUserAPI(
        userId,
        username,
        email,
        phone,
        firstName,
        lastName,
        address,
        avatarFileName, // Use uploaded avatar file name or existing one
        rolesToSend
      );

      console.log("Update Response:", response);

      if (response.statusCode === 200 || response.data) {
        notification.success({
          message: "Update User",
          description: response.message || "Cập nhật User thành công"
        });

        setIsModalOpen(false);
        if (reloadUsers) {
          reloadUsers();
        }
      } else {
           notification.error({
            message: "Update User",
            description: response.message || "Có lỗi xảy ra khi cập nhật người dùng."
          });
      }
    } catch (error) {
        console.error("Update User Error:", error);
        notification.error({
            message: "Update User",
            description: error.response?.data?.message || error.message || "Cập nhật User thất bại"
        });
    }
  };

    const handleRoleChange = (values) => {
        setSelectedRoleIds(Array.isArray(values) ? values : (values ? [values] : []));
    };

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
          setSelectedFile(null);
          setPreview(null);
          form.setFieldsValue({ avartar: userData?.avartar || null }); // Reset to existing avatar or null
          return;
        }

        const file = event.target.files[0];
        if (file) {
          setSelectedFile(file);
          setPreview(URL.createObjectURL(file));
          form.setFieldsValue({ avartar: file.name }); // Optional: Update form field to filename for display
        }
      };


  return (
    <Modal
      title="Cập nhật người dùng"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={900}
      destroyOnClose={true}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item label="Mã tài khoản" name="id" >
                <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tên tài khoản" name="username" rules={[{ required: true, message: "Please enter username" }]}>
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
            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Please enter phone number" }]}>
              <Input placeholder="Enter phone number" onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên" name="firstName" rules={[{ required: true, message: "Please enter first name" }]}>
              <Input placeholder="Enter first name" onChange={(e) => setFirstName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Họ" name="lastName" rules={[{ required: true, message: "Please enter last name" }]}>
              <Input placeholder="Enter last name" onChange={(e) => setLastName(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Please enter address" }]}>
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
                 placeholder="Chọn vai trò"
                 onChange={handleRoleChange}
                 options={availableRoles}
                 loading={loadingRoles}
                 filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Avatar Upload Section - Added here */}
        <Row gutter={16}>
          <Col span={12}>
          <Form.Item label="Avatar" name="avartar">
              <div style={{ position: "relative" }} >
                <label htmlFor="btnUploadUpdate" style={{
                  display: "block",
                  width: "fit-content",
                  marginTop: "5px",
                  padding: "5px 10px ",
                  background: "orange",
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "white"
                }}>
                  Upload Avatar
                </label>
                <input
                  hidden
                  id='btnUploadUpdate'
                  type="file"
                  onChange={handleOnChangeFile}
                  style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
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
        {/* End Avatar Upload Section */}


        <Row justify="end" gutter={16}>
          <Col>
            <Button onClick={handleCancel}>Huỷ</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Cập nhật Tài khoản
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
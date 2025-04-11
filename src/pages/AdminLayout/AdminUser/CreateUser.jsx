// src/pages/AdminLayout/AdminUser/CreateUser.jsx
import { Form, Input, Button, Select, Row, Col, notification } from "antd";
import React, { useState, useEffect } from "react";
import { createUserAPI, handleUploadFile } from "../../../services/api.service";
import { fetchAllRolesAPI } from "../../../services/api.role"; // Sử dụng API đã sửa

const CreateUser = () => {
  // State cho từng trường input
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState([]); // State for selected role IDs
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [availableRoles, setAvailableRoles] = useState([]); // State để lưu danh sách roles từ API
  const [loadingRoles, setLoadingRoles] = useState(false); // State quản lý trạng thái loading roles

  const [form] = Form.useForm(); // Khởi tạo form instance của Ant Design

  // Fetch roles khi component mount
  useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      try {
        // Gọi API fetchAllRolesAPI (phiên bản đơn giản)
        // Bạn có thể thêm page, limit nếu cần, ví dụ: fetchAllRolesAPI(1, 100) để lấy nhiều roles
        const res = await fetchAllRolesAPI(1, 100); // Lấy tối đa 100 roles ở trang 1
        if (res.data && res.data.data) {
          // Chỉ lấy các role đang active nếu backend không tự lọc (tuỳ vào logic backend /roles endpoint)
          // Nếu backend đã trả về chỉ active roles (ví dụ khi dùng fetchAllActiveRolesAPI), dòng filter này không cần thiết
           const activeRoles = res.data.data.filter(role => role.isActive === true); // Lọc thủ công nếu cần

           const roleOptions = activeRoles.map(role => ({
            label: role.name, // Giả sử role object có thuộc tính 'name'
            value: role.id    // Giả sử role object có thuộc tính 'id'
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

    loadRoles();
  }, []); // Chạy 1 lần khi mount


  const onFinish = (values) => {
    console.log("Form Data:", values);
    handleSubmit(); // Gọi handleSubmit khi form hợp lệ và được submit
  };

  const handleOnChangeFile = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedFile(null);
      setPreview(null);
      form.setFieldsValue({ avartar: null }); // Cập nhật giá trị form
      return;
    }

    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      form.setFieldsValue({ avartar: file.name }); // Cập nhật tên file vào form item (tuỳ chọn)
    }
  };


  const handleSubmit = async () => {
     try {
            await form.validateFields(); // Validate lại lần nữa nếu cần
     } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            return; // Dừng nếu validation fail
     }

    try {
      let avatarFileName = null;

      if (selectedFile) {
        const resUpload = await handleUploadFile(selectedFile, "user");
        if (resUpload.data && resUpload.data.fileName) {
          avatarFileName = resUpload.data.fileName;
        } else {
          notification.error({
            message: "Tạo User",
            description: resUpload.message || "Tải lên avatar thất bại.",
          });
          return;
        }
      }

      const rolesToSend = Array.isArray(selectedRoleIds) ? selectedRoleIds : (selectedRoleIds ? [selectedRoleIds] : []);

      const response = await createUserAPI(
        username, email, password, phone, firstName, lastName, address,
        avatarFileName,
        rolesToSend
      );

      if(response.statusCode === 201) {
        notification.success({
          message: "Tạo User", description: response.message || "Tạo User thành công"
        });
        form.resetFields();
        setUserName(""); setEmail(""); setPassword(""); setPhone(""); setFirstName(""); setLastName(""); setAddress("");
        setSelectedFile(null);
        setPreview(null);
        setSelectedRoleIds([]);
      } else {
         notification.error({
            message: "Tạo User",
            description: response.message || "Có lỗi xảy ra khi tạo người dùng."
          });
      }
    } catch (error) {
      console.error("Create User Error:", error);
      notification.error({
        message: "Tạo User",
        description: error.response?.data?.message || error.message || "Tạo User thất bại"
    })
    }
  };

  const handleRoleChange = (values) => {
    // Backend mong đợi một mảng IDs. Nếu Select là single mode, cần chuyển thành mảng.
     // Nếu dùng mode="multiple" thì values đã là mảng
     // Nếu không dùng mode="multiple" thì values là một ID đơn lẻ
     if (form.getFieldValue('roleIds_mode') === 'multiple') { // Giả sử bạn có 1 field ẩn để biết mode
         setSelectedRoleIds(values);
     } else {
        setSelectedRoleIds(values ? [values] : []); // Chuyển ID đơn lẻ thành mảng 1 phần tử
     }

     // Hoặc cách an toàn hơn là luôn đảm bảo nó là mảng:
    // setSelectedRoleIds(Array.isArray(values) ? values : (values ? [values] : []));
  };


  return (
    <>
      <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Các trường Username, Email, Password, Phone, First Name, Last Name, Address không đổi */}
         <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Vui lòng nhập username" }]}>
              <Input placeholder="Nhập username" onChange={(e) => setUserName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ" }]}>
              <Input placeholder="Nhập email" onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Vui lòng nhập password" }]}>
              <Input.Password placeholder="Nhập password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
              <Input placeholder="Nhập số điện thoại" onChange={(e) => setPhone(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
              <Input placeholder="Nhập tên" onChange={(e) => setFirstName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: "Vui lòng nhập họ" }]}>
              <Input placeholder="Nhập họ" onChange={(e) => setLastName(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
              <Input placeholder="Nhập địa chỉ" onChange={(e) => setAddress(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Roles"
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

        {/* ----- PHẦN UPLOAD FILE ĐƯỢC KHÔI PHỤC ----- */}
        <Row gutter={16}>
          <Col span={12}>
          <Form.Item label="Avatar" name="avartar">
              {/* Giao diện UI Upload giống như ban đầu bạn cung cấp */}
              <div style={{ position: "relative" }} >
                <label htmlFor="btnUpload" style={{
                  display: "block",
                  width: "fit-content",
                  marginTop: "5px",
                  padding: "5px 10px ",
                  background: "orange", // Màu nền nút
                  borderRadius: "5px",
                  cursor: "pointer",
                  color: "white" // Thêm màu chữ cho dễ nhìn
                }}>
                  Upload Avatar
                </label>
                <input
                  hidden // Input bị ẩn đi
                  id='btnUpload'
                  type="file"
                  onChange={handleOnChangeFile} // Gọi hàm xử lý khi chọn file
               
                  style={{ // Style để input ẩn và nằm đè lên label
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0, // Hoàn toàn trong suốt
                      cursor: "pointer",
                    }}
                />
              </div>
              {/* Phần hiển thị ảnh preview */}
              {preview && (
                <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                  <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Avatar Preview" />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* ----- KẾT THÚC PHẦN UPLOAD FILE KHÔI PHỤC ----- */}


        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo User
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateUser;
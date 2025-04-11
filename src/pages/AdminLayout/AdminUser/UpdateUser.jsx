// src/pages/AdminLayout/AdminUser/UpdateUser.jsx
import { Form, Input, Button, Row, Col, notification, Modal , Select } from "antd";
import React, { useState, useEffect } from "react";
import { updateUserAPI } from "../../../services/api.service";
import { fetchAllRolesAPI } from "../../../services/api.role"; // Import API đã sửa

const UpdateUser = ({ isModalOpen, setIsModalOpen, userData, reloadUsers }) => {
  // State for each input field (Giữ nguyên các state như ban đầu nếu bạn vẫn dùng chúng, mặc dù form.setFieldsValue là đủ)
  const [id, setId] = useState(""); // Giữ lại state này để truyền vào API
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState(""); // Không nên cập nhật password ở đây
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  // const [roles, setRoles] = useState([]); // Không cần thiết nếu dùng selectedRoleIds
  const [selectedRoleIds, setSelectedRoleIds] = useState([]); // State quản lý IDs được chọn

  const [availableRoles, setAvailableRoles] = useState([]); // State để lưu danh sách roles từ API
  const [loadingRoles, setLoadingRoles] = useState(false); // State quản lý trạng thái loading roles


  const [form] = Form.useForm(); // Initialize Ant Design form instance

  // Fetch roles khi modal mở
   useEffect(() => {
    const loadRoles = async () => {
      setLoadingRoles(true);
      try {
        // Gọi API fetchAllRolesAPI (phiên bản đơn giản)
        const res = await fetchAllRolesAPI(1, 100); // Lấy tối đa 100 roles ở trang 1
        if (res.data && res.data.data) {
           // Lọc chỉ lấy role active
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
    // Chỉ fetch roles khi modal mở
    if (isModalOpen) {
        loadRoles();
    }

  }, [isModalOpen]); // Dependency là isModalOpen


  // Update form fields and states when userData changes
  useEffect(() => {
    if (userData) {
      // Cập nhật các state riêng lẻ (nếu vẫn dùng)
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
        setSelectedRoleIds(initialRoleIds); // Cập nhật state để logic submit hoạt động
      } else {
         setSelectedRoleIds([]); // Reset nếu không có roles
      }

      // Update Ant Design form values
      form.setFieldsValue({
        id: userData.id || "",
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        address: userData.address || "",
        roleIds: initialRoleIds, // Điền các ID role vào select
      });
    } else {
         form.resetFields(); // Reset form nếu không có userData (khi đóng modal)
         // Reset các state riêng lẻ nếu cần
         setId(""); setUserName(""); setEmail(""); setPhone(""); setFirstName(""); setLastName(""); setAddress("");
         setSelectedRoleIds([]);
    }
  }, [userData, form, isModalOpen]); // Thêm isModalOpen để đảm bảo form reset đúng khi đóng/mở lại

  const handleCancel = () => {
    setIsModalOpen(false);
    // form.resetFields(); // Form sẽ tự reset trong useEffect khi userData là null/undefined hoặc isModalOpen=false
  };

  // Sử dụng onFinish của Form để lấy dữ liệu
  const onFinish = async (values) => {
    console.log("Form Data on Finish:", values);
    // Lấy các giá trị từ 'values' mà Form cung cấp
    const { username, email, phone, firstName, lastName, address, roleIds } = values;

     // Lấy id từ state hoặc từ userData nếu không có trong values
     const userId = id || userData?.id;
     if (!userId) {
         notification.error({ message: "Update User", description: "Không tìm thấy ID người dùng."});
         return;
     }

    // Đảm bảo roleIds luôn là một mảng
     const rolesToSend = Array.isArray(roleIds) ? roleIds : (roleIds ? [roleIds] : []);

    try {
     // Gọi API update
      const response = await updateUserAPI(
        userId, // ID lấy từ state hoặc userData
        username,
        email,
        phone,
        firstName,
        lastName,
        address,
        null, // Không có logic upload avatar trong component này theo yêu cầu
        rolesToSend // Gửi mảng các ID đã chọn
      );

      console.log("Update Response:", response);

      if (response.statusCode === 200 || response.data) { // Kiểm tra response thành công
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

  // Hàm xử lý khi thay đổi lựa chọn roles (vẫn cần để cập nhật state selectedRoleIds nếu logic submit dùng state)
  // Hoặc không cần nếu hoàn toàn dựa vào onFinish values
    const handleRoleChange = (values) => {
       // Cập nhật state nếu logic submit (handleSubmit cũ) dựa vào nó
        setSelectedRoleIds(Array.isArray(values) ? values : (values ? [values] : []));
        // Form tự quản lý giá trị của nó, không cần form.setFieldsValue ở đây trừ khi có lý do đặc biệt
    };

  // --- GIAO DIỆN UI GIỮ NGUYÊN NHƯ BAN ĐẦU ---
  return (
    <Modal
      title="Cập nhật người dùng"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null} // Footer được quản lý trong Form
      width={900} // Giữ nguyên width
      // height={1000} // Thuộc tính height không chuẩn cho Modal Antd, bỏ đi hoặc dùng style nếu cần
      destroyOnClose={true} // Reset form khi đóng
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        {/* Giữ nguyên cấu trúc Row và Col */}
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item label="Mã tài khoản" name="id" >
                {/* Input disabled như ban đầu */}
                <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tên tài khoản" name="username" rules={[{ required: true, message: "Please enter username" }]}>
                 {/* Input và event handler onChange nếu bạn vẫn dùng state riêng */}
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
            {/* Select component cho Roles */}
            <Form.Item
              label="Vai trò"
              name="roleIds" // Tên field trong form
              rules={[{ required: true, message: "Vui lòng chọn ít nhất một vai trò" }]}
            >
              <Select
                 
                 placeholder="Chọn vai trò"
                 onChange={handleRoleChange} // Cập nhật state selectedRoleIds (nếu cần)
                 options={availableRoles} // Sử dụng danh sách roles từ API
                 loading={loadingRoles}
                 filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                // Không cần value={selectedRoleIds} vì form instance quản lý
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Không có phần upload avatar trong code gốc UpdateUser bạn cung cấp */}

        {/* Giữ nguyên vị trí và style của nút */}
        <Row justify="end" gutter={16}>
          <Col>
            <Button onClick={handleCancel}>Huỷ</Button>
          </Col>
          <Col>
            {/* Nút submit của Form */}
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
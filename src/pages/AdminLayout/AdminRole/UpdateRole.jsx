// src/pages/AdminLayout/AdminRole/UpdateRole.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, notification, Switch } from 'antd';
import { updateRoleAPI } from '../../../services/api.role';
// Bỏ import fetchAllActivePermissionsAPI vì không còn dùng
// import { fetchAllActivePermissionsAPI } from '../../../services/api.permission';

// Bỏ Option từ Select vì không dùng Select
// const { Option } = Select;

const UpdateRole = ({ isModalOpen, setIsModalOpen, roleData, reloadRoles }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  // Bỏ state permissions và loadingPermissions
  // const [permissions, setPermissions] = useState([]);
  // const [loadingPermissions, setLoadingPermissions] = useState(false);

  // Bỏ useEffect loadPermissions vì không còn fetch permissions
  // useEffect(() => {
  //   const loadPermissions = async () => { ... };
  //   if (isModalOpen) { loadPermissions(); }
  // }, [isModalOpen]);

  // Populate form when roleData changes - loại bỏ permissionIds
  useEffect(() => {
    if (roleData && form) {
      // Không còn lấy initialPermissionIds
      // const initialPermissionIds = roleData.permissions ? roleData.permissions.map(p => p.id) : [];
      form.setFieldsValue({
        id: roleData.id,
        name: roleData.name,
        description: roleData.description,
        // permissionIds: initialPermissionIds, // Bỏ dòng này
        isActive: roleData.isActive !== undefined ? roleData.isActive : true, // Mặc định là true nếu không có giá trị
      });
    } else if (isModalOpen) { // Chỉ reset khi modal mở và không có roleData
        form.resetFields();
    }
  }, [roleData, form, isModalOpen]);


  const handleCancel = () => {
    setIsModalOpen(false);
    // form.resetFields(); // Đã có destroyOnClose và logic trong useEffect
  };

  // Handle Form Submission - loại bỏ permissionIds
  const onFinish = async (values) => {
    setLoading(true);
    // Bỏ permissionIds khỏi values
    const { name, description, isActive } = values;
    const roleId = roleData?.id;

    if (!roleId) {
      notification.error({ message: "Lỗi", description: "Không tìm thấy ID vai trò." });
      setLoading(false);
      return;
    }

    try {
      // Gọi API cập nhật mà không có permissionIds
      // Truyền undefined cho tham số permissions
      const res = await updateRoleAPI(roleId, name, description, undefined, isActive);
      if (res.statusCode === 200 || (res.data && res.data.id)) { // Kiểm tra response thành công
        notification.success({
          message: 'Thành công',
          description: `Vai trò "${values.name}" đã được cập nhật.`,
        });
        setIsModalOpen(false);
        if (reloadRoles) {
          reloadRoles();
        }
      } else {
        notification.error({
          message: 'Thất bại',
          description: res.message || 'Không thể cập nhật vai trò.',
        });
      }
    } catch (error) {
      console.error("Update Role Error:", error);
      notification.error({
        message: 'Lỗi',
        description: error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi cập nhật.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật vai trò"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose={true}
      // forceRender // Có thể không cần thiết với destroyOnClose và logic useEffect hiện tại
    >
      {/* Chỉ render Form khi roleData có giá trị hoặc form instance đã sẵn sàng
          Điều này giúp tránh lỗi khi roleData ban đầu là null và form cố gắng setFieldsValue
      */}
      {form && (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isActive: true }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Tên vai trò"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
              >
                <Input placeholder="Nhập tên vai trò" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="isActive"
                valuePropName="checked"
              >
                <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                // Không cần rules bắt buộc
              >
                <Input.TextArea rows={2} placeholder="Mô tả ngắn về vai trò (tùy chọn)" />
              </Form.Item>
            </Col>
          </Row>

          {/* --- Phần chọn Permission đã được xóa bỏ --- */}
          {/* <Row gutter={24}> ... </Row> */}

          <Row justify="end" style={{ marginTop: '20px' }}>
            <Col>
              <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

export default UpdateRole;
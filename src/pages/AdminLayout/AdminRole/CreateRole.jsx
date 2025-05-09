// src/pages/AdminLayout/AdminRole/CreateRole.jsx
import React, { useState } from 'react'; // Bỏ useEffect vì không còn fetch permissions
import { Form, Input, Button, Row, Col, notification, Card, Typography } from 'antd';
import { createRoleAPI } from '../../../services/api.role'; // Chỉ cần API tạo role
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
// Bỏ import { Option } từ Select vì không dùng Select nữa

const CreateRole = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Bỏ state permissions và loadingPermissions

  // Bỏ useEffect loadPermissions

  // Handle Form Submission - Loại bỏ permissionIds
  const onFinish = async (values) => {
    setLoading(true);
    // Chỉ lấy name và description từ form
    const { name, description } = values;

    try {
      // Gọi API tạo role chỉ với name và description
      // Truyền undefined hoặc null cho tham số permissions
      const res = await createRoleAPI(name, description, undefined);
      if (res.statusCode === 201 && res.data) {
        notification.success({
          message: 'Thành công',
          description: `Vai trò "${res.data.name}" đã được tạo thành công!`,
        });
        form.resetFields();
        navigate('/admin/list-role');
      } else {
        notification.error({
          message: 'Thất bại',
          description: res.message || 'Không thể tạo vai trò. Vui lòng thử lại.',
        });
      }
    } catch (error) {
      console.error("Create Role Error:", error);
      notification.error({
        message: 'Lỗi',
        description: error.response?.data?.message || error.message || 'Đã xảy ra lỗi trong quá trình tạo vai trò.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title level={3} style={{ marginBottom: '25px' }}>Tạo vai trò mới</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Tên vai trò"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
            >
              <Input placeholder="Nhập tên vai trò (vd: editor, manager)" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mô tả"
              name="description"
              // Không cần rules bắt buộc cho mô tả
            >
              <Input.TextArea rows={1} placeholder="Mô tả ngắn về vai trò (tùy chọn)" />
            </Form.Item>
          </Col>
        </Row>

        {/* --- Phần chọn Permission đã được xóa bỏ --- */}
        {/* <Row gutter={24}> ... </Row> */}

        <Row justify="end" style={{ marginTop: '20px' }}> {/* Thêm khoảng cách trên nếu cần */}
          <Col>
            <Button type="default" onClick={() => navigate('/admin/list-role')} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo vai trò
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateRole;
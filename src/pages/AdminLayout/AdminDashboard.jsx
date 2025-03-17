import React from 'react';
import {
  UserOutlined,
  SkinOutlined,
  InboxOutlined,
  FormOutlined
} from "@ant-design/icons";
import { 
  Card, 
  Statistic, 
  Row, 
  Col 
} from "antd";

const AdminDashboard = () => {
  return (
    <div>
      <h2>Bảng điều khiển</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Người dùng" 
              value={1254} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Sản phẩm" 
              value={567} 
              prefix={<SkinOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Đơn hàng" 
              value={85} 
              prefix={<InboxOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Bài đăng" 
              value={24} 
              prefix={<FormOutlined />} 
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>
      
      <div style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Đơn hàng gần đây" style={{ height: '100%' }}>
              <ul style={{ paddingLeft: 20 }}>
                <li style={{ padding: '8px 0' }}>Đơn hàng #10435 - Nguyễn Văn A - 2.500.000đ</li>
                <li style={{ padding: '8px 0' }}>Đơn hàng #10434 - Trần Thị B - 1.750.000đ</li>
                <li style={{ padding: '8px 0' }}>Đơn hàng #10433 - Lê Văn C - 3.200.000đ</li>
                <li style={{ padding: '8px 0' }}>Đơn hàng #10432 - Phạm Thị D - 950.000đ</li>
                <li style={{ padding: '8px 0' }}>Đơn hàng #10431 - Hoàng Văn E - 1.800.000đ</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Người dùng mới" style={{ height: '100%' }}>
              <ul style={{ paddingLeft: 20 }}>
                <li style={{ padding: '8px 0' }}>Nguyễn Văn A - nguyenvana@email.com</li>
                <li style={{ padding: '8px 0' }}>Trần Thị B - tranthib@email.com</li>
                <li style={{ padding: '8px 0' }}>Lê Văn C - levanc@email.com</li>
                <li style={{ padding: '8px 0' }}>Phạm Thị D - phamthid@email.com</li>
                <li style={{ padding: '8px 0' }}>Hoàng Văn E - hoangvane@email.com</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>
      
      <div style={{ marginTop: 24 }}>
        <Card title="Thông báo hệ thống">
          <ul style={{ paddingLeft: 20 }}>
            <li style={{ padding: '8px 0' }}>Cập nhật phiên bản mới cho hệ thống quản lý - 17/03/2025</li>
            <li style={{ padding: '8px 0' }}>Thêm tính năng quản lý danh mục sản phẩm mới - 15/03/2025</li>
            <li style={{ padding: '8px 0' }}>Bảo trì hệ thống dự kiến vào ngày 20/03/2025</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
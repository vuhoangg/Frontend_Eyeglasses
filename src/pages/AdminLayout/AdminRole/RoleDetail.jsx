// src/pages/AdminLayout/AdminRole/RoleDetail.jsx
import React from 'react';
import { Drawer, Button, Card, Descriptions, Typography, Divider, Row, Col, Tag, Space, Spin } from 'antd';
import { InfoCircleOutlined, SafetyCertificateOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment'; // Import moment để format ngày tháng nếu có

const { Title, Text } = Typography;

const RoleDetail = ({ isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail }) => { // Bỏ reloadRoles nếu không cần thiết

    const onClose = () => {
        setIsDetailOpen(false);
        // setDataDetail(null); // Không cần clear ở đây nếu dùng destroyOnClose
    };

    return (
        <Drawer
            width="45vw" // Có thể điều chỉnh độ rộng
            title={
                <Space>
                    <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Chi tiết vai trò</Title>
                </Space>
            }
            placement="right"
            onClose={onClose}
            open={isDetailOpen}
            maskClosable={true} // Cho phép đóng bằng cách click ra ngoài
            destroyOnClose={true} // Quan trọng: reset state khi đóng hẳn
            extra={
                <Button type="primary" onClick={onClose}>
                    Đóng
                </Button>
            }
        >
            {dataDetail ? (
                <Card bordered={false}>
                     <Descriptions title={<><InfoCircleOutlined /> Thông tin chung</>} bordered column={1}>
                        <Descriptions.Item label="ID">{dataDetail.id}</Descriptions.Item>
                        <Descriptions.Item label="Tên vai trò">{dataDetail.name}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả">{dataDetail.description || <Text type="secondary">Không có</Text>}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            {dataDetail.isActive ? (
                                <Tag icon={<CheckCircleOutlined />} color="success">Hoạt động</Tag>
                            ) : (
                                <Tag icon={<CloseCircleOutlined />} color="error">Không hoạt động</Tag>
                            )}
                        </Descriptions.Item>
                         {/* Thêm ngày tạo/cập nhật nếu có trong dataDetail */}
                         {dataDetail.createdAt &&
                             <Descriptions.Item label="Ngày tạo">
                                 {moment(dataDetail.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                             </Descriptions.Item>
                         }
                         {dataDetail.updatedAt &&
                            <Descriptions.Item label="Cập nhật lần cuối">
                                {moment(dataDetail.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
                            </Descriptions.Item>
                         }
                    </Descriptions>

                     <Divider />

                     <Title level={5} style={{ marginBottom: '15px' }}><SafetyCertificateOutlined /> Quyền hạn được cấp</Title>
                      {dataDetail.permissions && dataDetail.permissions.length > 0 ? (
                          <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                              {dataDetail.permissions.map(perm => (
                                  <Tag color="blue" key={perm.id} style={{ margin: '4px' }}>
                                      {perm.name || `ID: ${perm.id}`} ({perm.method} {perm.module})
                                  </Tag>
                              ))}
                          </div>
                      ) : (
                         <Text type="secondary">Vai trò này chưa được cấp quyền hạn nào.</Text>
                      )}

                </Card>
            ) : (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: '15px' }}><Text type="secondary">Đang tải dữ liệu...</Text></p>
                </div>
            )}
        </Drawer>
    );
};

export default RoleDetail;
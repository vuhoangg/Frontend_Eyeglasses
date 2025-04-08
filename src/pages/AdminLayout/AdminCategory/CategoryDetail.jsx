import { Drawer, Button, Card, Descriptions, Typography, Divider, Row, Col, Space } from 'antd';
import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CategoryDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadCategories } = props;

    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null);
    };

    return (
        <Drawer
            width="50vw" // Adjust width as needed, using 50vw for consistency
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InfoCircleOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Chi tiết danh mục</Title>
                </div>
            }
            onClose={onClose}
            open={isDetailOpen}
            maskClosable={false}
            extra={
                <Button type="primary" onClick={onClose}>
                    Đóng
                </Button>
            }
        >
            {dataDetail ? (
                <Row gutter={[24, 24]}>
                    <Col span={24}> {/* Take full width for single column layout */}
                        <Card
                            title={<Title level={5}><InfoCircleOutlined /> Thông tin danh mục</Title>}
                            bordered={false}
                        >
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label="Mã danh mục">{dataDetail.id}</Descriptions.Item>
                                <Descriptions.Item label="Tên danh mục">{dataDetail.name}</Descriptions.Item>
                                <Descriptions.Item label="Mô tả">
                                    {dataDetail.description}
                                </Descriptions.Item>
                                {/* Conditionally render Parent ID if it exists */}
                                {dataDetail.parent_id && (
                                    <Descriptions.Item label="Parent ID">{dataDetail.parent_id}</Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Text type="secondary">Không có dữ liệu danh mục</Text>
                    </div>
                </Card>
            )}
        </Drawer>
    );
};

export default CategoryDetail;
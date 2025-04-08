import { Drawer, Button, Table, Card, Descriptions, Typography, Tag, Divider, Row, Col, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchOrderByIdAPI } from '../../../services/api.order';
import { fetchOrderItemsByOrderIdAPI } from '../../../services/api.orderItem';
import { formatNumber } from '../../../utils/format'; 
import { ShoppingOutlined, UserOutlined, CalendarOutlined, DollarOutlined, HomeOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadOrders } = props;
    const [orderDetailData, setOrderDetailData] = useState(null);
    const [orderItemsData, setOrderItemsData] = useState([]);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (dataDetail && dataDetail.id) {
                try {
                    const orderRes = await fetchOrderByIdAPI(dataDetail.id);
                    if (orderRes.data) {
                        setOrderDetailData(orderRes.data);
                    }

                    const orderItemsRes = await fetchOrderItemsByOrderIdAPI(dataDetail.id);
                    if (orderItemsRes.data) {
                        setOrderItemsData(orderItemsRes.data);
                    }
                } catch (error) {
                    console.error("Error fetching order details or items:", error);
                }
            }
        };

        fetchOrderDetail();
    }, [dataDetail]);

    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null);
        setOrderDetailData(null);
        setOrderItemsData([]);
    };

    // Get status tag color based on status
    const getStatusTagColor = (status) => {
        const statusMap = {
            'Pending': 'orange',
            'Processing': 'blue',
            'Shipped': 'purple',
            'Delivered': 'green',
            'Cancelled': 'red',
            'Completed': 'green'
        };
        return statusMap[status] || 'default';
    };

    const orderItemColumns = [
        { 
            title: 'Tên sản phẩm', 
            dataIndex: ['product', 'name'], 
            key: 'productName',
            render: (text) => <Text strong>{text}</Text>
        },
        { 
            title: 'Số lượng', 
            dataIndex: 'quantity', 
            key: 'quantity',
            render: (quantity) => <Tag color="blue">{quantity}</Tag>
        },
        { 
            title: 'Đơn Giá', 
            dataIndex: 'price', 
            key: 'price',
            render: (price) => <Text type="secondary">{formatNumber(price)} đ</Text>
        },
        {
            title: 'Tổng cộng',
            key: 'total',
            render: (_, record) => {
                const totalPrice = record.quantity * record.price;
                return <Text type="success" strong>{formatNumber(totalPrice)} đ</Text>;
            },
        },
    ];

    // Calculate order total
    const calculateTotal = () => {
        return orderItemsData.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    return (
        <Drawer 
            width={"80vw"} 
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Chi tiết đơn hàng #{dataDetail?.id}</Title>
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
            {orderDetailData ? (
                <>
                    <Row gutter={[24, 24]}>
                        <Col span={16}>
                            <Card title={<Title level={5}><UserOutlined /> Thông tin khách hàng</Title>} bordered={false}>
                                <Descriptions column={1}>
                                    <Descriptions.Item label="Tên khách hàng">{orderDetailData.user?.username}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{orderDetailData.user?.email}</Descriptions.Item>
                                    <Descriptions.Item label="Số điện thoại">{orderDetailData.user?.phone}</Descriptions.Item>
                                    <Descriptions.Item label="Địa chỉ giao hàng">
                                        <HomeOutlined style={{ marginRight: 8 }} />
                                        {orderDetailData.shippingAddress}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title={<Title level={5}><DollarOutlined /> Thông tin thanh toán</Title>} bordered={false}>
                                <Statistic 
                                    title="Tổng tiền đơn hàng"
                                    value={formatNumber(orderDetailData.totalAmount)}
                                    suffix="đ"
                                    style={{ marginBottom: 16 }}
                                />
                                <Descriptions column={1}>
                                    <Descriptions.Item label="Phương thức thanh toán">
                                        <CreditCardOutlined style={{ marginRight: 8 }} />
                                        {orderDetailData.paymentMethod}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái đơn hàng">
                                        <Tag color={getStatusTagColor(orderDetailData.orderStatus?.name)}>
                                            {orderDetailData.orderStatus?.name}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ngày tạo đơn">
                                        <CalendarOutlined style={{ marginRight: 8 }} />
                                        {new Date(orderDetailData.creationDate).toLocaleDateString('vi-VN')}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>
                    </Row>

                    <Divider orientation="left">
                        <Title level={5}><ShoppingOutlined /> Chi tiết sản phẩm</Title>
                    </Divider>

                    <Card>
                        <Table
                            columns={orderItemColumns}
                            dataSource={orderItemsData}
                            rowKey="id"
                            pagination={false}
                            summary={() => (
                                <Table.Summary>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} align="right">
                                            <Text strong>Tổng cộng:</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text type="danger" strong style={{ fontSize: '16px' }}>
                                                {formatNumber(calculateTotal())} đ
                                            </Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            )}
                        />
                    </Card>
                </>
            ) : (
                <Card>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Text type="secondary">Không có thông tin đơn hàng</Text>
                    </div>
                </Card>
            )}
        </Drawer>
    );
};

export default OrderDetail;
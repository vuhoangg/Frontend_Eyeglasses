// pages/ClientLayout/OrderSuccessPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Result, Button, Card, Divider, Row, Col, List, Avatar, Spin } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircleOutlined, HomeOutlined, HistoryOutlined } from '@ant-design/icons';
import { fetchAllOrderItemsAPI } from '../../services/api.orderItem'; // Import API to fetch order items

const { Content } = Layout;
const { Title, Text } = Typography;

const OrderSuccessPage = () => {
    const location = useLocation();
    const { orderData, orderNumber } = location.state || {
        orderData: null,
        orderNumber: Math.floor(Math.random() * 1000000)
    };
    const [orderItems, setOrderItems] = useState(null); // State to hold fetched order items
    const [loadingOrderItems, setLoadingOrderItems] = useState(false); // Loading state for order items

    useEffect(() => {
        const fetchOrderItems = async () => {
            if (orderNumber) {
                setLoadingOrderItems(true);
                try {
                    const response = await fetchAllOrderItemsAPI(1, 100, orderNumber);
                    console.log("Phản hồi API:", response.data.data); // Thêm dòng này để xem phản hồi API
                    if (response && response.data) {
                        // Truy cập đúng mảng dữ liệu từ response.data.data.data
                        setOrderItems(response.data.data); // <--- Thay đổi dòng này
                    } else {
                        console.error("Không thể lấy dữ liệu chi tiết đơn hàng hoặc phản hồi không hợp lệ:", response);
                        setOrderItems([]);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu chi tiết đơn hàng:", error);
                    setOrderItems([]);
                } finally {
                    setLoadingOrderItems(false);
                }
            }
        };
    
        fetchOrderItems();
    }, [orderNumber]);

    // Fallback content if no order data is provided (or while fetching)
    if (!orderData) {
        return (
            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', background: '#f5f5f5' }}>
                <Card style={{ marginBottom: 24, textAlign: 'center' }}>
                    <Result
                        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        status="success"
                        title="Đặt hàng thành công"
                        subTitle={`Hệ thống đã ghi nhận thông tin đơn hàng của bạn. Mã đơn hàng: #${orderNumber}`}
                        extra={[
                            <Button type="primary" key="home" icon={<HomeOutlined />}>
                                <Link to="/">Trang Chủ</Link>
                            </Button>,
                            <Button key="history" icon={<HistoryOutlined />}>
                                <Link to="/product">Tiếp tục mua sắm</Link>
                            </Button>,
                        ]}
                    />
                </Card>
            </Content>
        );
    }

    return (
        <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', background: '#f5f5f5' }}>
            <Card style={{ marginBottom: 24, textAlign: 'center' }}>
                <Result
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    status="success"
                    title="Đặt hàng thành công"
                    subTitle={`Hệ thống đã ghi nhận thông tin đơn hàng của bạn. Mã đơn hàng: #${orderNumber}`}
                    extra={[
                        <Button type="primary" key="home" icon={<HomeOutlined />}>
                            <Link to="/">Trang Chủ</Link>
                        </Button>,
                        <Button key="history" icon={<HistoryOutlined />}>
                            <Link to="/product">Tiếp tục mua sắm</Link>
                        </Button>,
                    ]}
                />
            </Card>

            <Card title={<Title level={4}>Chi tiết đơn hàng</Title>}>
                <Row gutter={24}>
                    <Col xs={24} md={16}>
                        <div style={{ marginBottom: 16 }}>
                            <Title level={5}>Thông tin giao hàng</Title>
                            <Text>Địa chỉ: {orderData.shippingAddress}</Text>
                            <br />
                            <Text>Phương thức thanh toán: {
                                orderData.paymentMethod === 'COD'
                                    ? 'Thanh toán khi nhận hàng'
                                    : 'Chuyển khoản ngân hàng'
                            }</Text>
                        </div>

                        <Divider />

                        <Title level={5}>Sản phẩm đã đặt</Title>
                        {loadingOrderItems ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Spin tip="Đang tải chi tiết sản phẩm..." />
                            </div>
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={orderItems || []} // Use fetched orderItems, default to empty array if null
                                renderItem={item => (
                                    <List.Item key={item.id}> {/* Thêm key prop ở đây, giả sử mỗi item có id duy nhất */}
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    shape="square"
                                                    size={64}
                                                    src={item.product?.imageProduct
                                                        ? `http://localhost:8082/images/product/${item.product.imageProduct}`
                                                        : "https://placehold.co/64x64"}
                                                    alt={item.product?.name || 'Product Image'}
                                                />
                                            }
                                            title={`Sản phẩm: ${item.product?.name || `ID #${item.product_id}`}`} // Use product name from fetched data
                                            description={
                                                <>
                                                    <Text>Số lượng: {item.quantity}</Text>
                                                    <br />
                                                    <Text type="secondary">{Number(item.price).toLocaleString()} đ</Text>
                                                </>
                                            }
                                        />
                                        <div>
                                            <Text strong>{(Number(item.price) * item.quantity).toLocaleString()} đ</Text>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Col>

                    <Col xs={24} md={8}>
                        <Card title="Tổng thanh toán">
                            <Row justify="space-between" style={{ marginBottom: 8 }}>
                                <Col>
                                    <Text>Tạm tính:</Text>
                                </Col>
                                <Col>
                                    <Text>{Number(orderData.totalAmount).toLocaleString()} đ</Text>
                                </Col>
                            </Row>

                            <Row justify="space-between" style={{ marginBottom: 8 }}>
                                <Col>
                                    <Text>Phí vận chuyển:</Text>
                                </Col>
                                <Col>
                                    <Text>0 đ</Text>
                                </Col>
                            </Row>

                            {orderData.promotionId && (
                                <Row justify="space-between" style={{ marginBottom: 8 }}>
                                    <Col>
                                        <Text>Mã giảm giá:</Text>
                                    </Col>
                                    <Col>
                                        <Text>-0 đ</Text>
                                    </Col>
                                </Row>
                            )}

                            <Divider style={{ margin: '12px 0' }} />

                            <Row justify="space-between">
                                <Col>
                                    <Text strong>Tổng tiền:</Text>
                                </Col>
                                <Col>
                                    <Text style={{ fontSize: 18, color: '#f5222d', fontWeight: 'bold' }}>
                                        {Number(orderData.totalAmount).toLocaleString()} đ
                                    </Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Content>
    );
};

export default OrderSuccessPage;
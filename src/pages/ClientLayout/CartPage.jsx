import React, { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Row,
    Col,
    Table,
    Button,
    InputNumber,
    Space,
    Card,
    Divider,
    Empty,
    message,
    Breadcrumb,
    Image,
    Popconfirm,
    Input
} from 'antd';
import {
    DeleteOutlined,
    ShoppingOutlined,
    ArrowLeftOutlined,
    ShoppingCartOutlined,
    CreditCardOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

const CartPage = () => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [shippingFee, setShippingFee] = useState(30000);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
        message.success('Đã cập nhật số lượng');
    };

    const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    };

    const handleClearCart = () => {
        setCartItems([]);
        message.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
    };

    const handleApplyCoupon = () => {
        if (couponCode === 'WELCOME10') {
            setDiscount(10);
            message.success('Áp dụng mã giảm giá thành công: Giảm 10%');
        } else if (couponCode === 'FREESHIP') {
            setShippingFee(0);
            message.success('Áp dụng mã giảm giá thành công: Miễn phí vận chuyển');
        } else {
            message.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
        }
    };

    const formatPrice = (value) => `${value.toLocaleString('vi-VN')}đ`;

    const calculateItemTotal = (item) => (item.price * item.quantity);

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };

    const calculateDiscountAmount = () => {
        return (calculateSubtotal() * discount) / 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscountAmount() + shippingFee;
    };

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Image src={record.image} alt={record.name} width={70} height={50} preview={false}/>
                    <Space direction="vertical" size={0}>
                        <Link to={`/product/${record.id}`}>
                            <Text strong>{record.name}</Text>
                        </Link>
                        <Text type="secondary">Màu: {record.color}, Size: {record.size}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => formatPrice(record.price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    max={10}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.id, value)}
                    style={{ width: 70 }}
                />
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            render: (record) => formatPrice(calculateItemTotal(record)),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Xóa sản phẩm này?"
                    onConfirm={() => handleRemoveItem(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button type="text" danger icon={<DeleteOutlined/>}/>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1600,   width: 'auto'  , margin: '0 auto' }}>
                <Breadcrumb style={{ margin: '16px 0' }}
                            items={[
                                {
                                    title: <Link to="/">Trang chủ</Link>,
                                },
                                {
                                    title: 'Giỏ hàng',
                                },
                            ]}
                />

                <div style={{ background: '#fff', padding: 24, minHeight:'auto', minWidth: 100 }}>
                    <Title level={2}>
                        <ShoppingCartOutlined /> Giỏ hàng của bạn
                    </Title>

                    <Row gutter={[24, 24]}>
                        <Col xs={24} lg={16}>
                            {cartItems.length === 0 ? (
                                <Empty
                                    description={
                                        <span>Giỏ hàng của bạn đang trống</span>
                                    }
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                >
                                    <Button type="primary" icon={<ShoppingOutlined />}>
                                        <Link to="/product">Tiếp tục mua sắm</Link>
                                    </Button>
                                </Empty>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={cartItems}
                                    pagination={false}
                                    rowKey="id"
                                    bordered
                                />
                            )}

                            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                                <Button type="default" icon={<ArrowLeftOutlined />}>
                                    <Link to="/product">Tiếp tục mua sắm</Link>
                                </Button>
                                <Popconfirm
                                    title="Xóa tất cả sản phẩm?"
                                    onConfirm={handleClearCart}
                                    okText="Xóa tất cả"
                                    cancelText="Hủy"
                                >
                                    <Button danger>Xóa tất cả</Button>
                                </Popconfirm>
                            </div>
                        </Col>

                        <Col xs={24} lg={8}>
                            <Card title="Tóm tắt đơn hàng" bordered style={{ marginBottom: 24 }}>
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text>Tạm tính ({cartItems.length} sản phẩm):</Text>
                                        <Text strong>{formatPrice(calculateSubtotal())}</Text>
                                    </div>
                                    {discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text>Giảm giá ({discount}%):</Text>
                                            <Text strong style={{ color: '#52c41a' }}>
                                                -{formatPrice(calculateDiscountAmount())}
                                            </Text>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text>Phí vận chuyển:</Text>
                                        <Text strong>
                                            {shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí'}
                                        </Text>
                                    </div>
                                </div>

                                <Divider style={{ margin: '16px 0' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <Title level={4}>Tổng cộng:</Title>
                                    <Title level={4} style={{ color: '#ff4d4f' }}>
                                        {formatPrice(calculateTotal())}
                                    </Title>
                                </div>

                                <Button type="primary" block size="large" icon={<CreditCardOutlined />}>
                                    Tiến hành thanh toán
                                </Button>
                            </Card>

                             <Card title="Mã giảm giá" bordered>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Space.Compact style={{ width: '100%' }}>
                                        <Input
                                            placeholder="Nhập mã giảm giá"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <Button type="primary" onClick={handleApplyCoupon}>Áp dụng</Button>
                                    </Space.Compact>
                                    <Text type="secondary">Nhập mã giảm giá của bạn để được hưởng ưu đãi</Text>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};

export default CartPage;
import React, { useState, useEffect, useContext } from 'react';
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
    Tooltip,
    Popconfirm,
    Steps,
    Image,
    Input
} from 'antd';
import {
    DeleteOutlined,
    ShoppingOutlined,
    ArrowLeftOutlined,
    ShoppingCartOutlined,
    CreditCardOutlined,
    GiftOutlined,
    CheckCircleFilled,
    CloseCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext'

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Step } = Steps;

const CartPage = () => {
    // Cart items state using CartContext
    const { cartItems, addToCart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [shippingFee, setShippingFee] = useState(30000); // Default shipping fee

    // Current step in checkout process
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        setLoading(true);

        // Simulate loading cart data from localStorage or API
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, [cartItems]);

    // Handle quantity change
    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(id, newQuantity);
        message.success('Đã cập nhật số lượng');
    };

    // Handle remove item
    const handleRemoveItem = (id) => {
        removeFromCart(id);
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
    };

    // Clear cart
    const handleClearCart = () => {
        clearCart();
        message.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
    };

    // Apply coupon code
    const handleApplyCoupon = () => {
        // Mock coupon validation
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

    // Handle proceed to checkout
    const handleCheckout = () => {
        setCurrentStep(1);
        message.info('Tiến hành thanh toán...');
        // In a real app, redirect to checkout page or open checkout modal
    };

    // Calculate subtotal for an item
    const calculateItemTotal = (item) => {
        return (item.price + item.lensPrice) * item.quantity;
    };

    // Calculate cart subtotal
    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
    };

    // Calculate discount amount
    const calculateDiscountAmount = () => {
        return (calculateSubtotal() * discount) / 100;
    };

    // Calculate final total
    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscountAmount() + shippingFee;
    };

    // Format price
    const formatPrice = value => `${value.toLocaleString('vi-VN')}đ`;

    // Table columns
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space>
                    <Image
                        src={record.image}
                        alt={record.name}
                        width={70}
                        height={50}
                        style={{ objectFit: 'contain' }}
                        preview={false}
                    />
                    <Space direction="vertical" size={0}>
                        <Link to={`/product/${record.id}`}>
                            <Text strong>{record.name}</Text>
                        </Link>
                        <Text type="secondary">Màu: {record.color}, Size: {record.size}</Text>
                        {record.lensType !== 'standard' && (
                            <Text type="secondary">
                                Tròng kính: {
                                record.lensType === 'blue-light' ? 'Chống ánh sáng xanh' :
                                    record.lensType === 'photochromic' ? 'Đổi màu' :
                                        record.lensType === 'polarized' ? 'Phân cực' : ''
                            } (+{formatPrice(record.lensPrice)})
                            </Text>
                        )}
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {record.oldPrice && (
                        <Text delete type="secondary">{formatPrice(record.oldPrice)}</Text>
                    )}
                    <Text strong style={record.discount > 0 ? { color: '#ff4d4f' } : {}}>
                        {formatPrice(record.price)}
                    </Text>
                </Space>
            ),
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
            dataIndex: 'total',
            key: 'total',
            render: (_, record) => (
                <Text strong style={{ color: '#ff4d4f' }}>
                    {formatPrice(calculateItemTotal(record))}
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Xóa sản phẩm này?"
                    description="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
                    onConfirm={() => handleRemoveItem(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1200, margin: '0 auto' }}>
                <Breadcrumb style={{ margin: '16px 0' }}
                            items={[
                                {
                                    title: <Link to="/">Trang chủ</Link>,
                                },
                                {
                                    title: <Link to="/products">Sản phẩm</Link>,
                                },
                                {
                                    title: 'Giỏ hàng',
                                },
                            ]}
                />

                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Title level={2}>
                        <ShoppingCartOutlined /> Giỏ hàng của bạn
                    </Title>

                    {/* Checkout Steps */}
                    <Steps current={currentStep} style={{ marginBottom: 30 }}>
                        <Step title="Giỏ hàng" description="Xem và chỉnh sửa" icon={<ShoppingCartOutlined />} />
                        <Step title="Thanh toán" description="Chọn phương thức" icon={<CreditCardOutlined />} />
                        <Step title="Hoàn tất" description="Đặt hàng thành công" icon={<CheckCircleOutlined />} />
                    </Steps>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Spin size="large" />
                            <Text>Đang tải giỏ hàng...</Text>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <Empty
                            description={
                                <span>Giỏ hàng của bạn đang trống</span>
                            }
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            <Button type="primary" icon={<ShoppingOutlined />}>
                                <Link to="/products">Tiếp tục mua sắm</Link>
                            </Button>
                        </Empty>
                    ) : (
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={16}>
                                <Table
                                    columns={columns}
                                    dataSource={cartItems}
                                    pagination={false}
                                    rowKey="id"
                                    bordered
                                />

                                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button type="default" icon={<ArrowLeftOutlined />}>
                                        <Link to="/products">Tiếp tục mua sắm</Link>
                                    </Button>
                                    <Popconfirm
                                        title="Xóa tất cả sản phẩm?"
                                        description="Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?"
                                        onConfirm={handleClearCart}
                                        okText="Xóa tất cả"
                                        cancelText="Hủy"
                                    >
                                        <Button danger>Xóa tất cả</Button>
                                    </Popconfirm>
                                </div>
                            </Col>

                            <Col xs={24} lg={8}>
                                <Card title="Tóm tắt đơn hàng" bordered style={{ marginBottom: 16 }}>
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

                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Button
                                            type="primary"
                                            block
                                            size="large"
                                            onClick={handleCheckout}
                                            icon={<CreditCardOutlined />}
                                        >
                                            Tiến hành thanh toán
                                        </Button>
                                        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                                            Bằng việc tiếp tục, bạn đồng ý với các điều khoản sử dụng
                                        </Text>
                                    </Space>
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
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default CartPage;
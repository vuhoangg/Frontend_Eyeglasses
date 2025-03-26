// CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Button, InputNumber, message, Table, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;  // Thêm Paragraph vào đây

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart items from localStorage
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: quantity } : item
        );

        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    };

    const removeFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        message.success('Sản phẩm đã được xóa khỏi giỏ hàng.');
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        message.success('Giỏ hàng đã được làm trống.');
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const formatPrice = (value) => `${Number(value).toLocaleString('vi-VN')} VNĐ`;

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link to={`/product_detail/${record.id}`}>{text}</Link>,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => formatPrice(price),
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber
                    min={1}
                    defaultValue={record.quantity}
                    onChange={(value) => updateQuantity(record.id, value)}
                />
            ),
        },
        {
            title: 'Tổng cộng',
            key: 'total',
            render: (text, record) => formatPrice(record.price * record.quantity),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Button type="danger" onClick={() => removeFromCart(record.id)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1200, margin: '0 auto' }}>
                <Title level={2}>Giỏ hàng của bạn</Title>
                {cartItems.length === 0 ? (
                    <>
                        <Paragraph>Giỏ hàng của bạn đang trống.</Paragraph>
                        <Button type="primary"><Link to="/product">Tiếp tục mua sắm</Link></Button>
                    </>
                ) : (
                    <>
                        <Table dataSource={cartItems} columns={columns} rowKey="id" />
                        <Row justify="space-between" style={{ marginTop: 20 }}>
                            <Col>
                                <Button onClick={clearCart}>Xóa giỏ hàng</Button>
                            </Col>
                            <Col>
                                <Title level={4}>Tổng cộng: {formatPrice(calculateTotalPrice())}</Title>
                                <Button type="primary">Thanh toán</Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default CartPage;
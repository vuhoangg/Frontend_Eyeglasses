// CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Button, InputNumber, message, Table, Space, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import {
    createCartItemAPI,
    updateCartItemAPI,
    deleteCartItemAPI,
} from '../../services/api.cartItems';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const navigate = useNavigate();

    // Update screen size state when window resizes
    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Lấy userId khi component mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = localStorage.getItem("access_token");
        if (userData && userData.id && token) {
            setUserId(userData.id);
        } else {
            setUserId(null);
        }
    }, []);

    // Load cart từ localStorage khi component mount hoặc khi localStorage thay đổi
    useEffect(() => {
        const loadCart = () => {
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                 try {
                    const parsedCart = JSON.parse(storedCart);
                    // Ensure parsedCart is an array
                    setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
                 } catch(e) {
                    console.error("Error parsing cartItems from localStorage", e);
                    setCartItems([]);
                    localStorage.removeItem('cartItems'); // Xóa nếu data bị lỗi
                 }
            } else {
                setCartItems([]);
            }
        };

        loadCart();

        // Lắng nghe sự kiện storage để cập nhật nếu cart thay đổi ở tab khác
        window.addEventListener('storage', loadCart);
        return () => {
            window.removeEventListener('storage', loadCart);
        };
    }, []);

    // Hàm cập nhật số lượng
    const updateQuantity = async (productId, quantity) => {
        const itemIndex = cartItems.findIndex(item => item.id === productId);
        if (itemIndex === -1) return;

        const itemToUpdate = cartItems[itemIndex];
        const cartItemId = itemToUpdate.cart_item_id; // Get DB cart item ID if available

        if (quantity <= 0) {
            await removeFromCart(productId); // Call remove function if quantity is 0 or less
            return;
        }

        // 1. Update LocalStorage optimisticly
        const updatedCart = [...cartItems];
        updatedCart[itemIndex] = { ...itemToUpdate, quantity: quantity };

        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('storage')); // Notify other tabs/components

        // 2. Sync with DB if logged in and cart_item_id exists
        if (userId && cartItemId) {
            try {
                console.log(`Updating cart item ${cartItemId} quantity to ${quantity}`);
                // Pass cart_item_id, new quantity, color, size
                await updateCartItemAPI(cartItemId, quantity, itemToUpdate.color, itemToUpdate.size);
            } catch (error) {
                console.error("Error updating quantity on DB:", error);
                message.error("Lỗi cập nhật giỏ hàng trên hệ thống.");
            }
        } else if (userId && !cartItemId) {
             console.warn(`Cannot update product ${productId} on DB: missing cart_item_id. Maybe sync on next checkout.`);
        }
    };

    // Hàm xóa sản phẩm
    const removeFromCart = async (productId) => {
        const itemToRemove = cartItems.find(item => item.id === productId);
        if (!itemToRemove) return;

        const cartItemId = itemToRemove.cart_item_id; // Get DB cart item ID

        // 1. Update LocalStorage first
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        message.success('Sản phẩm đã được xóa khỏi giỏ hàng.');
        window.dispatchEvent(new Event('storage'));

        // 2. Sync deletion with DB if logged in and cart_item_id exists
        if (userId && cartItemId) {
            try {
                 console.log(`Deleting cart item ${cartItemId}`);
                 await deleteCartItemAPI(cartItemId); // Pass cart_item_id
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm trên DB:", error);
                message.error("Lỗi xóa sản phẩm trên hệ thống.");
            }
        } else if (userId && !cartItemId) {
             console.warn(`Cannot delete product ${productId} on DB: missing cart_item_id.`);
        }
    };

    // Hàm xóa toàn bộ giỏ hàng (Local + DB)
    const clearCart = async () => {
        // 1. Update LocalStorage
        setCartItems([]);
        localStorage.removeItem('cartItems');
        message.success('Giỏ hàng đã được làm trống.');
        window.dispatchEvent(new Event('storage'));

        // 2. Sync clear operation with DB if logged in
        if (userId) {
            try {
                console.log(`Clearing all cart items for user ${userId} on DB`);
                await clearMyCartAPI(); // Call the correct API function
            } catch (error) {
                console.error("Lỗi khi xóa toàn bộ giỏ hàng trên DB:", error);
                message.error("Lỗi khi làm trống giỏ hàng trên hệ thống.");
            }
        }
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    };

    const formatPrice = (value) => `${Number(value).toLocaleString('vi-VN')} VNĐ`;

    // Hàm xử lý khi nhấn Thanh toán
    const handleCheckout = async () => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = localStorage.getItem("access_token");

        if (!userId || !userData || !token) {
            message.error("Vui lòng đăng nhập để thanh toán.");
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
             message.warn("Giỏ hàng đang trống, vui lòng thêm sản phẩm.");
             return;
        }

        message.loading('Đang đồng bộ giỏ hàng...', 0);
        try {
            // BƯỚC 2: Tạo lại các cart items từ LocalStorage lên DB
            console.log("Attempting to save current local cart items to DB...");
            if (cartItems.length > 0) {
                const creationPromises = cartItems.map(item => {
                    console.log(` -> Saving Product ID: ${item.id}, Quantity: ${item.quantity}, Price: ${item.price}, Color: ${item.color}, Size: ${item.size}`);
                    return createCartItemAPI(
                        item.id,
                        Number(item.quantity) || 1,
                        Number(item.price) || 0,
                        item.color,
                        item.size
                    );
                });

                await Promise.all(creationPromises);
            } else {
                console.log("Local cart is empty, nothing to add to DB after clearing.");
            }

            message.destroy();
            message.success('Đồng bộ giỏ hàng thành công!');
            console.log("Cart synced successfully. Navigating to checkout...");
            navigate('/checkout');

        } catch (error) {
            message.destroy();
            console.error('Lỗi khi đồng bộ giỏ hàng trước khi thanh toán:', error);
            // const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đồng bộ giỏ hàng.';
            message.error(`${errorMsg} Vui lòng thử lại.`);
        }
    };

    // Dynamic columns based on screen size
    const getColumns = () => {
        // Base columns that show on all screen sizes
        const baseColumns = [
            {
                title: 'Sản phẩm',
                key: 'productInfo',
                render: (text_ignored, record) => {
                    const productId = record.product?.id ?? record.id;
                    const productName = record.product?.name ?? record.name ?? 'Sản phẩm không tên';
                    const imageFilename = record.product?.imageProduct ?? record.imageProduct ?? record.thumbnail;

                    let imageUrl = "https://placehold.co/40x40/eee/ccc?text=N/A";
                    if (imageFilename) {
                        if (imageFilename.startsWith('data:image')) {
                            imageUrl = imageFilename;
                        } else {
                            imageUrl = `http://localhost:8082/images/product/${imageFilename}`;
                        }
                    }

                    return (
                        <Space>
                            <img
                                src={imageUrl}
                                alt={productName}
                                style={{ 
                                    width: screenSize < 576 ? 30 : 40, 
                                    height: screenSize < 576 ? 30 : 40,
                                    objectFit: 'cover', 
                                    border: '1px solid #f0f0f0' 
                                }}
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/eee/ccc?text=Error" }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {productId ? (
                                    <Link to={`/product_detail/${productId}`} style={{ fontSize: screenSize < 576 ? '12px' : '14px' }}>
                                        {productName.length > 20 && screenSize < 576 ? `${productName.substring(0, 20)}...` : productName}
                                    </Link>
                                ) : (
                                    <span style={{ fontSize: screenSize < 576 ? '12px' : '14px' }}>
                                        {productName.length > 20 && screenSize < 576 ? `${productName.substring(0, 20)}...` : productName}
                                    </span>
                                )}
                                
                                {/* Show attributes inline on small screens */}
                                {screenSize < 768 && (
                                    <Space direction="vertical" size="small" style={{ marginTop: '4px' }}>
                                        {record.color && <Text type="secondary" style={{ fontSize: '11px' }}>Màu: {record.color}</Text>}
                                        {record.size && <Text type="secondary" style={{ fontSize: '11px' }}>Size: {record.size}</Text>}
                                        <Text type="secondary" style={{ fontSize: '11px' }}>
                                            {formatPrice(record.price)} x {record.quantity}
                                        </Text>
                                    </Space>
                                )}
                            </div>
                        </Space>
                    );
                },
            },
            {
                title: 'Số lượng',
                key: 'quantity',
                render: (text, record) => (
                    <InputNumber
                        min={0}
                        value={record.quantity}
                        onChange={(value) => {
                            const newQuantity = parseInt(value, 10);
                            if (!isNaN(newQuantity)) {
                                updateQuantity(record.id, newQuantity);
                            }
                        }}
                        style={{ width: screenSize < 576 ? 50 : 70 }}
                    />
                ),
            },
        ];

        // Columns to show only on medium screens and up
        const mediumScreenColumns = [
            {
                title: 'Giá',
                dataIndex: 'price',
                key: 'price',
                render: (price) => formatPrice(price),
            },
            // {
            //     title: 'Thuộc tính',
            //     key: 'attributes',
            //     render: (text, record) => (
            //         <Space direction="vertical" size="small">
            //             {record.color && <Text type="secondary">Màu: {record.color}</Text>}
            //             {record.size && <Text type="secondary">Size: {record.size}</Text>}
            //         </Space>
            //     )
            // },
        ];

        // Columns to show only on large screens
        const largeScreenColumns = [
            {
                title: 'Tổng cộng',
                key: 'total',
                render: (text, record) => formatPrice((Number(record.price) || 0) * (Number(record.quantity) || 0)),
            },
        ];

        // Action column shows on all screen sizes
        const actionColumn = {
            title: screenSize < 576 ? '' : 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Button 
                    type="link" 
                    danger 
                    onClick={() => removeFromCart(record.id)}
                    style={{ padding: screenSize < 576 ? '0 5px' : '', fontSize: screenSize < 576 ? '12px' : '14px' }}
                >
                    Xóa
                </Button>
            ),
         
        };

        // Combine columns based on screen size
        if (screenSize >= 992) {
            return [...baseColumns, ...mediumScreenColumns, ...largeScreenColumns, actionColumn];
        } else if (screenSize >= 768) {
            return [...baseColumns, ...mediumScreenColumns, actionColumn];
        } else {
            return [...baseColumns, actionColumn];
        }
    };

    // Get page content padding based on screen size
    const getContentPadding = () => {
        if (screenSize < 576) {
            return '10px';
        } else if (screenSize < 992) {
            return '15px 20px';
        } else {
            return '20px 50px';
        }
    };

    return (
        <Layout style={{ padding:'0', margin: '0' }}>
            <Content style={{ 
                padding: getContentPadding(),
                maxWidth: 1200, 
                margin: '20px auto',
                overflowX: 'hidden'
            }}>
                <Title level={screenSize < 576 ? 3 : 2} style={{ marginBottom: '20px' }}>Giỏ hàng của bạn</Title>
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <Paragraph style={{ fontSize: '16px' }}>Giỏ hàng của bạn đang trống.</Paragraph>
                        <Button type="primary" size="large">
                            <Link to="/product">Tiếp tục mua sắm</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div style={{ overflowX: 'auto' }}>
                            <Table
                                dataSource={cartItems}
                                columns={getColumns()}
                                rowKey={(record) => `${record.id}-${record.color || 'none'}-${record.size || 'none'}`}
                                pagination={false}
                                style={{ marginBottom: '24px' }}
                                scroll={{ x: 'max-content' }}
                                size={screenSize < 768 ? 'small' : 'middle'}
                            />
                        </div>
                        <Divider style={{ margin: '16px 0' }} />
                        <Row 
                            justify={screenSize < 576 ? 'center' : 'space-between'} 
                            align="middle" 
                            style={{ marginTop: 20 }}
                            gutter={[16, 16]}
                        >
                            <Col xs={24} sm={12} style={{ textAlign: screenSize < 576 ? 'center' : 'left' }}>
                                <Button onClick={clearCart} danger>Xóa hết giỏ hàng</Button>
                            </Col>
                            <Col xs={24} sm={12} style={{ textAlign: screenSize < 576 ? 'center' : 'right' }}>
                                <Title level={4} style={{ marginBottom: '10px' }}>
                                    Tổng cộng: <Text strong>{formatPrice(calculateTotalPrice())}</Text>
                                </Title>
                                <Button type="primary" size="large" onClick={handleCheckout} disabled={cartItems.length === 0}>
                                    Tiến hành thanh toán
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default CartPage;
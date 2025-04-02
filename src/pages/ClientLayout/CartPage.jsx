// CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Button, InputNumber, message, Table, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
// --- IMPORT FIX ---
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
    const navigate = useNavigate();

    // Lấy userId khi component mount
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = localStorage.getItem("access_token");
        if (userData && userData.id && token) {
            setUserId(userData.id);
        } else {
            // Handle case where user data/token is missing if necessary
            // Maybe clear userId state?
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
                // Consider reverting local state or fetching cart from DB on error
                // For now, just log and show message
            }
        } else if (userId && !cartItemId) {
             console.warn(`Cannot update product ${productId} on DB: missing cart_item_id. Maybe sync on next checkout.`);
             // Optional: You might want to add logic here to create the item on the DB
             // if it exists locally but not remotely (e.g., added while offline)
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
                // Consider reverting or re-fetching cart
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
                // Maybe fetch cart to ensure sync after error?
            }
        }
    };


    const calculateTotalPrice = () => {
        // Ensure items have price and quantity before calculating
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

        if (!userId || !userData || !token) { // Check userId state as well
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
            if (cartItems.length > 0) { // Only proceed if there are items to save
                const creationPromises = cartItems.map(item => {
                    console.log(` -> Saving Product ID: ${item.id}, Quantity: ${item.quantity}, Price: ${item.price}, Color: ${item.color}, Size: ${item.size}`);
                    // Ensure data types are correct, especially price
                    return createCartItemAPI(
                        item.id,            // productId
                        Number(item.quantity) || 1, // Ensure quantity is a number, default to 1 if invalid
                        Number(item.price) || 0,    // Ensure price is a number, default to 0 if invalid
                        item.color,         // color (can be null/undefined)
                        item.size           // size (can be null/undefined)
                    );
                });

                // Wait for all creation promises to resolve
                await Promise.all(creationPromises);
            } else {
                console.log("Local cart is empty, nothing to add to DB after clearing.");
            }


            message.destroy(); // Hide loading message
            message.success('Đồng bộ giỏ hàng thành công!');

            // BƯỚC 3: Chuyển trang KHI đồng bộ thành công
            console.log("Cart synced successfully. Navigating to checkout...");
            navigate('/checkout');

        } catch (error) {
            message.destroy(); // Hide loading message
            console.error('Lỗi khi đồng bộ giỏ hàng trước khi thanh toán:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đồng bộ giỏ hàng.';
            message.error(`${errorMsg} Vui lòng thử lại.`);
            // Do NOT navigate if sync failed
        }
        // --- REMOVE REDUNDANT NAVIGATION ---
        // console.log("Navigating to checkout..."); // This line is removed
        // navigate('/checkout'); // This line is removed
    };

    // Cấu hình cột cho bảng
    const columns = [
         {
            title: 'Sản phẩm',
            key: 'productInfo', // Changed key to be more descriptive
            render: (text_ignored, record) => {
                const productId = record.product?.id ?? record.id;
                const productName = record.product?.name ?? record.name ?? 'Sản phẩm không tên';
                const imageFilename = record.product?.imageProduct ?? record.imageProduct ?? record.thumbnail; // Added fallback for thumbnail

                // Handle potential base64 images or build URL
                let imageUrl = "https://placehold.co/40x40/eee/ccc?text=N/A"; // Default placeholder
                if (imageFilename) {
                     // Basic check if it looks like a filename vs a base64 string
                    if (imageFilename.startsWith('data:image')) {
                        imageUrl = imageFilename; // Assume it's a base64 string
                    } else {
                         // Assume it's a filename, construct URL
                        imageUrl = `http://localhost:8082/images/product/${imageFilename}`; // Adjust BASE_URL if needed
                    }
                }


                return (
                    <Space>
                         <img
                            src={imageUrl}
                            alt={productName}
                            style={{ width: 40, height: 40, objectFit: 'cover', border: '1px solid #f0f0f0' }}
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/eee/ccc?text=Error" }}
                        />
                        {productId ? (
                             <Link to={`/product_detail/${productId}`}>{productName}</Link>
                        ) : (
                            <span>{productName}</span> // Render as text if no ID for linking
                        )}
                     </Space>
                );
            },
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
                    min={0} // Allow 0, updateQuantity handles removal
                    value={record.quantity}
                    onChange={(value) => {
                         // Prevent non-numeric input if necessary or handle NaN
                         const newQuantity = parseInt(value, 10);
                         if (!isNaN(newQuantity)) {
                             updateQuantity(record.id, newQuantity);
                         }
                     }}
                    style={{ width: 70 }} // Adjust width as needed
                />
            ),
        },
        {
             title: 'Thuộc tính', // Optional: Display Color/Size
             key: 'attributes',
             render: (text, record) => (
                 <Space direction="vertical" size="small">
                     {record.color && <Text type="secondary">Màu: {record.color}</Text>}
                     {record.size && <Text type="secondary">Size: {record.size}</Text>}
                 </Space>
             )
         },
        {
            title: 'Tổng cộng',
            key: 'total',
            render: (text, record) => formatPrice((Number(record.price) || 0) * (Number(record.quantity) || 0)),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Button type="link" danger onClick={() => removeFromCart(record.id)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <Content style={{ padding: '20px 50px', maxWidth: 1200, margin: '20px auto' }}> {/* Added top margin */}
                <Title level={2} style={{ marginBottom: '20px' }}>Giỏ hàng của bạn</Title> {/* Added bottom margin */}
                {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}> {/* Centered content */}
                        <Paragraph style={{ fontSize: '16px' }}>Giỏ hàng của bạn đang trống.</Paragraph>
                        <Button type="primary" size="large"> {/* Larger button */}
                            <Link to="/product">Tiếp tục mua sắm</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <Table
                            dataSource={cartItems}
                            columns={columns}
                            rowKey={(record) => `${record.id}-${record.color || 'none'}-${record.size || 'none'}`} // More specific rowKey if color/size matters for uniqueness
                            pagination={false}
                            style={{ marginBottom: '24px' }} // Add space below table
                         />
                        <Row justify="space-between" align="middle" style={{ marginTop: 20 }}> {/* Align items vertically */}
                            <Col>
                                <Button onClick={clearCart} danger>Xóa hết giỏ hàng</Button>
                            </Col>
                            <Col style={{ textAlign: 'right' }}>
                                <Title level={4} style={{ marginBottom: '10px' }}> {/* Space below total */}
                                    Tổng cộng: <Text strong>{formatPrice(calculateTotalPrice())}</Text> {/* Bolder total */}
                                </Title>
                                <Button type="primary" size="large" onClick={handleCheckout} disabled={cartItems.length === 0}> {/* Disable if cart is empty */}
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
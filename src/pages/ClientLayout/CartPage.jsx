// CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Button, InputNumber, message, Table, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { createCartItemAPI, updateCartItemAPI, deleteCartItemAPI, deleteAllCartItemsForUserAPI } from '../../services/api.cartItems'; // Thêm update/delete/deleteAll

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
        }
    }, []);

    // Load cart từ localStorage khi component mount hoặc khi localStorage thay đổi
    useEffect(() => {
        const loadCart = () => {
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                 try {
                    setCartItems(JSON.parse(storedCart));
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
        const itemToUpdate = cartItems.find(item => item.id === productId);
        if (!itemToUpdate) return;

        const cartItemId = itemToUpdate.cart_item_id; // Lấy ID cart item DB

        if (quantity <= 0) {
            await removeFromCart(productId); // Gọi hàm xóa nếu số lượng <= 0
            return;
        }

        // 1. Cập nhật LocalStorage
        const updatedCart = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: quantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('storage')); // Thông báo thay đổi

        // 2. Đồng bộ DB nếu đăng nhập và có cart_item_id
        if (userId && cartItemId) {
            try {
                console.log(`Updating cart item ${cartItemId} quantity to ${quantity}`);
                await updateCartItemAPI(cartItemId, quantity, itemToUpdate.color, itemToUpdate.size); // Truyền cart_item_id
            } catch (error) {
                console.error("Lỗi khi cập nhật số lượng trên DB:", error);
                message.error("Lỗi cập nhật giỏ hàng trên hệ thống.");
                // Rollback? Hoặc fetch lại cart?
            }
        } else if (userId && !cartItemId) {
             console.warn(`Cannot update product ${productId} on DB: missing cart_item_id.`);
             // Có thể cần logic tạo mới nếu cart_item_id bị thiếu
        }
    };

    // Hàm xóa sản phẩm
    const removeFromCart = async (productId) => {
        const itemToRemove = cartItems.find(item => item.id === productId);
        if (!itemToRemove) return;

        const cartItemId = itemToRemove.cart_item_id; // Lấy ID cart item DB

        // 1. Cập nhật LocalStorage
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        message.success('Sản phẩm đã được xóa khỏi giỏ hàng.');
        window.dispatchEvent(new Event('storage'));

        // 2. Đồng bộ DB nếu đăng nhập và có cart_item_id
        if (userId && cartItemId) {
            try {
                 console.log(`Deleting cart item ${cartItemId}`);
                await deleteCartItemAPI(cartItemId); // Truyền cart_item_id
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm trên DB:", error);
                message.error("Lỗi xóa sản phẩm trên hệ thống.");
                // Rollback? Hoặc fetch lại cart?
            }
        } else if (userId && !cartItemId) {
             console.warn(`Cannot delete product ${productId} on DB: missing cart_item_id.`);
        }
    };

    // Hàm xóa toàn bộ giỏ hàng
    const clearCart = async () => {
        // 1. Cập nhật LocalStorage
        setCartItems([]);
        localStorage.removeItem('cartItems');
        message.success('Giỏ hàng đã được làm trống.');
        window.dispatchEvent(new Event('storage'));

        // 2. Đồng bộ DB nếu đăng nhập
        if (userId) {
            try {
                console.log(`Clearing all cart items for user ${userId}`);
                 // Quan trọng: Đảm bảo API này tồn tại và hoạt động đúng
                await deleteAllCartItemsForUserAPI(userId);
            } catch (error) {
                console.error("Lỗi khi xóa toàn bộ giỏ hàng trên DB:", error);
                message.error("Lỗi khi làm trống giỏ hàng trên hệ thống.");
                // Có thể cần fetch lại cart để đảm bảo đồng bộ
            }
        }
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const formatPrice = (value) => `${Number(value).toLocaleString('vi-VN')} VNĐ`;

    // Hàm xử lý khi nhấn Thanh toán
    const handleCheckout = async () => { // Bỏ async vì không cần gọi API ở đây nữa
        const userData = JSON.parse(localStorage.getItem("userData"));
        const token = localStorage.getItem("access_token");

        if (!userData || !token) {
            message.error("Vui lòng đăng nhập để thanh toán.");
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
             message.warn("Giỏ hàng đang trống, vui lòng thêm sản phẩm.");
             return;
        }

        // --- LOGIC LƯU CART VÀO DB (THEO YÊU CẦU) ---
        // Sử dụng cách "Xóa cũ -> Tạo lại mới" để đảm bảo đồng bộ
        message.loading('Đang đồng bộ giỏ hàng...', 0); // Hiển thị chỉ báo loading
        try {
            // BƯỚC 1: Xóa tất cả cart items hiện có trên DB của user này
            console.log(`Attempting to clear existing DB cart items for user ${userId}...`);
            // Giả sử deleteAllCartItemsForUserAPI xóa thành công (mềm hoặc cứng tùy backend)
            await deleteAllCartItemsForUserAPI(userId);
            console.log(`Existing DB cart items cleared for user ${userId}.`);

            // BƯỚC 2: Tạo lại cart items trên DB từ localStorage hiện tại
            console.log("Attempting to save current local cart items to DB...");
            const creationPromises = cartItems.map(item => {
                 console.log(` -> Saving Product ID: ${item.id}, Quantity: ${item.quantity}`);
                 // Gọi API tạo mới cho từng item
                 // Backend sẽ dùng token để lấy userId và tạo bản ghi mới
                 return createCartItemAPI(
                    item.id,            // productId
                    item.quantity,
                    Number(item.price), // Đảm bảo giá là số
                    item.color,         // color (nếu có)
                    item.size           // size (nếu có)
                 );
            });

            // Chờ tất cả các API tạo item hoàn thành
            await Promise.all(creationPromises);

            message.destroy(); // Ẩn chỉ báo loading
            message.success('Đồng bộ giỏ hàng thành công!'); // Thông báo thành công (tùy chọn)

            // BƯỚC 3: Chỉ chuyển trang KHI đồng bộ thành công
            console.log("Cart synced successfully. Navigating to checkout...");
            navigate('/checkout');

        } catch (error) {
            message.destroy(); // Ẩn chỉ báo loading
            console.error('Lỗi khi đồng bộ giỏ hàng trước khi thanh toán:', error);
            // Hiển thị lỗi chi tiết hơn nếu có từ response
            const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đồng bộ giỏ hàng.';
            message.error(`${errorMsg} Vui lòng thử lại.`);
            // Không chuyển trang nếu có lỗi xảy ra
        }
        // --- KẾT THÚC LOGIC LƯU CART ---

        console.log("Navigating to checkout...");
        navigate('/checkout');
    };

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: 'Sản phẩm',
            // dataIndex không còn quá quan trọng vì ta lấy trực tiếp từ record
            key: 'name',
            render: (text_ignored, record) => { // Đổi tên tham số đầu vì không dùng trực tiếp
                // Xác định thông tin sản phẩm dựa trên cấu trúc record có thể có
                const productId = record.product?.id ?? record.id; // Lấy product.id nếu có, nếu không thì lấy id gốc
                const productName = record.product?.name ?? record.name ?? 'Sản phẩm lỗi'; // Lấy product.name nếu có, nếu không thì lấy name gốc, cuối cùng là fallback
                const imageFilename = record.product?.imageProduct ?? record.imageProduct; // Lấy product.imageProduct nếu có, nếu không thì lấy imageProduct gốc
        
                // Tạo URL ảnh, có fallback placeholder
                let imageUrl = "https://placehold.co/40x40/eee/ccc?text=N/A"; // Ảnh placeholder mặc định
                if (imageFilename) {
                    // Chỉ tạo URL nếu có tên file ảnh
                    imageUrl = `http://localhost:8082/images/product/${imageFilename}`;
                }
        
                return (
                    <Space>
                         <img
                            src={imageUrl} // Sử dụng URL đã xác định
                            alt={productName} // Sử dụng tên sản phẩm đã xác định
                            style={{ width: 40, height: 40, objectFit: 'cover', border: '1px solid #f0f0f0' }} // Thêm border nhẹ
                            // onError xử lý nếu link ảnh bị lỗi (tùy chọn)
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/eee/ccc?text=Error" }}
                        />
                        {/* Link tới trang chi tiết với productId đã xác định */}
                        <Link to={`/product_detail/${productId}`}>{productName}</Link>
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
                    min={1} // Giữ min=1, logic xóa khi <=0 đã xử lý trong updateQuantity
                    value={record.quantity} // Sử dụng value thay vì defaultValue để control component
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
                 // Gọi hàm mới removeFromCart thay vì hàm cũ
                <Button type="link" danger onClick={() => removeFromCart(record.id)}>
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
                        {/* Sử dụng product id làm rowKey */}
                        <Table dataSource={cartItems} columns={columns} rowKey="id" pagination={false} />
                        <Row justify="space-between" style={{ marginTop: 20 }}>
                            <Col>
                                 {/* Gọi hàm mới clearCart */}
                                <Button onClick={clearCart} danger>Xóa hết giỏ hàng</Button>
                            </Col>
                            <Col style={{ textAlign: 'right' }}>
                                <Title level={4}>Tổng cộng: {formatPrice(calculateTotalPrice())}</Title>
                                <Button type="primary" size="large" onClick={handleCheckout}>Tiến hành thanh toán</Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default CartPage;
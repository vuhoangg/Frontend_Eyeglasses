// CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Button, Form, Input, Radio, message, Steps, Card, Divider, List, Avatar } from 'antd'; // Bỏ Tag nếu không dùng
import { Link, useNavigate } from 'react-router-dom';
import { createOrderAPI } from '../../services/api.order';
import { clearMyCartAPI } from '../../services/api.cartItems'; // Import hàm xóa cart DB
import { createOrderItemAPI } from '../../services/api.orderItem'; // Import API tạo OrderItem
import {
    ShoppingCartOutlined,
    UserOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    DeleteOutlined,
    CheckCircleOutlined // Đảm bảo đã import icon này
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Step } = Steps;

const CheckoutPage = () => {
    const [userInfo, setUserInfo] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // Step hiện tại

    // Effect để load user và cart data khi component mount hoặc navigate thay đổi
    useEffect(() => {
        // Load User Data
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                setUserInfo(userData);
                // Set giá trị mặc định cho form
                form.setFieldsValue({
                    fullName: userData?.username || `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || '',
                    phone: userData?.phone || '',
                });
            } catch (error) {
                console.error('Error parsing userData:', error);
                message.error('Không thể tải thông tin người dùng.');
                setUserInfo({});
                navigate('/login'); // Chuyển về login nếu lỗi
            }
        } else {
            // Chưa đăng nhập
            message.error("Vui lòng đăng nhập để tiếp tục thanh toán.");
            navigate('/login');
            setUserInfo({});
        }

        // Load Cart Data
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                // Kiểm tra cart hợp lệ và không rỗng
                if (!Array.isArray(parsedCart) || parsedCart.length === 0) {
                    message.warn("Giỏ hàng trống. Vui lòng thêm sản phẩm.");
                    navigate('/product'); // Chuyển về trang sản phẩm nếu giỏ trống
                    setCartItems([]);
                } else {
                    setCartItems(parsedCart);
                }
            } catch(e) {
                console.error("Error parsing cartItems:", e);
                setCartItems([]);
                localStorage.removeItem('cartItems'); // Xóa cart lỗi
                message.error("Lỗi đọc giỏ hàng. Vui lòng thử lại.");
                navigate('/cart_page'); // Quay về giỏ hàng nếu lỗi
            }
        } else {
             // Không có cart trong localStorage
             message.warn("Giỏ hàng trống.");
             navigate('/product');
             setCartItems([]);
        }

        setCurrentStep(1); // Đặt step hiện tại là "Đặt hàng & Thanh toán"

    }, [form, navigate]); // Dependencies

    // Tính tổng tiền giỏ hàng
    const totalPrice = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

    // --- Hàm xử lý đặt hàng ---
    const handlePlaceOrder = async () => {
        try {
            const values = await form.validateFields(); // Validate form trước
            setLoading(true);

            const { shippingAddress, paymentMethod, promotionId, fullName, phone } = values;

            // Kiểm tra lại cart và user info
            if (!cartItems || cartItems.length === 0) {
                message.error('Giỏ hàng trống.');
                setLoading(false);
                navigate('/product');
                return;
            }
            if (!userInfo || !userInfo.id) {
                message.error('Không tìm thấy thông tin người dùng.');
                setLoading(false);
                navigate('/login');
                return;
            }

            // Chuẩn bị payload cho API tạo Order
            const orderDataPayload = {
                userId: userInfo.id,
                cartItems: cartItems.map(item => ({ // Dùng để tạo OrderItem sau này
                    productId: item.id,
                    quantity: item.quantity,
                    price: Number(item.price)
                })),
                shippingAddress,
                paymentMethod: paymentMethod || 'cash',
                order_status_id: 1, // ID trạng thái "Pending" (cần đảm bảo ID này đúng)
                totalAmount: totalPrice,
                promotionId: promotionId ? Number(promotionId) : null,
                fullName: fullName,
                phone: phone,
            };

            // --- BƯỚC 1: Gọi API tạo Order ---
            console.log("Sending order data to createOrderAPI:", orderDataPayload);
            const orderResponse = await createOrderAPI(
                orderDataPayload.userId,
                orderDataPayload.cartItems, // Vẫn gửi lên, backend có thể sẽ dùng sau
                orderDataPayload.shippingAddress,
                orderDataPayload.paymentMethod,
                orderDataPayload.totalAmount,
                orderDataPayload.promotionId,
                orderDataPayload.fullName,
                orderDataPayload.phone
                // Thêm order_status_id nếu API yêu cầu
            );
             console.log("Create order API response:", orderResponse);

            // --- BƯỚC 2: Xử lý kết quả tạo Order và tạo Order Items ---
            if (orderResponse && (orderResponse.statusCode === 201 || orderResponse.status === 201) && orderResponse.data?.id) {
                const orderId = orderResponse.data.id; // Lấy ID của Order vừa tạo
                message.loading(`Đơn hàng #${orderId} đã được tạo. Đang lưu chi tiết...`, 1); // Thông báo tạm thời

               // --- BƯỚC 2.1: Tạo từng OrderItem ---
let allItemsSaved = true;
try {
    console.warn(`--- Starting Order Item Creation Loop for Order ID: ${orderId} ---`);

    const orderItemPromises = cartItems.map(item => {
        // --- XÁC ĐỊNH ĐÚNG productId VÀ price ---
        let productId;
        let productPrice;

        if (item.product && item.product.id) {
            // Cấu trúc loại 1: Item từ DB cart (có nested product)
            productId = item.product.id;
            productPrice = Number(item.product.price); // Lấy giá từ product bên trong
             console.log(`Item structure type 1 detected. Product ID: ${productId}, Price: ${productPrice}`);
        } else if (item.id) {
             // Cấu trúc loại 2: Item thêm trực tiếp (id gốc là product_id)
            productId = item.id;
            productPrice = Number(item.price); // Lấy giá từ item gốc
            console.log(`Item structure type 2 detected. Product ID: ${productId}, Price: ${productPrice}`);
        } else {
             // Trường hợp không xác định được productId
             console.error("!!! Cannot determine Product ID for item:", item);
             // Quyết định xử lý: Ném lỗi hoặc bỏ qua item này
             // Ví dụ: Ném lỗi để dừng toàn bộ quá trình
             throw new Error("Không thể xác định ID sản phẩm cho một mục trong giỏ hàng.");
             // Hoặc return null/Promise.resolve() và lọc ra sau, nhưng không khuyến khích vì đơn hàng sẽ thiếu sót
        }

        // Kiểm tra lại giá trị trước khi gọi API
        if (!productId || isNaN(productPrice) || !item.quantity) {
             console.error(`!!! Invalid data for OrderItem - ProductID: ${productId}, Price: ${productPrice}, Quantity: ${item.quantity}`, item);
             throw new Error("Dữ liệu không hợp lệ để tạo chi tiết đơn hàng.");
        }

        console.log(`Preparing createOrderItemAPI call - Order: ${orderId}, Product: ${productId}, Qty: ${item.quantity}, Price: ${productPrice}`);
        return createOrderItemAPI(
            orderId,
            productId,     // <-- Đã sửa: Dùng productId đã xác định
            item.quantity,
            productPrice   // <-- Đã sửa: Dùng productPrice đã xác định
        );
    });

    // Chờ tất cả các request tạo OrderItem hoàn thành
    // Lưu ý: Nếu bạn return null ở trên cho item lỗi, bạn cần lọc ra trước Promise.all
    // const validPromises = orderItemPromises.filter(p => p !== null);
    // await Promise.all(validPromises);
    await Promise.all(orderItemPromises); // Giả sử ném lỗi nếu có item không hợp lệ

    console.warn("--- Finished Order Item Creation Loop ---");
    message.success(`Đã lưu chi tiết các sản phẩm cho đơn hàng #${orderId}.`, 3);

} catch (itemError) {
    allItemsSaved = false;
    // (Giữ nguyên phần xử lý lỗi còn lại)
    console.error(`!!! Critical error during OrderItem creation for Order ID ${orderId}:`, itemError.response?.data || itemError.message || itemError);
    let errorDetails = itemError.response?.data?.message || itemError.message || "Lỗi không xác định khi lưu chi tiết đơn hàng.";
    message.error(`Lỗi nghiêm trọng: ${errorDetails}. Đơn hàng #${orderId} có thể chưa hoàn chỉnh. Vui lòng liên hệ hỗ trợ!`, 10);
    setLoading(false);
    return; // Dừng ngay lập tức
}


                // --- BƯỚC 3: Xóa giỏ hàng DB và LocalStorage (Chỉ khi tất cả Item được lưu) ---
                if (allItemsSaved) {
                    try {
                           // Xóa cứng giỏ hàng
                        console.log(`Clearing DB cart items for user ${userInfo.id} after successful order ${orderId}`);
                        await clearMyCartAPI(); // Gọi hàm xóa cứng mới
                    } catch (clearError) {
                        console.error("Error clearing cart items after order:", clearError);
                        message.warning("Đặt hàng thành công nhưng có lỗi khi dọn dẹp giỏ hàng cũ.");
                    } finally {
                        localStorage.removeItem('cartItems'); // Xóa cart local
                        setCartItems([]); // Cập nhật state
                        window.dispatchEvent(new Event('storage')); // Thông báo cho Header
                    }

                    // --- BƯỚC 4: Chuyển hướng đến trang thành công ---
                    navigate('/order-success', {
                        replace: true, // Không cho back lại trang checkout
                        state: {
                            orderNumber: orderId,
                            orderData: { // Gửi dữ liệu cần thiết để hiển thị lại
                                ...orderDataPayload,
                                cartItems: cartItems // Gửi cartItems gốc
                            }
                        }
                    });
                }

            } else {
                 // Lỗi từ API tạo Order ban đầu
                const errorMsg = orderResponse?.message || orderResponse?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.';
                message.error(errorMsg);
                console.error("Initial Order creation failed:", orderResponse);
            }
        } catch (error) {
             // Lỗi validate form hoặc lỗi mạng chung
             if (error.name === 'ValidateError') {
                message.warning('Vui lòng điền đầy đủ và chính xác thông tin giao hàng.');
            } else {
                console.error('Unhandled error during place order process:', error);
                const errorMsg = error.response?.data?.message || 'Có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.';
                message.error(errorMsg);
            }
        } finally {
            setLoading(false); // Luôn tắt loading dù thành công hay thất bại
        }
    };

    // Hàm xóa item khỏi cart (chỉ xóa ở trang này)
    const removeFromCartLocal = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Cập nhật lại local storage
        message.info('Đã xóa sản phẩm khỏi đơn hàng này.');
         window.dispatchEvent(new Event('storage')); // Thông báo cho Header
         if (updatedCart.length === 0) {
             navigate('/cart_page'); // Quay về giỏ hàng nếu xóa hết
         }
    };

    // --- Render JSX ---
    return (
        <Layout>
            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', background: '#f5f5f5' }}>
                {/* Steps */}
                <Card style={{ marginBottom: 24 }}>
                    <Steps current={currentStep} style={{ marginBottom: 32 }}>
                        <Step title="Giỏ hàng" icon={<ShoppingCartOutlined />} status={currentStep > 0 ? 'finish' : 'process'} />
                        <Step title="Đặt hàng & Thanh toán" icon={<EnvironmentOutlined />} status={currentStep === 1 ? 'process' : (currentStep > 1 ? 'finish' : 'wait')} />
                        <Step title="Hoàn thành" icon={<CheckCircleOutlined />} status={currentStep === 2 ? 'process' : 'wait'} disabled />
                    </Steps>
                </Card>

                <Row gutter={[24, 24]}>
                    {/* Cột trái: Order Items & Form */}
                    <Col xs={24} md={16}>
                        {/* Danh sách sản phẩm */}
                        <Card title={<Title level={4}>Kiểm tra lại đơn hàng</Title>} style={{ marginBottom: 24 }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={cartItems}
                                renderItem={item => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeFromCartLocal(item.id)}
                                                title="Xóa khỏi đơn hàng"
                                            />
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    shape="square"
                                                    size={64}
                                                    // --- Code hiển thị ảnh đã được khôi phục ---
                                                    src={
                                                        item.imageProduct
                                                            ? `http://localhost:8082/images/product/${item.imageProduct}`
                                                            : (item.product?.imageProduct
                                                                ? `http://localhost:8082/images/product/${item.product.imageProduct}`
                                                                : "https://placehold.co/64x64")
                                                    }
                                                    alt={item.name || 'Hình sản phẩm'}
                                                />
                                            }
                                            title={<Text strong>{item.name || 'Sản phẩm không tên'}</Text>}
                                            description={ // --- Code mô tả đã được khôi phục ---
                                                <>
                                                    <Text>Số lượng: {item.quantity}</Text>
                                                    <br />
                                                    <Text type="secondary">{Number(item.price).toLocaleString('vi-VN')} đ</Text>
                                                </>
                                            }
                                        />
                                        <div>
                                            <Text strong>{(Number(item.price) * item.quantity).toLocaleString('vi-VN')} đ</Text>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>

                        {/* Form thông tin */}
                        <Card title={<Title level={4}>Thông tin giao hàng & Thanh toán</Title>}>
                            <Form form={form} layout="vertical" onFinish={handlePlaceOrder}>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="fullName"
                                            label="Họ tên người nhận"
                                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                        >
                                            <Input prefix={<UserOutlined />} placeholder="Họ tên người nhận" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="phone"
                                            label="Số điện thoại người nhận"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                                // { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' } // Rule ví dụ
                                            ]}
                                        >
                                            <Input placeholder="Số điện thoại người nhận" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="shippingAddress"
                                    label="Địa chỉ giao hàng"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}
                                >
                                    <Input.TextArea rows={3} placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    name="paymentMethod"
                                    label="Phương thức thanh toán"
                                    initialValue="cash"
                                    rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                                >
                                    <Radio.Group>
                                        <Radio value="cash">Thanh toán khi nhận hàng (COD)</Radio>
                                        <Radio value="bank" disabled>Chuyển khoản ngân hàng (Tạm đóng)</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item name="promotionId" label="Mã giảm giá (Nếu có)">
                                    <Input placeholder="Nhập mã giảm giá" />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    {/* Cột phải: Tóm tắt */}
                    <Col xs={24} md={8}>
                        <Card title={<Title level={4}>Tóm tắt đơn hàng</Title>}>
                            <div style={{ marginBottom: 16 }}>
                                <Row justify="space-between">
                                    <Col><Text>Tạm tính ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm):</Text></Col>
                                    <Col><Text>{totalPrice.toLocaleString('vi-VN')} đ</Text></Col>
                                </Row>
                                <Row justify="space-between" style={{ marginTop: 8 }}>
                                    <Col><Text>Phí vận chuyển:</Text></Col>
                                    <Col><Text>Miễn phí</Text></Col> {/* Hoặc tính phí */}
                                </Row>
                                {/* Thêm dòng hiển thị giảm giá nếu có promotionId */}
                            </div>
                            <Divider style={{ margin: '12px 0' }} />
                            <div style={{ marginBottom: 24 }}>
                                <Row justify="space-between">
                                    <Col><Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text></Col>
                                    <Col>
                                        <Text style={{ fontSize: 18, color: '#f5222d', fontWeight: 'bold' }}>
                                            {totalPrice.toLocaleString('vi-VN')} đ
                                        </Text>
                                    </Col>
                                </Row>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => form.submit()} // Trigger submit form
                                loading={loading}
                                style={{ height: 45 }}
                                disabled={cartItems.length === 0 || loading} // Disable nếu rỗng hoặc đang loading
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt Hàng Ngay'}
                            </Button>
                             <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <Link to="/cart_page">Quay lại giỏ hàng</Link>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default CheckoutPage;
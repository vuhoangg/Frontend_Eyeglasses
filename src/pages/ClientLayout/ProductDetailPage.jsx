// ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Button,
    Space,
    Divider,
    Rate,
    Badge,
    Tag,
    InputNumber,
    message,
    Descriptions,
    Spin,
    Breadcrumb
} from 'antd';
import {
    ShoppingCartOutlined,
    HeartOutlined,
    ShareAltOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchProductByIdAPI } from '../../services/api.product';
// Import API function để tạo cart item
import { createCartItemAPI, updateCartItemAPI } from '../../services/api.cartItems';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const ProductDetailPage = () => {
    const { id: productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
            setUserId(userData.id);
        } else {
            setUserId(null);
        }
    }, []);


    useEffect(() => {
        console.log("ProductId:", productId);

        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await fetchProductByIdAPI(productId);

                if (response && response.data) {
                    console.log("Product data:", response.data);
                    setProduct(response.data);
                } else {
                    message.error("Không thể tải thông tin sản phẩm. Dữ liệu không hợp lệ.");
                    setProduct(null);
                }
            } catch (error) {
                message.error("Không thể tải thông tin sản phẩm.");
                console.error(error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetails();
        } else {
            message.error("ProductId không hợp lệ.");
            setLoading(false);
            setProduct(null);
        }
    }, [productId]);

    // --- HÀM MUA NGAY ---
    const handleBuyNow = async () => {
        if (!product || !product.id) {
            message.error("Sản phẩm không hợp lệ hoặc chưa được tải.");
            return;
        }
        if (!quantity || quantity <= 0) {
             message.warn("Vui lòng chọn số lượng hợp lệ.");
             return;
        }

        // 1. Load existing cart items from local storage
        const storedCart = localStorage.getItem('cartItems');
        let cartItems = [];
         try {
            const parsed = storedCart ? JSON.parse(storedCart) : [];
            if (Array.isArray(parsed)) {
                cartItems = parsed;
            } else {
                 console.warn("Cart data in localStorage was not an array. Resetting.");
                 localStorage.removeItem('cartItems');
            }
        } catch (e) {
            console.error("Error parsing cartItems from localStorage", e);
            localStorage.removeItem('cartItems');
            cartItems = [];
        }

        // 2. Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        let updatedCartItems = [...cartItems];

        if (existingItemIndex > -1) {
            // 3a. If the item exists, update the quantity
            updatedCartItems[existingItemIndex].quantity += quantity;
        } else {
            // 3b. If the item doesn't exist, add it
             const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                imageProduct: product.imageProduct,
                quantity: quantity,
                categoryName: product.category?.name,
                brandName: product.brand?.name,
             };
             updatedCartItems.push(newItem);
        }

        // 4. Save the updated cart items to local storage
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        window.dispatchEvent(new Event('storage'));

        // 5. Đồng bộ giỏ hàng với DB nếu user đã đăng nhập
        if (userId) {
            message.loading("Đang xử lý...", 0);
            try {
                const itemInCart = updatedCartItems.find(item => item.id === product.id);
                if (itemInCart) {
                    const cartItemData = {
                        productId: itemInCart.id,
                        quantity: itemInCart.quantity,
                        price: itemInCart.price,
                        // Thêm các thuộc tính khác nếu cần như color, size
                    };
                    if (existingItemIndex > -1 && cartItems[existingItemIndex].cart_item_id) {
                        // Cập nhật item đã có trong DB cart
                        await updateCartItemAPI(cartItems[existingItemIndex].cart_item_id, itemInCart.quantity);
                    } else {
                        // Tạo mới item trong DB cart
                        await createCartItemAPI(cartItemData.productId, cartItemData.quantity, cartItemData.price);
                    }
                }
                message.destroy();
                message.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng và đồng bộ!`);
                // 6. Chuyển hướng đến trang thanh toán ngay lập tức
                navigate('/checkout');

            } catch (error) {
                message.destroy();
                console.error("Lỗi khi đồng bộ giỏ hàng với DB:", error);
                message.error("Lỗi khi đồng bộ giỏ hàng. Vui lòng thử lại sau.");
                // Có thể cần cơ chế retry hoặc thông báo cho người dùng về việc giỏ hàng có thể chưa được đồng bộ
            }
        } else {
            message.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
            // 6. Chuyển hướng đến trang thanh toán ngay lập tức (nếu không cần DB sync)
            navigate('/checkout');
        }
    };
    // --- KẾT THÚC HÀM handleBuyNow ---


    const handleAddToCart = () => {
        // ... (hàm handleAddToCart giữ nguyên) ...
         if (!product || !product.id) {
            message.error("Sản phẩm không hợp lệ hoặc chưa được tải.");
            return;
        }
        // Đảm bảo quantity là số dương hợp lệ
        if (!quantity || quantity <= 0) {
             message.warn("Vui lòng chọn số lượng hợp lệ.");
             return;
        }

        console.log(`Adding product ${product.id} (${product.name}) with quantity ${quantity} to cart.`);

        // 1. Load existing cart items from local storage
        const storedCart = localStorage.getItem('cartItems');
        let cartItems = [];
         try {
            const parsed = storedCart ? JSON.parse(storedCart) : [];
            if (Array.isArray(parsed)) {
                cartItems = parsed;
            } else {
                 console.warn("Cart data in localStorage was not an array. Resetting.");
                 localStorage.removeItem('cartItems');
            }
        } catch (e) {
            console.error("Error parsing cartItems from localStorage", e);
            localStorage.removeItem('cartItems');
            cartItems = [];
        }

        // 2. Check if the item already exists in the cart (dựa trên ID)
        // Nếu bạn có biến thể (màu, size), logic findIndex cần phức tạp hơn
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            // 3a. If the item exists, update the quantity
            cartItems[existingItemIndex].quantity += quantity;
            console.log(`Product ${product.id} exists, updated quantity: ${cartItems[existingItemIndex].quantity}`);
             // Tùy chọn: Kiểm tra nếu số lượng mới vượt quá tồn kho
             // if (cartItems[existingItemIndex].quantity > product.stock_quantity) {
             //    message.warn(`Số lượng trong giỏ (${cartItems[existingItemIndex].quantity}) vượt quá tồn kho (${product.stock_quantity}). Đã điều chỉnh.`);
             //    cartItems[existingItemIndex].quantity = product.stock_quantity;
             // }
        } else {
            // 3b. If the item doesn't exist, add it to the cart with essential info
             const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                imageProduct: product.imageProduct, // Đảm bảo trường này tồn tại trong product data
                quantity: quantity,
                // Thêm các trường khác nếu cần thiết cho trang giỏ hàng, ví dụ:
                categoryName: product.category?.name,
                brandName: product.brand?.name,
                // color: selectedColor, // Nếu có chọn màu/size
                // size: selectedSize,
             };
             cartItems.push(newItem);
             console.log(`Product ${product.id} added to cart.`);
        }

        // 4. Save the updated cart items to local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // 5. Display success message
        message.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);

        // 6. *** QUAN TRỌNG: Dispatch sự kiện 'storage' để Header cập nhật ***
        window.dispatchEvent(new Event('storage'));
    };


    const formatPrice = value => `${Number(value).toLocaleString('vi-VN')} VNĐ`;

    if (loading) {
        return (
            <Layout>
                <Content style={{ padding: '50px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
                </Content>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout>
                <Content style={{ padding: '50px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <Title level={3}>Không tìm thấy sản phẩm</Title>
                    <Button type="primary">
                        <Link to="/product">Quay lại trang sản phẩm</Link>
                    </Button>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1200, margin: '0 auto' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/product">Sản phẩm</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            <img
                                src={product.imageProduct ? `http://localhost:8082/images/product/${product.imageProduct}` : 'https://placehold.co/400x400?text=No+Image'}
                                alt={product.name}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', border: '1px solid #f0f0f0' }}
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400?text=Error" }}
                            />
                        </Col>

                        <Col xs={24} md={12}>
                            <div className="product-info">
                                <Title level={2}>{product.name}</Title>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={3} style={{ color: '#ff4d4f', margin: '0', display: 'inline-block' }}>
                                        {formatPrice(product.price)}
                                    </Title>
                                </div>

                                <Divider />

                                <div style={{ marginBottom: 16 }}>
                                    <Title level={5}>Mô tả:</Title>
                                    <Paragraph>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</Paragraph>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={5} style={{ display: 'inline-block', marginRight: 10 }}>Số lượng:</Title>
                                    <InputNumber
                                        min={1}
                                        max={product.stock_quantity || 10}
                                        defaultValue={1}
                                        value={quantity}
                                        onChange={value => setQuantity(value || 1)}
                                        disabled={!product.isActive || product.stock_quantity === 0}
                                    />
                                     {product.stock_quantity !== undefined && (
                                        <Text type="secondary" style={{ marginLeft: 10 }}>
                                            ({product.stock_quantity} sản phẩm có sẵn)
                                        </Text>
                                    )}
                                    {!product.isActive && <Tag color="error" style={{ marginLeft: 10 }}>Hết hàng</Tag>}
                                </div>

                                <Space wrap size="large">
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        size="large"
                                        onClick={handleAddToCart}
                                        disabled={!product.isActive || product.stock_quantity === 0}
                                    >
                                        Thêm vào giỏ
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleBuyNow}
                                        disabled={!product.isActive || product.stock_quantity === 0}
                                        style={{ 
                                            backgroundColor: '#ff4d4f', 
                                            borderColor: '#ff4d4f',
                                            fontWeight: 'bold'
                                        }}
                                        icon={<ThunderboltOutlined />}
                                    >
                                        Mua ngay
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 48 }}>
                        <Title level={3}>Chi tiết sản phẩm</Title>
                        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
                            <Descriptions.Item label="Tên sản phẩm" span={3}>{product.name}</Descriptions.Item>
                            <Descriptions.Item label="Giá">{formatPrice(product.price)}</Descriptions.Item>
                            <Descriptions.Item label="Thương hiệu">{product.brand?.name || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Danh mục">{product.category?.name || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="SKU">{product.sku || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Tình trạng">
                                {product.isActive && product.stock_quantity > 0
                                    ? <Tag color="success">Còn hàng ({product.stock_quantity})</Tag>
                                    : <Tag color="error">Hết hàng</Tag>
                                }
                            </Descriptions.Item>
                             <Descriptions.Item label="Mô tả chi tiết" span={3}>
                                {product.longDescription || product.description || 'Không có mô tả chi tiết.'}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default ProductDetailPage;
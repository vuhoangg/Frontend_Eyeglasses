// ProductDetailPage.jsx (Chỉ phần hàm handleAddToCart cần sửa)
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
    ShareAltOutlined
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { fetchProductByIdAPI } from '../../services/api.product';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const ProductDetailPage = () => {
    const { id: productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);


    useEffect(() => {
        // ... (useEffect hiện tại không thay đổi) ...
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

    // --- HÀM handleAddToCart ĐÃ ĐƯỢC CẬP NHẬT ---
    const handleAddToCart = () => {
        // Đảm bảo product đã được load và có id
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
    // --- KẾT THÚC HÀM handleAddToCart ĐÃ CẬP NHẬT ---


    const formatPrice = value => `${Number(value).toLocaleString('vi-VN')} VNĐ`;

    if (loading) {
        // ... (loading state không đổi) ...
        return (
            <Layout>
                <Content style={{ padding: '50px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
                </Content>
            </Layout>
        );
    }

    if (!product) {
        // ... (not found state không đổi) ...
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
                {/* ... (Breadcrumb không đổi) ... */}
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/product">Sản phẩm</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Row gutter={[32, 32]}>
                        {/* Product Images */}
                        <Col xs={24} md={12}>
                            <img
                                // src={`http://localhost:8082/images/product/${product.imageProduct}`}
                                // ---- Sửa lại URL nếu cần hoặc dùng biến môi trường ----
                                src={product.imageProduct ? `http://localhost:8082/images/product/${product.imageProduct}` : 'https://placehold.co/400x400?text=No+Image'}
                                alt={product.name}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', border: '1px solid #f0f0f0' }} // Thêm border nhẹ
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400?text=Error" }} // Xử lý lỗi ảnh
                            />
                        </Col>

                        {/* Product Info */}
                        <Col xs={24} md={12}>
                            <div className="product-info">
                                <Title level={2}>{product.name}</Title>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={3} style={{ color: '#ff4d4f', margin: '0', display: 'inline-block' }}>
                                        {formatPrice(product.price)}
                                    </Title>
                                    {/* Có thể thêm giá gốc nếu có giảm giá */}
                                    {/* {product.originalPrice && product.originalPrice > product.price && (
                                        <Text delete type="secondary" style={{ marginLeft: 10 }}>
                                            {formatPrice(product.originalPrice)}
                                        </Text>
                                    )} */}
                                </div>

                                {/* Có thể thêm Rating */}
                                {/* <div style={{ marginBottom: 16 }}>
                                    <Rate disabled allowHalf defaultValue={product.rating || 0} />
                                    <Text type="secondary" style={{ marginLeft: 8 }}>({product.reviewsCount || 0} đánh giá)</Text>
                                </div> */}

                                <Divider />

                                <div style={{ marginBottom: 16 }}>
                                    <Title level={5}>Mô tả:</Title>
                                    {/* Sử dụng dangerouslySetInnerHTML nếu mô tả là HTML, nếu không thì dùng Paragraph */}
                                    <Paragraph>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</Paragraph>
                                    {/* <div dangerouslySetInnerHTML={{ __html: product.description || '<p>Chưa có mô tả.</p>' }} /> */}
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={5} style={{ display: 'inline-block', marginRight: 10 }}>Số lượng:</Title>
                                    <InputNumber
                                        min={1}
                                        max={product.stock_quantity || 10} // Giới hạn max bằng tồn kho (hoặc giá trị mặc định nếu stock_quantity không có)
                                        defaultValue={1}
                                        value={quantity}
                                        onChange={value => setQuantity(value || 1)} // Đảm bảo value không null/undefined, nếu có thì về 1
                                        disabled={!product.isActive || product.stock_quantity === 0} // Disable nếu hết hàng
                                    />
                                     {product.stock_quantity !== undefined && ( // Chỉ hiển thị nếu có thông tin tồn kho
                                        <Text type="secondary" style={{ marginLeft: 10 }}>
                                            ({product.stock_quantity} sản phẩm có sẵn)
                                        </Text>
                                    )}
                                    {!product.isActive && <Tag color="error" style={{ marginLeft: 10 }}>Hết hàng</Tag>}
                                </div>

                                {/* --- THÊM THUỘC TÍNH (Ví dụ Màu/Size) nếu có --- */}
                                {/*
                                <div style={{ marginBottom: 24 }}>
                                    <Title level={5}>Màu sắc:</Title>
                                    <Radio.Group onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
                                        <Radio.Button value="Đen">Đen</Radio.Button>
                                        <Radio.Button value="Trắng">Trắng</Radio.Button>
                                        <Radio.Button value="Xám">Xám</Radio.Button>
                                    </Radio.Group>
                                </div>
                                */}

                                <Space wrap size="large"> {/* Tăng size để nút cách xa nhau hơn */}
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        size="large"
                                        onClick={handleAddToCart} // Gọi hàm đã cập nhật
                                        disabled={!product.isActive || product.stock_quantity === 0} // Disable nếu hết hàng
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                    <Button
                                        type="default" // Thay đổi thành default hoặc ghost
                                        icon={<HeartOutlined />}
                                        size="large"
                                        // onClick={handleAddToWishlist} // Thêm hàm xử lý yêu thích nếu có
                                    >
                                        Yêu thích
                                    </Button>
                                    {/* Nút chia sẻ có thể không cần thiết */}
                                    {/* <Button
                                        icon={<ShareAltOutlined />}
                                        size="large"
                                        // onClick={handleShare} // Thêm hàm xử lý chia sẻ nếu có
                                    >
                                        Chia sẻ
                                    </Button> */}
                                </Space>
                            </div>
                        </Col>
                    </Row>

                    {/* Product Details */}
                    <div style={{ marginTop: 48 }}>
                        <Title level={3}>Chi tiết sản phẩm</Title>
                        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}> {/* Responsive columns */}
                            <Descriptions.Item label="Tên sản phẩm" span={3}>{product.name}</Descriptions.Item> {/* Span 3 cho tên dài */}
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
                             {/* Có thể thêm các chi tiết khác như chất liệu, xuất xứ,... nếu có trong data */}
                            {/* <Descriptions.Item label="Chất liệu">{product.material || 'N/A'}</Descriptions.Item> */}
                            {/* <Descriptions.Item label="Xuất xứ">{product.origin || 'N/A'}</Descriptions.Item> */}

                             <Descriptions.Item label="Mô tả chi tiết" span={3}>
                                {/* Có thể hiển thị lại mô tả hoặc mô tả chi tiết hơn nếu có */}
                                {product.longDescription || product.description || 'Không có mô tả chi tiết.'}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    {/* Có thể thêm phần đánh giá sản phẩm ở đây */}
                    {/* <div style={{ marginTop: 48 }}>
                        <Title level={3}>Đánh giá sản phẩm</Title>
                        // Component Review...
                    </div> */}
                </div>
            </Content>
        </Layout>
    );
};

export default ProductDetailPage;
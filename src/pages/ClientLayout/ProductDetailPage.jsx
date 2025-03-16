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
    Tabs,
    Carousel,
    message,
    Descriptions,
    Radio,
    List,
    Avatar,
    Spin,
    Tooltip,
    Breadcrumb
} from 'antd';
import {
    ShoppingCartOutlined,
    HeartOutlined,
    ShareAltOutlined,
    CheckCircleFilled,
    QuestionCircleOutlined,
    PhoneOutlined,
    GiftOutlined,
    SafetyCertificateOutlined,
    SwapOutlined,
    RightOutlined,
    LeftOutlined,
    EnvironmentOutlined,
    MailOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
    LinkedinOutlined,
    FacebookOutlined,
    InstagramOutlined,
    EyeOutlined,
    VerifiedOutlined,
    CustomerServiceOutlined,
    TeamOutlined,
    ShopOutlined,
    StarFilled
} from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card; // Import Meta from Card

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedLensType, setSelectedLensType] = useState('standard');
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Fetch product data
    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // In a real app, this would be an API call using productId
                // Mock data based on the provided URL example
                const mockProduct = {
                    id: productId,
                    name: 'Gọng Kính Kim Loại Lily 89013KOR',
                    code: 'KL89013KOR',
                    price: 1200000,
                    oldPrice: 1500000,
                    discount: 20,
                    rating: 4.8,
                    reviews: 42,
                    inStock: true,
                    isBestseller: true,
                    brandId: 1,
                    brandName: 'LilyAnna',
                    categoryId: 2,
                    categoryName: 'Gọng kính kim loại',
                    description: 'Gọng kính kim loại Lily 89013KOR với thiết kế thời trang, sang trọng. Sản phẩm được làm từ chất liệu kim loại cao cấp, bền đẹp, trọng lượng nhẹ, cho cảm giác thoải mái khi đeo.',
                    features: [
                        'Chất liệu: Kim loại cao cấp',
                        'Kiểu dáng: Oval',
                        'Màu sắc: Vàng hồng (KOR)',
                        'Kích thước: 52□18-148',
                        'Trọng lượng: 25g',
                        'Xuất xứ: Hàn Quốc'
                    ],
                    colors: ['KOR', 'BLK', 'GLD'],
                    sizes: ['S', 'M', 'L'],
                    stock: {
                        'KOR': {
                            'S': 10,
                            'M': 15,
                            'L': 5
                        },
                        'BLK': {
                            'S': 8,
                            'M': 12,
                            'L': 0
                        },
                        'GLD': {
                            'S': 6,
                            'M': 10,
                            'L': 3
                        }
                    },
                    images: [
                        'https://kinhmatlily.com/uploads/images/products/gong-kinh-lily-89013kor-hong-1_20230309165141.jpg',
                        'https://kinhmatlily.com/uploads/images/products/gong-kinh-lily-89013kor-hong-2_20230309165141.jpg',
                        'https://kinhmatlily.com/uploads/images/products/gong-kinh-lily-89013kor-hong-3_20230309165141.jpg',
                        'https://kinhmatlily.com/uploads/images/products/gong-kinh-lily-89013kor-hong-4_20230309165141.jpg'
                    ],
                    lensOptions: [
                        { id: 'standard', name: 'Tròng kính thường', price: 0 },
                        { id: 'blue-light', name: 'Tròng kính chống ánh sáng xanh', price: 300000 },
                        { id: 'photochromic', name: 'Tròng kính đổi màu', price: 500000 },
                        { id: 'polarized', name: 'Tròng kính phân cực', price: 700000 }
                    ],
                    warranty: '12 tháng cho gọng kính, 6 tháng cho tròng kính',
                    shippingInfo: 'Miễn phí giao hàng cho đơn hàng từ 500.000đ',
                    returnPolicy: 'Đổi trả miễn phí trong vòng 30 ngày',
                    specifications: {
                        'Mã sản phẩm': 'KL89013KOR',
                        'Thương hiệu': 'LilyAnna',
                        'Loại gọng': 'Gọng kính kim loại',
                        'Kích thước': '52□18-148',
                        'Màu sắc': 'Vàng hồng (KOR)',
                        'Chất liệu gọng': 'Kim loại cao cấp',
                        'Hình dáng gọng': 'Oval',
                        'Trọng lượng': '25g',
                        'Xuất xứ': 'Hàn Quốc',
                        'Bảo hành': '12 tháng'
                    }
                };

                // Mock related products
                const mockRelatedProducts = [];
                for (let i = 1; i <= 6; i++) {
                    mockRelatedProducts.push({
                        id: 100 + i,
                        name: `Gọng Kính Kim Loại Lily ${88000 + i}${i % 2 === 0 ? 'BLK' : 'GLD'}`,
                        price: 950000 + (i * 50000),
                        oldPrice: i % 2 === 0 ? 1200000 + (i * 50000) : null,
                        discount: i % 2 === 0 ? 15 : 0,
                        image: `https://via.placeholder.com/300x200?text=Related+${i}`,
                        rating: 4 + (i % 10) / 10,
                        reviews: 10 + i
                    });
                }

                setProduct(mockProduct);
                setRelatedProducts(mockRelatedProducts);
            } catch (error) {
                message.error("Failed to load product details.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        if (product) {
            setSelectedColor(product.colors[0]);
            setSelectedSize('M');
        }
    }, [productId, product]);

    const handleAddToCart = () => {
        message.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    };

    const handleBuyNow = () => {
        message.info('Chuyển đến trang thanh toán...');
    };

    const calculateTotalPrice = () => {
        if (!product) return 0;
        const lensOption = product.lensOptions.find(option => option.id === selectedLensType);
        const lensPrice = lensOption ? lensOption.price : 0;
        return (product.price + lensPrice) * quantity;
    };

    const formatPrice = value => `${value.toLocaleString('vi-VN')}đ`;

    const isCurrentSizeAvailable = () => {
        if (!product || !selectedColor || !selectedSize) return false;
        return product.stock[selectedColor][selectedSize] > 0;
    };

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
                        <Link to="/products">Quay lại trang sản phẩm</Link>
                    </Button>
                </Content>
            </Layout>
        );
    }

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
                                    title: <Link to={`/category/${product.categoryId}`}>{product.categoryName}</Link>
                                },
                                {
                                    title: product.name,
                                },
                            ]}
                />

                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Row gutter={[32, 32]}>
                        {/* Product Images */}
                        <Col xs={24} md={12}>
                            <Badge.Ribbon
                                text={product.discount > 0 ? `${product.discount}% GIẢM` : product.isBestseller ? 'BÁN CHẠY' : ''}
                                color={product.discount > 0 ? 'red' : 'green'}
                                style={{ display: (product.discount > 0 || product.isBestseller) ? 'block' : 'none' }}
                            >
                                <div className="product-gallery">
                                    <Carousel
                                        autoplay
                                        arrows
                                        prevArrow={<Button icon={<LeftOutlined />} />}
                                        nextArrow={<Button icon={<RightOutlined />} />}
                                    >
                                        {product.images.map((image, index) => (
                                            <div key={index}>
                                                <img
                                                    src={image}
                                                    alt={`${product.name} - Hình ${index + 1}`}
                                                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>

                                    <div style={{ marginTop: 16, display: 'flex', gap: 8, overflow: 'auto' }}>
                                        {product.images.map((image, index) => (
                                            <div key={index} style={{ cursor: 'pointer', border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
                                                <img
                                                    src={image}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    style={{ width: 80, height: 60, objectFit: 'cover' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Badge.Ribbon>
                        </Col>

                        {/* Product Info */}
                        <Col xs={24} md={12}>
                            <div className="product-info">
                                <Title level={2}>{product.name}</Title>
                                <div style={{ marginBottom: 16 }}>
                                    <Text type="secondary">Mã sản phẩm: {product.code}</Text>
                                </div>

                                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                                    <Rate disabled defaultValue={product.rating} allowHalf style={{ fontSize: 16 }} />
                                    <Text style={{ marginLeft: 8 }}>{product.rating}/5 ({product.reviews} đánh giá)</Text>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    {product.oldPrice && (
                                        <Text delete type="secondary" style={{ fontSize: 16 }}>
                                            {formatPrice(product.oldPrice)}
                                        </Text>
                                    )}
                                    <Title level={3} style={{ color: '#ff4d4f', margin: product.oldPrice ? '0 0 0 12px' : 0, display: 'inline-block' }}>
                                        {formatPrice(product.price)}
                                    </Title>
                                    {product.discount > 0 && (
                                        <Tag color="red" style={{ marginLeft: 12 }}>Giảm {product.discount}%</Tag>
                                    )}
                                </div>

                                <Divider />

                                <div style={{ marginBottom: 16 }}>
                                    <Title level={5}>Mô tả:</Title>
                                    <Paragraph>{product.description}</Paragraph>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <Title level={5}>Đặc điểm:</Title>
                                    <ul style={{ paddingLeft: 20 }}>
                                        {product.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <Title level={5}>Màu sắc:</Title>
                                    <Radio.Group
                                        value={selectedColor}
                                        onChange={e => setSelectedColor(e.target.value)}
                                        style={{ marginBottom: 8 }}
                                    >
                                        {product.colors.map((color) => (
                                            <Radio.Button key={color} value={color}>
                                                {color}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                </div>

                                 <div style={{ marginBottom: 16 }}>
                                    <Title level={5}>Kích thước:</Title>
                                     <Radio.Group
                                        value={selectedSize}
                                        onChange={e => setSelectedSize(e.target.value)}
                                        style={{ marginBottom: 8 }}
                                     >
                                     {product.sizes.map((size) => (
                                        <Radio.Button
                                            key={size}
                                            value={size}
                                            disabled={
                                                !product.stock ||
                                                !product.stock[selectedColor] ||
                                                !product.stock[selectedColor][size] ||
                                                product.stock[selectedColor][size] <= 0
                                                }
                                            >
                                                {size} (
                                                {product.stock &&
                                                product.stock[selectedColor] &&
                                                product.stock[selectedColor][size]
                                                    ? product.stock[selectedColor][size]
                                                    : 0}
                                                 còn lại)
                                        </Radio.Button>
                                     ))}
                                    </Radio.Group>
                                     {!isCurrentSizeAvailable() && (
                                        <Text type="danger">Kích thước này tạm hết hàng</Text>
                                      )}
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={5}>Tròng kính:</Title>
                                    <Radio.Group
                                        onChange={e => setSelectedLensType(e.target.value)}
                                        value={selectedLensType}
                                    >
                                        <Space direction="vertical">
                                            {product.lensOptions.map(lens => (
                                                <Radio key={lens.id} value={lens.id}>
                                                    {lens.name} (+{formatPrice(lens.price)})
                                                </Radio>
                                            ))}
                                        </Space>
                                    </Radio.Group>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={5}>Số lượng:</Title>
                                    <InputNumber
                                        min={1}
                                        max={10}
                                        defaultValue={1}
                                        value={quantity}
                                        onChange={value => setQuantity(value)}
                                    />
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={4}>Tổng cộng: {formatPrice(calculateTotalPrice())}</Title>
                                </div>

                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        size="large"
                                        onClick={handleAddToCart}
                                        disabled={!isCurrentSizeAvailable()}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                    <Button
                                        type="ghost"
                                        icon={<HeartOutlined />}
                                        size="large"
                                    >
                                        Yêu thích
                                    </Button>
                                    <Button
                                        icon={<ShareAltOutlined />}
                                        size="large"
                                    >
                                        Chia sẻ
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>

                    {/* Product Tabs */}
                    <div style={{ marginTop: 48 }}>
                        <Tabs defaultActiveKey="1" items={[
                            {
                                label: "Mô tả sản phẩm",
                                key: "1",
                                children: (
                                    <Descriptions title="Thông tin sản phẩm" bordered>
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>
                                        ))}
                                    </Descriptions>
                                ),
                            },
                            {
                                label: "Đánh giá (42)",
                                key: "2",
                                children: (
                                    <List
                                        className="comment-list"
                                        header={`${product.reviews} Bình luận`}
                                        itemLayout="horizontal"
                                        dataSource={[
                                            {
                                                author: 'Nguyễn Văn A',
                                                avatar: 'https://joeschmoe.io/api/v1/random',
                                                content: (
                                                    <p>
                                                        Kính đẹp, chất lượng tốt, đáng mua.
                                                    </p>
                                                ),
                                            },
                                            {
                                                author: 'Trần Thị B',
                                                avatar: 'https://joeschmoe.io/api/v1/random',
                                                content: (
                                                    <p>
                                                        Giao hàng nhanh, đóng gói cẩn thận.
                                                    </p>
                                                ),
                                            },
                                        ]}
                                        renderItem={(item) => (
                                            <li>
                                                <Comment
                                                    author={item.author}
                                                    avatar={<Avatar src={item.avatar} alt={item.author} />}
                                                    content={item.content}
                                                />
                                            </li>
                                        )}
                                    />
                                ),
                            },
                            {
                                label: "Vận chuyển & Đổi trả",
                                key: "3",
                                children: (
                                    <Space direction="vertical">
                                        <Space align="center">
                                            <CheckCircleFilled style={{ color: 'green' }} />
                                            <Text strong>Cam kết chính hãng 100%</Text>
                                        </Space>
                                        <Space align="center">
                                            <PhoneOutlined />
                                            <Text strong>Hỗ trợ 24/7</Text>
                                        </Space>
                                        <Space align="center">
                                            <GiftOutlined />
                                            <Text strong>Quà tặng hấp dẫn</Text>
                                        </Space>
                                        <Space align="center">
                                            <SafetyCertificateOutlined />
                                            <Text strong>Bảo hành uy tín</Text>
                                        </Space>
                                        <Space align="center">
                                            <SwapOutlined />
                                            <Text strong>Đổi trả dễ dàng</Text>
                                        </Space>
                                        <Paragraph>
                                            {product.shippingInfo}
                                        </Paragraph>
                                        <Paragraph>
                                            {product.returnPolicy}
                                        </Paragraph>
                                    </Space>
                                ),
                            },
                        ]}
                        />
                    </div>

                    {/* Related Products */}
                    <div style={{ marginTop: 48 }}>
                        <Title level={3}>Sản phẩm liên quan</Title>
                        <Row gutter={[16, 16]}>
                            {relatedProducts.map(relatedProduct => (
                                <Col xs={24} sm={12} md={8} lg={6} key={relatedProduct.id}>
                                    <Card
                                        hoverable
                                        cover={
                                            <img
                                                alt={relatedProduct.name}
                                                src={relatedProduct.image}
                                                style={{ height: 200, objectFit: 'cover' }}
                                            />
                                        }
                                    >
                                        <Meta
                                            title={<Link to={`/product/${relatedProduct.id}`}>{relatedProduct.name}</Link>}
                                            description={
                                                <Space direction="vertical" size="small">
                                                    <Space>
                                                        {relatedProduct.oldPrice && (
                                                            <Text delete type="secondary">
                                                                {formatPrice(relatedProduct.oldPrice)}
                                                            </Text>
                                                        )}
                                                        <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>
                                                            {formatPrice(relatedProduct.price)}
                                                        </Text>
                                                    </Space>
                                                    <Space>
                                                        <Rate disabled defaultValue={relatedProduct.rating} allowHalf style={{ fontSize: 12 }} />
                                                        <Text type="secondary">({relatedProduct.reviews})</Text>
                                                    </Space>
                                                </Space>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default ProductDetailPage;
// HomePage.jsx
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Carousel,
    Card,
    Row,
    Col,
    Button,
    Typography,
    Divider,
    Space,
    Badge,
    Input,
    Form,
    Avatar,
    List,
    message,
    Spin
} from 'antd';
import {
    ShoppingOutlined,
    HeartOutlined,
    StarFilled,
    RightOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    InstagramOutlined,
    FacebookOutlined,
    TwitterOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllProductAPI, fetchLatestProductsAPI, fetchBestSellingProductsAPI } from '../../services/api.product'; // Import API functions
import { createCartItemAPI, updateCartItemAPI } from '../../services/api.cartItems'; // Import cart item APIs

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Content } = Layout;

const HomePage = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingBestSellers, setLoadingBestSellers] = useState(true);
    const [loadingNewArrivals, setLoadingNewArrivals] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoriesData = async () => {
            setLoadingCategories(true);
            try {
                const categoriesResponse = await fetchAllProductAPI(1, 100);
                if (categoriesResponse && categoriesResponse.data && categoriesResponse.data.data) {
                    const uniqueCategories = Array.from(new Set(categoriesResponse.data.data.map(p => JSON.stringify(p.category))))
                        .map(JSON.parse)
                        .filter(cat => cat && cat.id && cat.name);
                    setCategories(uniqueCategories);
                } else {
                    console.error("Failed to fetch categories or invalid data structure:", categoriesResponse);
                    message.error("Lỗi khi tải danh mục sản phẩm.");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                message.error("Lỗi khi tải danh mục sản phẩm.");
            } finally {
                setLoadingCategories(false);
            }
        };

        const fetchBestSellerProducts = async () => {
            setLoadingBestSellers(true);
            try {
                const response = await fetchBestSellingProductsAPI();
                if (response && response.data && response.data) {
                    setBestSellers(response.data);
                } else {
                    console.error("Failed to fetch best selling products or invalid data structure:", response);
                    message.error("Lỗi khi tải sản phẩm bán chạy.");
                }
            } catch (error) {
                console.error("Error fetching best selling products:", error);
                message.error("Lỗi khi tải sản phẩm bán chạy.");
            } finally {
                setLoadingBestSellers(false);
            }
        };

        const fetchLatestProducts = async () => {
            setLoadingNewArrivals(true);
            try {
                const response = await fetchLatestProductsAPI();
                if (response && response.data && response.data) {
                    setNewArrivals(response.data);
                } else {
                    console.error("Failed to fetch latest products or invalid data structure:", response);
                    message.error("Lỗi khi tải sản phẩm mới.");
                }
            } catch (error) {
                console.error("Error fetching latest products:", error);
                message.error("Lỗi khi tải sản phẩm mới.");
            } finally {
                setLoadingNewArrivals(false);
            }
        };

        fetchCategoriesData();
        fetchBestSellerProducts();
        fetchLatestProducts();
    }, []);

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true
    };

    const handleAddToCartFromCard = (productToAdd, event) => {
        if (event) {
            event.stopPropagation();
        }

        if (!productToAdd || !productToAdd.id) {
            message.error("Sản phẩm không hợp lệ.");
            return;
        }

        const quantityToAdd = 1;

        console.log(`Adding product ${productToAdd.id} (${productToAdd.name}) to cart from HomePage.`);

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

        const existingItemIndex = cartItems.findIndex(item => item.id === productToAdd.id);

        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += quantityToAdd;
            console.log(`Product ${productToAdd.id} exists, new quantity: ${cartItems[existingItemIndex].quantity}`);
        } else {
            const newItem = {
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                imageProduct: productToAdd.imageProduct,
                quantity: quantityToAdd,
                categoryName: productToAdd.category?.name,
                brandName: productToAdd.brand?.name,
            };
            cartItems.push(newItem);
            console.log(`Product ${productToAdd.id} added to cart.`);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        message.success(`Đã thêm ${productToAdd.name} vào giỏ hàng!`);
        window.dispatchEvent(new Event('storage'));
    };

    // --- HÀM MUA NGAY TỪ CARD ---
    const handleBuyNowFromCard = async (productToAdd, event) => {
        if (event) {
            event.stopPropagation();
        }

        if (!productToAdd || !productToAdd.id) {
            message.error("Sản phẩm không hợp lệ.");
            return;
        }

        const quantityToBuy = 1; // Mua ngay từ card mặc định số lượng là 1

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
        const existingItemIndex = cartItems.findIndex(item => item.id === productToAdd.id);
        let updatedCartItems = [...cartItems];

        if (existingItemIndex > -1) {
            // 3a. If the item exists, update the quantity
            updatedCartItems[existingItemIndex].quantity += quantityToBuy;
        } else {
            // 3b. If the item doesn't exist, add it
            const newItem = {
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                imageProduct: productToAdd.imageProduct,
                quantity: quantityToBuy,
                categoryName: productToAdd.category?.name,
                brandName: productToAdd.brand?.name,
            };
            updatedCartItems.push(newItem);
        }

        // 4. Save the updated cart items to local storage
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        window.dispatchEvent(new Event('storage'));

        // 5. Đồng bộ giỏ hàng với DB nếu user đã đăng nhập (tương tự ProductDetailPage)
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData?.id;

        if (userId) {
            message.loading("Đang xử lý...", 0);
            try {
                const itemInCart = updatedCartItems.find(item => item.id === productToAdd.id);
                if (itemInCart) {
                    const cartItemData = {
                        productId: itemInCart.id,
                        quantity: itemInCart.quantity,
                        price: itemInCart.price,
                    };
                    // Logic đồng bộ DB tương tự ProductDetailPage (createCartItemAPI, updateCartItemAPI)
                    if (existingItemIndex > -1 && cartItems[existingItemIndex].cart_item_id) {
                        await updateCartItemAPI(cartItems[existingItemIndex].cart_item_id, itemInCart.quantity);
                    } else {
                        await createCartItemAPI(cartItemData.productId, cartItemData.quantity, cartItemData.price);
                    }
                }
                message.destroy();
                message.success(`Đã thêm ${quantityToBuy} ${productToAdd.name} vào giỏ hàng và đồng bộ!`);
                navigate('/checkout');

            } catch (error) {
                message.destroy();
                console.error("Lỗi khi đồng bộ giỏ hàng với DB:", error);
                message.error("Lỗi khi đồng bộ giỏ hàng. Vui lòng thử lại sau.");
            }
        } else {
            message.success(`Đã thêm ${quantityToBuy} ${productToAdd.name} vào giỏ hàng!`);
            navigate('/checkout');
        }
    };
    // --- KẾT THÚC HÀM handleBuyNowFromCard ---


    const ProductCard = ({ product, onAddToCart, onBuyNow }) => (
        <Badge.Ribbon
            text={product.discount > 0 ? `${product.discount}% GIẢM` : ''}
            color={product.discount > 0 ? 'red' : 'green'}
            style={{ display: product.discount > 0 ? 'block' : 'none' }}
        >
            <Card
                hoverable
                onClick={() => navigate(`/product/${product.id}`)}
                cover={
                    <div style={{ position: 'relative', paddingTop: '100%' }}>
                        <img
                            alt={product.name}
                            src={product.imageProduct ? `http://localhost:8082/images/product/${product.imageProduct}` : 'https://placehold.co/300x300?text=No+Image'}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300?text=Error" }}
                        />
                         {!product.isActive && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(255,255,255,0.7)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1
                            }}>
                                <Tag color="error" style={{ fontSize: 14, padding: '5px 10px' }}>Hết hàng</Tag>
                            </div>
                        )}
                    </div>
                }
                actions={[
                    <Button type="link" icon={<ShoppingOutlined />} disabled={!product.isActive} onClick={(event) => onAddToCart(product, event)}>Thêm vào giỏ</Button>,
                    <Button type="link" icon={<HeartOutlined />} onClick={(event) => onBuyNow(product, event)} disabled={!product.isActive || product.stock_quantity === 0}>Mua ngay</Button>
                ]}
            >
                <Meta
                    title={<Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()}>{product.name || "Sản phẩm chưa có tên"}</Link>}
                    description={
                        <Space direction="vertical" size="small">
                            <Space align="baseline">
                                <Text strong style={{ color: '#f5222d', fontSize: 16 }}>{Number(product.price || 0).toLocaleString('vi-VN')}đ</Text>
                                {product.discount > 0 && product.originalPrice && (
                                    <Text delete type="secondary">{Number(product.originalPrice).toLocaleString('vi-VN')}đ</Text>
                                )}
                            </Space>
                            <div>
                                <StarFilled style={{ color: '#fadb14' }} />
                                <Text type="secondary">({product.rating || 0}/5)</Text>
                            </div>
                        </Space>
                    }
                />
            </Card>
        </Badge.Ribbon>
    );

    const CategoryCard = ({ category }) => (
        <Card
            hoverable
            onClick={() => navigate(`/product?category=${category.id}`)} // Navigate to ProductPage with category filter
            // cover={<img alt={category.name} src={'https://placehold.co/200x200'} />} // Replace placeholder with actual category image if available
            bodyStyle={{ padding: '12px', textAlign: 'center' }}
        >
            <Text strong>{category.name}</Text>
            <br />
            <Text type="secondary">{category.productCount || 'N/A'} sản phẩm</Text> {/* Assuming category object has productCount */}
        </Card>
    );


    const bannerStyle = {
        height: '500px',
        color: '#fff',
        lineHeight: '500px',
        textAlign: 'center',
        background: '#364d79',
        position: 'relative'
    };

    const bannerContent = {
        position: 'absolute',
        bottom: '50px',
        left: '50px',
        textAlign: 'left',
        lineHeight: 'normal'
    };

    const banners = [
        {
            title: 'BST Kính Mắt Mới Nhất',
            subtitle: 'Tự tin tỏa sáng với phong cách của riêng bạn',
            image: 'src/resources/imagelayout/banner1.webp'
        },
        {
            title: 'Giảm Giá Lên Đến 30%',
            subtitle: 'Cho tất cả sản phẩm kính mắt thời trang',
            image: 'src/resources/imagelayout/banner2.jpg'
        },
        {
            title: 'Chương Trình Khám Mắt Miễn Phí',
            subtitle: 'Khi mua kính tại LilyAnna',
            image: 'src/resources/imagelayout/banner3.1.jpeg'
        }
    ];

    const testimonials = [
        {
            avatar: 'https://via.placeholder.com/50x50',
            name: 'Nguyễn Thị Hương',
            content: 'Tôi rất hài lòng với chất lượng kính mắt tại LilyAnna. Nhân viên tư vấn nhiệt tình, sản phẩm đa dạng và giá cả hợp lý.',
            rating: 5
        },
        {
            avatar: 'https://via.placeholder.com/50x50',
            name: 'Trần Văn Nam',
            content: 'Đây là lần thứ 3 tôi mua kính ở LilyAnna và vẫn luôn tin tưởng vào chất lượng sản phẩm. Dịch vụ khám mắt và tư vấn rất chuyên nghiệp.',
            rating: 5
        },
        {
            avatar: 'https://via.placeholder.com/50x50',
            name: 'Phạm Minh Tâm',
            content: 'Kính đẹp, chắc chắn, giá cả phải chăng. Tôi sẽ quay lại mua thêm sản phẩm khác.',
            rating: 4
        }
    ];

    return (
        <Layout>
            <Content>
                {/* Hero Banner */}
                <Carousel {...carouselSettings}>
                    {banners.map((banner, index) => (
                        <div key={index}>
                            <div style={{ ...bannerStyle, backgroundImage: `url(${banner.image})`, backgroundSize: 'cover' }}>
                                <div style={bannerContent}>
                                    <Title style={{ color: '#fff', margin: 0 }}>{banner.title}</Title>
                                    <Title level={3} style={{ color: '#fff' }}>{banner.subtitle}</Title>
                                    <Button type="primary" size="large">Khám phá ngay</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>

                {/* Features */}
                <div style={{ padding: '40px 0', background: '#f5f5f5' }}>
                    <Row justify="center" gutter={[32, 32]}>
                        <Col xs={24} sm={8}>
                            <Card bordered={false}>
                                <Space align="center">
                                    <div style={{ fontSize: 36, color: '#1890ff' }}>🚚</div>
                                    <div>
                                        <Text strong style={{ fontSize: 18 }}>Miễn phí vận chuyển</Text>
                                        <br />
                                        <Text type="secondary">Cho đơn hàng từ 500.000đ</Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card bordered={false}>
                                <Space align="center">
                                    <div style={{ fontSize: 36, color: '#1890ff' }}>🔍</div>
                                    <div>
                                        <Text strong style={{ fontSize: 18 }}>Khám mắt miễn phí</Text>
                                        <br />
                                        <Text type="secondary">Với chuyên gia hàng đầu</Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card bordered={false}>
                                <Space align="center">
                                    <div style={{ fontSize: 36, color: '#1890ff' }}>🔄</div>
                                    <div>
                                        <Text strong style={{ fontSize: 18 }}>Đổi trả trong 30 ngày</Text>
                                        <br />
                                        <Text type="secondary">Nếu không hài lòng</Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Categories */}
                <div style={{ padding: '40px 0' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <Title level={2}>DANH MỤC SẢN PHẨM</Title>
                            <Divider style={{ borderTopColor: '#1890ff', width: 80, minWidth: 80, margin: '16px auto' }} />
                            <Text type="secondary">Khám phá các dòng sản phẩm đa dạng của LilyAnna</Text>
                        </div>

                        {loadingCategories ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <Spin tip="Đang tải danh mục..." />
                            </div>
                        ) : (
                            <Row gutter={[24, 24]}>
                                {categories.map((category, index) => (
                                    <Col xs={12} sm={8} md={4} key={index}>
                                        <CategoryCard category={category} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </div>

                {/* Best Sellers */}
                <div style={{ padding: '40px 0', background: '#f5f5f5' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <Title level={2} style={{ margin: 0 }}>SẢN PHẨM BÁN CHẠY</Title>
                                <Divider style={{ borderTopColor: '#1890ff', width: 80, minWidth: 80, margin: '16px 0' }} />
                            </div>
                            <Button type="link" onClick={() => navigate('/product')}>
                                Xem tất cả <RightOutlined />
                            </Button>
                        </div>

                        {loadingBestSellers ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <Spin tip="Đang tải sản phẩm bán chạy..." />
                            </div>
                        ) : (
                            <Row gutter={[24, 24]}>
                                {bestSellers.map(product => (
                                    <Col xs={24} sm={12} md={6} key={product.id}>
                                        <ProductCard product={product} onAddToCart={handleAddToCartFromCard} onBuyNow={handleBuyNowFromCard} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </div>

                {/* Banner */}
                <div style={{
                    padding: '80px 0',
                    backgroundImage: 'url(https://via.placeholder.com/1920x400)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Màu đen trong suốt
                    }}></div>
                    <div style={{
                        maxWidth: 1200,
                        margin: '0 auto',
                        padding: '0 16px',
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        color: '#fff'
                    }}>
                        <Title level={2} style={{ color: '#fff' }}>KHÁM PHÁ BỘ SƯU TẬP MỚI</Title>
                        <Paragraph style={{ fontSize: 18, color: '#fff' }}>
                            Đừng bỏ lỡ cơ hội sở hữu những mẫu kính mắt thời trang và chất lượng nhất từ LilyAnna. Ưu đãi đặc biệt chỉ trong tháng này!
                        </Paragraph>
                        <Button type="primary" size="large" >Xem ngay</Button>
                    </div>
                </div>

                {/* New Arrivals */}
                <div style={{ padding: '40px 0' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <div>
                                <Title level={2} style={{ margin: 0 }}>SẢN PHẨM MỚI</Title>
                                <Divider style={{ borderTopColor: '#1890ff', width: 80, minWidth: 80, margin: '16px 0' }} />
                            </div>
                            <Button type="link" onClick={() => navigate('/product')}>
                                Xem tất cả <RightOutlined />
                            </Button>
                        </div>

                        {loadingNewArrivals ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <Spin tip="Đang tải sản phẩm mới..." />
                            </div>
                        ) : (
                            <Row gutter={[24, 24]}>
                                {newArrivals.map(product => (
                                    <Col xs={24} sm={12} md={6} key={product.id}>
                                        <ProductCard product={product} onAddToCart={handleAddToCartFromCard} onBuyNow={handleBuyNowFromCard} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </div>

                {/* Testimonials */}
                <div style={{ padding: '40px 0', background: '#f5f5f5' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <Title level={2}>KHÁCH HÀNG NÓI VỀ CHÚNG TÔI</Title>
                            <Divider style={{ borderTopColor: '#1890ff', width: 80, minWidth: 80, margin: '16px auto' }} />
                        </div>
                        <Row gutter={[24, 24]}>
                            {testimonials.map((testimonial, index) => (
                                <Col xs={24} sm={12} md={8} key={index}>
                                    <Card>
                                        <Meta
                                            avatar={<Avatar src={testimonial.avatar} />}
                                            title={testimonial.name}
                                            description={
                                                <Space direction="vertical">
                                                    <Paragraph>{testimonial.content}</Paragraph>
                                                    <Space>
                                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                            <StarFilled key={i} style={{ color: '#fadb14' }} />
                                                        ))}
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

                {/* Contact Information */}
                <div style={{ padding: '40px 0' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                        <Row gutter={[24, 24]} justify="space-between">
                            <Col xs={24} sm={12} md={8}>
                                <Title level={3}>LIÊN HỆ VỚI CHÚNG TÔI</Title>
                                <Space direction="vertical">
                                    <Space><PhoneOutlined /> <Text>Hotline: 1900 1234</Text></Space>
                                    <Space><MailOutlined /> <Text>Email: info@lilyanna.vn</Text></Space>
                                    <Space><EnvironmentOutlined /> <Text>Địa chỉ: 123 Đường ABC, Quận XYZ, Thành phố Hà Nội</Text></Space>
                                </Space>
                                <Divider />
                                <Space>
                                    <a href="#" target="_blank" rel="noopener noreferrer"><InstagramOutlined style={{ fontSize: 24 }} /></a>
                                    <a href="#" target="_blank" rel="noopener noreferrer"><FacebookOutlined style={{ fontSize: 24 }} /></a>
                                    <a href="#" target="_blank" rel="noopener noreferrer"><TwitterOutlined style={{ fontSize: 24 }} /></a>
                                </Space>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Title level={3}>GỬI TIN NHẮN CHO CHÚNG TÔI</Title>
                                <Form
                                    name="contact"
                                    layout="vertical"
                                    onFinish={(values) => {
                                        console.log('Success:', values);
                                    }}
                                    onFinishFailed={(errorInfo) => {
                                        console.log('Failed:', errorInfo);
                                    }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Họ và tên"
                                        name="name"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email!' },
                                            { type: 'email', message: 'Email không hợp lệ!' },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Nội dung"
                                        name="message"
                                        rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                                    >
                                        <Input.TextArea rows={4} />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Gửi tin nhắn
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default HomePage;
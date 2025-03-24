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
        console.log("ProductId:", productId);

        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await fetchProductByIdAPI(productId);

                if (response && response.data) {
                    console.log("Product data:", response.data);

                    setProduct(response.data); // Dữ liệu sản phẩm nằm trực tiếp trong response.data
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

    const handleAddToCart = () => {
        message.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
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
                        {/* Product Images */}
                        <Col xs={24} md={12}>
                            <img
                                src={`http://localhost:8082/images/product/${product.imageProduct}`}
                                alt={product.name}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
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
                                </div>

                                <Divider />

                                <div style={{ marginBottom: 16 }}>
                                    <Title level={5}>Mô tả:</Title>
                                    <Paragraph>{product.description}</Paragraph>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={5}>Số lượng:</Title>
                                    <InputNumber
                                        min={1}
                                        max={product.stock_quantity || 10}
                                        defaultValue={1}
                                        value={quantity}
                                        onChange={value => setQuantity(value)}
                                    />
                                </div>

                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        size="large"
                                        onClick={handleAddToCart}
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

                    {/* Product Details */}
                    <div style={{ marginTop: 48 }}>
                        <Title level={3}>Chi tiết sản phẩm</Title>
                        <Descriptions bordered>
                            <Descriptions.Item label="Tên sản phẩm">{product.name}</Descriptions.Item>
                            <Descriptions.Item label="Giá">{formatPrice(product.price)}</Descriptions.Item>
                            <Descriptions.Item label="Mô tả">{product.description}</Descriptions.Item>
                            <Descriptions.Item label="Số lượng còn lại">{product.stock_quantity}</Descriptions.Item>
                            <Descriptions.Item label="Danh mục">{product.category?.name || "Không có"}</Descriptions.Item>
                            <Descriptions.Item label="Thương hiệu">{product.brand?.name || "Không có"}</Descriptions.Item>
                            <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default ProductDetailPage;
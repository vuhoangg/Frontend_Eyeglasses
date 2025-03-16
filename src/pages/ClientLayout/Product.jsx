import React, { useState, useEffect } from 'react';
import {
    Layout,
    Breadcrumb,
    Typography,
    Row,
    Col,
    Card,
    Button,
    Space,
    Divider,
    Pagination,
    Select,
    Checkbox,
    Radio,
    Slider,
    Rate,
    Badge,
    Tag,
    Input,
    message,
    Spin
} from 'antd';
import {
    ShoppingOutlined,
    HeartOutlined,
    FilterOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    StarFilled,
    ReloadOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import qs from 'query-string';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const ProductPage = () => {
    // States for filters
    const [priceRange, setPriceRange] = useState([0, 5000000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('popular');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12; // Number of products per page

    // Mock data
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Categories and Brands (replace with API data in real application)
    const [categories, setCategories] = useState([
        { id: 1, name: 'Gọng kính cận' },
        { id: 2, name: 'Gọng kính kim loại' },
        { id: 3, name: 'Gọng kính nhựa' },
        { id: 4, name: 'Gọng kính titan' },
        { id: 5, name: 'Gọng kính phối' },
        { id: 6, name: 'Gọng kính đạn rỗng' }
    ]);

    const [brands, setBrands] = useState([
        { id: 1, name: 'LilyAnna' },
        { id: 2, name: 'RayBan' },
        { id: 3, name: 'Charmant' },
        { id: 4, name: 'Elle' },
        { id: 5, name: 'Gucci' },
        { id: 6, name: 'Dior' }
    ]);

    // Generate sample products
    useEffect(() => {
        const generateProducts = async () => {
            setLoading(true);  // start loading
            try {

                const sampleProducts = [];
                for (let i = 1; i <= 50; i++) {
                    const categoryId = Math.floor(Math.random() * categories.length) + 1;
                    const brandId = Math.floor(Math.random() * brands.length) + 1;
                    const randomPrice = Math.floor(Math.random() * 3000000) + 500000;
                    const hasDiscount = Math.random() > 0.7;
                    const discountPercent = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
                    const oldPrice = hasDiscount ? Math.floor(randomPrice * (100 / (100 - discountPercent))) : null;

                    sampleProducts.push({
                        id: i,
                        name: `${brands.find(b => b.id === brandId)?.name || "Unknown"} ${categoryId === 1 ? 'Gọng kính cận' : 'Kính mắt'} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 900) + 100}`,
                        price: randomPrice,
                        oldPrice: oldPrice,
                        discount: hasDiscount ? discountPercent : 0,
                        image: `https://via.placeholder.com/300x200?text=Product+${i}`,
                        categoryId: categoryId,
                        brandId: brandId,
                        rating: (Math.random() * 2 + 3).toFixed(1),
                        reviews: Math.floor(Math.random() * 100) + 5,
                        inStock: Math.random() > 0.1,
                        isNew: Math.random() > 0.8,
                        isBestseller: Math.random() > 0.85
                    });
                }

                setProducts(sampleProducts);
                setFilteredProducts(sampleProducts);
            } catch (error) {
                message.error("Failed to load products.");
            } finally {
                setLoading(false);
            }

        };

        generateProducts();
    }, []);  // The empty array ensures this runs only once on mount


    // Apply filters
    useEffect(() => {
        let result = [...products];

        // Filter by category
        if (selectedCategories.length > 0) {
            result = result.filter(product => selectedCategories.includes(product.categoryId));
        }

        // Filter by brand
        if (selectedBrands.length > 0) {
            result = result.filter(product => selectedBrands.includes(product.brandId));
        }

        // Filter by price range
        result = result.filter(
            product => product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Apply sorting
        switch (sortBy) {
            case 'priceLowToHigh':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'priceHighToLow':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
                break;
            case 'popular':
            default:
                result.sort((a, b) => b.reviews - a.reviews);
                break;
        }

        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filters change

    }, [selectedCategories, selectedBrands, priceRange, sortBy, products]);

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setPriceRange([0, 5000000]);
        setSortBy('popular');
        setCurrentPage(1);
    };


    // Change page handler
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const ProductCard = ({ product }) => (
        <Badge.Ribbon
            text={product.discount > 0 ? `${product.discount}% GIẢM` : product.isNew ? 'MỚI' : product.isBestseller ? 'BÁN CHẠY' : ''}
            color={product.discount > 0 ? 'red' : product.isNew ? 'blue' : 'green'}
            style={{ display: (product.discount > 0 || product.isNew || product.isBestseller) ? 'block' : 'none' }}
        >
            <Card
                hoverable
                className={viewType === 'list' ? 'product-card-list' : 'product-card-grid'}
                cover={
                    <div style={{ position: 'relative' }}>
                        <img
                            alt={product.name}
                            src={product.image}
                            style={{ height: viewType === 'list' ? 150 : 200, objectFit: 'cover', width: '100%' }}
                        />
                        {!product.inStock && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Tag color="red" style={{ fontSize: 16, padding: '4px 8px' }}>HẾT HÀNG</Tag>
                            </div>
                        )}
                    </div>
                }
                actions={[
                    <Button
                        type="primary"
                        icon={<ShoppingOutlined />}
                        disabled={!product.inStock}
                    >
                        {viewType === 'list' ? 'Thêm vào giỏ' : ''}
                    </Button>,
                    <Button
                        type="default"
                        icon={<HeartOutlined />}
                    >
                        {viewType === 'list' ? 'Yêu thích' : ''}
                    </Button>
                ]}
            >
                <Meta
                    title={<Link to={`/product/${product.id}`}>{product.name}</Link>}
                    description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Space>
                                {product.oldPrice && <Text delete type="secondary">{product.oldPrice.toLocaleString('vi-VN')}đ</Text>}
                                <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>{product.price.toLocaleString('vi-VN')}đ</Text>
                            </Space>
                            <div>
                                <Rate
                                    disabled
                                    defaultValue={parseFloat(product.rating)}
                                    allowHalf
                                    style={{ fontSize: 14 }}
                                />
                                <Text type="secondary"> ({product.reviews})</Text>
                            </div>
                            <div>
                                <Tag color="blue">{categories.find(c => c.id === product.categoryId)?.name || "Unknown"}</Tag>
                                <Tag color="purple">{brands.find(b => b.id === product.brandId)?.name || "Unknown"}</Tag>
                            </div>
                        </Space>
                    }
                />
            </Card>
        </Badge.Ribbon>
    );


    const formatPrice = value => `${value.toLocaleString('vi-VN')}đ`;

    // Calculate the products to display based on the current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);


    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1200, margin: '0 auto' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>Gọng kính cận</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Title level={2}>Gọng Kính Cận</Title>
                    <Paragraph type="secondary">
                        Khám phá bộ sưu tập gọng kính cận đa dạng phong cách, kiểu dáng và màu sắc.
                        Tất cả các sản phẩm đều được đảm bảo chất lượng và có chế độ bảo hành.
                    </Paragraph>

                    <Row gutter={24}>
                        {/* Sidebar - Filters */}
                        <Col xs={24} sm={24} md={6}>
                            <Card title="Bộ lọc sản phẩm" extra={<Button icon={<ReloadOutlined />} onClick={resetFilters}>Đặt lại</Button>}>
                                <div style={{ marginBottom: 20 }}>
                                    <Title level={5}>Danh mục</Title>
                                    <Checkbox.Group
                                        value={selectedCategories}
                                        onChange={setSelectedCategories}
                                    >
                                        <Space direction="vertical">
                                            {categories.map(category => (
                                                <Checkbox key={category.id} value={category.id}>
                                                    {category.name}
                                                </Checkbox>
                                            ))}
                                        </Space>
                                    </Checkbox.Group>
                                </div>

                                <Divider />

                                <div style={{ marginBottom: 20 }}>
                                    <Title level={5}>Thương hiệu</Title>
                                    <Checkbox.Group
                                        value={selectedBrands}
                                        onChange={setSelectedBrands}
                                    >
                                        <Space direction="vertical">
                                            {brands.map(brand => (
                                                <Checkbox key={brand.id} value={brand.id}>
                                                    {brand.name}
                                                </Checkbox>
                                            ))}
                                        </Space>
                                    </Checkbox.Group>
                                </div>

                                <Divider />

                                <div>
                                    <Title level={5}>Khoảng giá</Title>
                                    <Slider
                                        range
                                        min={0}
                                        max={5000000}
                                        step={100000}
                                        value={priceRange}
                                        onChange={setPriceRange}
                                        tipFormatter={formatPrice}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Text>{formatPrice(priceRange[0])}</Text>
                                        <Text>{formatPrice(priceRange[1])}</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        {/* Main content - Product list */}
                        <Col xs={24} sm={24} md={18}>
                            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text>Hiển thị {filteredProducts.length} sản phẩm</Text>
                                </div>
                                <Space>
                                    <Select
                                        defaultValue="popular"
                                        style={{ width: 180 }}
                                        onChange={value => setSortBy(value)}
                                        value={sortBy}
                                    >
                                        <Option value="popular">Phổ biến nhất</Option>
                                        <Option value="newest">Mới nhất</Option>
                                        <Option value="priceLowToHigh">Giá: Thấp đến cao</Option>
                                        <Option value="priceHighToLow">Giá: Cao đến thấp</Option>
                                    </Select>
                                    <Space>
                                        <Button
                                            type={viewType === 'grid' ? 'primary' : 'default'}
                                            icon={<AppstoreOutlined />}
                                            onClick={() => setViewType('grid')}
                                        />
                                        <Button
                                            type={viewType === 'list' ? 'primary' : 'default'}
                                            icon={<UnorderedListOutlined />}
                                            onClick={() => setViewType('list')}
                                        />
                                    </Space>
                                </Space>
                            </div>


                            {loading ? (  // Conditional rendering for loading state
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <Spin size="large" tip="Đang tải sản phẩm..." />
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Title level={4}>Không tìm thấy sản phẩm phù hợp</Title>
                                    <Paragraph>Vui lòng thử lại với bộ lọc khác</Paragraph>
                                </Col>
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {productsToDisplay.map(product => (
                                        <Col key={product.id} xs={24} sm={12} md={viewType === 'list' ? 24 : 8} lg={viewType === 'list' ? 24 : 8}>
                                            <ProductCard product={product} />
                                        </Col>
                                    ))}
                                </Row>
                            )}

                            {/* Pagination */}
                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                                <Pagination
                                    current={currentPage}
                                    onChange={handlePageChange}
                                    total={filteredProducts.length}
                                    pageSize={pageSize}
                                    showSizeChanger={false}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Content>
        </Layout>
    );
};

export default ProductPage;
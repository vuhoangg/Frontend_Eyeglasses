// ProductPage.jsx
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
    AppstoreOutlined,
    UnorderedListOutlined,
    ReloadOutlined,
    ShoppingCartOutlined,  // Added for cart
    TagOutlined,           // Added for price tag
    DollarOutlined,        // Added for payment
    ThunderboltOutlined    // Added for quick action
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllProductAPI } from '../../services/api.product';
import { createCartItemAPI, updateCartItemAPI } from '../../services/api.cartItems'; // Import cart item APIs

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const ProductPage = () => {
    const [priceRange, setPriceRange] = useState([0, 5000000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [viewType, setViewType] = useState('grid');
    const [sortBy, setSortBy] = useState('popular');
    const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0 });
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            try {
                const categoriesResponse = await fetchAllProductAPI(1, 100);
                if (categoriesResponse && categoriesResponse.data && categoriesResponse.data.data) {
                    const uniqueCategories = Array.from(new Set(categoriesResponse.data.data.map(p => JSON.stringify(p.category))))
                        .map(JSON.parse)
                        .filter(cat => cat && cat.id && cat.name);
                    setCategories(uniqueCategories);
                } else {
                    console.error("Failed to fetch categories or invalid data structure:", categoriesResponse);
                }

                const brandsResponse = await fetchAllProductAPI(1, 100);
                if (brandsResponse && brandsResponse.data && brandsResponse.data.data) {
                    const uniqueBrands = Array.from(new Set(brandsResponse.data.data.map(p => JSON.stringify(p.brand))))
                        .map(JSON.parse)
                        .filter(brand => brand && brand.id && brand.name);
                    setBrands(uniqueBrands);
                } else {
                    console.error("Failed to fetch brands or invalid data structure:", brandsResponse);
                }
            } catch (error) {
                console.error("Error fetching categories and brands:", error);
                message.error("Lỗi khi tải dữ liệu bộ lọc.");
            }
        };
        fetchCategoriesAndBrands();
    }, []);


    const fetchProducts = async () => {
        setLoading(true);
        try {
            console.log(`Fetching page: ${pagination.page}, limit: ${pagination.limit}, categories: ${selectedCategories.join(',') || 'none'}, brands: ${selectedBrands.join(',') || 'none'}`);
            const res = await fetchAllProductAPI(
                pagination.page,
                pagination.limit,
                null,
                selectedCategories.length > 0 ? selectedCategories.join(',') : null,
                selectedBrands.length > 0 ? selectedBrands.join(',') : null
            );

            if (res && res.data && Array.isArray(res.data.data)) {
                console.log("API Response:", res.data);
                setProducts(res.data.data);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.total || 0,
                }));
            } else {
                console.error("Failed to load products or invalid data structure:", res);
                message.error("Không thể tải danh sách sản phẩm.");
                setProducts([]);
                setFilteredProducts([]);
                setPagination(prev => ({ ...prev, total: 0 }));
            }
        } catch (error) {
            message.error("Lỗi khi tải sản phẩm.");
            console.error(error);
            setProducts([]);
            setFilteredProducts([]);
            setPagination(prev => ({ ...prev, total: 0 }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.limit, selectedCategories, selectedBrands]);

    useEffect(() => {
        let result = [...products];

        result = result.filter(
            product => product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        switch (sortBy) {
            case 'priceLowToHigh':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'priceHighToLow':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'popular':
            default:
                break;
        }

        setFilteredProducts(result);
    }, [priceRange, sortBy, products]);


    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setPriceRange([0, 5000000]);
        setSortBy('popular');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePaginationChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            page: page,
            limit: pageSize || prev.limit,
        }));
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

        console.log(`Adding product ${productToAdd.id} (${productToAdd.name}) to cart from card.`);

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


    const ProductCard = ({ product, viewType, onAddToCart, onBuyNow }) => (
        <Badge.Ribbon
            text={product.discount > 0 ? `${product.discount}% GIẢM` : ''}
            color={product.discount > 0 ? 'red' : 'green'}
            style={{ display: product.discount > 0 ? 'block' : 'none' }}
        >
            <Card
                hoverable
                className={viewType === 'list' ? 'product-card-list' : 'product-card-grid'}
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
                    <Button
                        type="text"
                        icon={<ShoppingCartOutlined />}
                        disabled={!product.isActive}
                        onClick={(event) => onAddToCart(product, event)}
                        style={{ 
                            color: '#1890ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            margin: 0,
                            padding: '5px 0'
                        }}
                    >
                        Thêm vào giỏ
                    </Button>,
                    <Button
                        type="text"
                        icon={<ThunderboltOutlined />}
                        onClick={(event) => onBuyNow(product, event)}
                        disabled={!product.isActive || product.stock_quantity === 0}
                        style={{ 
                            color: '#ff4d4f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            margin: 0,
                            padding: '5px 0'
                        }}
                    >
                        Mua ngay
                    </Button>
                ]}
            >
                <Meta
                    title={
                        <Link to={`/product_detail/${product.id}`} onClick={(e) => e.stopPropagation()}>
                            {product.name || "Sản phẩm chưa có tên"}
                        </Link>
                    }
                    description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Space align="baseline">
                                <Text strong style={{ color: '#f5222d', fontSize: '1.1em' }}>{Number(product.price || 0).toLocaleString('vi-VN')}đ</Text>
                                {product.discount > 0 && product.originalPrice && (
                                    <Text delete type="secondary">{Number(product.originalPrice).toLocaleString('vi-VN')}đ</Text>
                                )}
                            </Space>
                            <div>
                                <Rate
                                    disabled
                                    allowHalf
                                    defaultValue={Number(product.rating) || 0}
                                    style={{ fontSize: 14, marginRight: 8 }}
                                />
                            </div>
                            <div>
                                {product.category?.name && <Tag color="blue">{product.category.name}</Tag>}
                                {product.brand?.name && <Tag color="purple">{product.brand.name}</Tag>}
                            </div>
                        </Space>
                    }
                />
            </Card>
        </Badge.Ribbon>
    );

    const formatPrice = value => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1600, margin: '0 auto' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>Cửa hàng</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Title level={2}>Danh sách sản phẩm</Title>

                    <Row gutter={24}>
                        <Col xs={24} sm={24} md={6} style={{ marginBottom: 24 }}>
                            <Card title="Bộ lọc sản phẩm" extra={<Button icon={<ReloadOutlined />} onClick={resetFilters} size="small">Đặt lại</Button>}>
                                <div style={{ marginBottom: 20 }}>
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: '0.9em' }}>
                                        <Text type='secondary'>{formatPrice(priceRange[0])}</Text>
                                        <Text type='secondary'>{formatPrice(priceRange[1])}</Text>
                                    </div>
                                </div>
                                <Divider />
                                {categories.length > 0 && (
                                    <div style={{ marginBottom: 20 }}>
                                        <Title level={5}>Danh mục</Title>
                                        <Checkbox.Group
                                            style={{ width: '100%' }}
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
                                )}
                                {categories.length > 0 && <Divider />}
                                {brands.length > 0 && (
                                    <div style={{ marginBottom: 20 }}>
                                        <Title level={5}>Thương hiệu</Title>
                                        <Checkbox.Group
                                            style={{ width: '100%' }}
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
                                )}
                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={18}>
                            <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                <div>
                                    <Text type="secondary">
                                        Hiển thị {filteredProducts.length} trong tổng số {pagination.total} sản phẩm
                                    </Text>
                                </div>
                                <Space wrap>
                                    <Select
                                        value={sortBy}
                                        style={{ width: 180 }}
                                        onChange={value => setSortBy(value)}
                                    >
                                        <Option value="popular">Phổ biến</Option>
                                        <Option value="newest">Mới nhất</Option>
                                        <Option value="priceLowToHigh">Giá: Thấp đến Cao</Option>
                                        <Option value="priceHighToLow">Giá: Cao đến Thấp</Option>
                                    </Select>
                                    <Space.Compact>
                                        <Button
                                            type={viewType === 'grid' ? 'primary' : 'default'}
                                            icon={<AppstoreOutlined />}
                                            onClick={() => setViewType('grid')}
                                            aria-label="Grid view"
                                        />
                                        <Button
                                            type={viewType === 'list' ? 'primary' : 'default'}
                                            icon={<UnorderedListOutlined />}
                                            onClick={() => setViewType('list')}
                                            aria-label="List view"
                                        />
                                    </Space.Compact>
                                </Space>
                            </div>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                                    <Spin size="large" tip="Đang tải sản phẩm..." />
                                </div>
                            ) : filteredProducts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                                    <Title level={4}>Không tìm thấy sản phẩm phù hợp</Title>
                                    <Paragraph type="secondary">Vui lòng thử thay đổi bộ lọc hoặc quay lại sau.</Paragraph>
                                    <Button onClick={resetFilters}>Xóa bộ lọc</Button>
                                </div>
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {filteredProducts.map(product => (
                                        <Col key={`${product.id}-${viewType}`}
                                            xs={24}
                                            sm={12}
                                            md={viewType === 'list' ? 24 : 8}
                                            lg={viewType === 'list' ? 24 : (viewType === 'grid' ? 8 : 24)}
                                        >
                                            <ProductCard
                                                product={product}
                                                viewType={viewType}
                                                onAddToCart={handleAddToCartFromCard}
                                                onBuyNow={handleBuyNowFromCard} // Pass onBuyNow here
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            )}

                            {pagination.total > pagination.limit && !loading && filteredProducts.length > 0 && (
                                <div style={{ marginTop: 24, textAlign: 'center' }}>
                                    <Pagination
                                        current={pagination.page}
                                        pageSize={pagination.limit}
                                        total={pagination.total}
                                        onChange={handlePaginationChange}
                                        onShowSizeChange={handlePaginationChange}
                                        showSizeChanger
                                        pageSizeOptions={['6', '12', '24', '48']}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </Content>
            <style jsx global>{`
                .product-card-list .ant-card-body {
                    display: flex;
                    align-items: center;
                }
                .product-card-list .ant-card-cover {
                    width: 150px !important;
                    flex-shrink: 0;
                    padding-top: 0 !important;
                    height: 150px;
                }
                .product-card-list .ant-card-cover img {
                    height: 100% !important;
                    object-fit: cover;
                }

                .product-card-list .ant-card-meta {
                    flex-grow: 1;
                    margin-left: 16px;
                }
                .product-card-list .ant-card-actions {
                    border-top: none;
                    margin-left: 16px;
                    flex-shrink: 0;
                }
                .product-card-list .ant-card-actions > li {
                    margin: 0 4px;
                }

                .product-card-grid .ant-card-cover img,
                .product-card-list .ant-card-cover img {
                    transition: transform 0.3s ease;
                }
                .ant-card-hoverable:hover .ant-card-cover img {
                    transform: scale(1.03);
                }
            `}</style>
        </Layout>
    );
};

export default ProductPage;
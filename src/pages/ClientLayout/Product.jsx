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
    message, // Đảm bảo message được import
    Spin
} from 'antd';
import {
    ShoppingOutlined, // Import icon
    HeartOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    ReloadOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Bỏ qs nếu không dùng trực tiếp query string ở đây
import { fetchAllProductAPI } from '../../services/api.product'; // Import API function

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input; // Bỏ Search nếu không dùng

const ProductPage = () => {
    // ... (các state hiện có: priceRange, selectedCategories, etc.) ...
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

    // ... (useEffect fetchCategoriesAndBrands) ...
    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            // ... (logic fetch categories/brands) ...
             try {
                // Fetch categories
                const categoriesResponse = await fetchAllProductAPI(1, 100);
                if (categoriesResponse && categoriesResponse.data && categoriesResponse.data.data) {
                    const uniqueCategories = Array.from(new Set(categoriesResponse.data.data.map(p => JSON.stringify(p.category))))
                                               .map(JSON.parse)
                                               .filter(cat => cat && cat.id && cat.name); // Ensure valid category objects
                    setCategories(uniqueCategories);
                } else {
                    console.error("Failed to fetch categories or invalid data structure:", categoriesResponse);
                    // message.error("Không thể tải danh mục."); // Optional: Show message only if critical
                }

                // Fetch brands (Assuming similar structure)
                 const brandsResponse = await fetchAllProductAPI(1, 100); // You might have a separate API for brands later
                 if (brandsResponse && brandsResponse.data && brandsResponse.data.data) {
                     const uniqueBrands = Array.from(new Set(brandsResponse.data.data.map(p => JSON.stringify(p.brand))))
                                              .map(JSON.parse)
                                              .filter(brand => brand && brand.id && brand.name); // Ensure valid brand objects
                     setBrands(uniqueBrands);
                 } else {
                     console.error("Failed to fetch brands or invalid data structure:", brandsResponse);
                      // message.error("Không thể tải thương hiệu."); // Optional
                 }
            } catch (error) {
                console.error("Error fetching categories and brands:", error);
                message.error("Lỗi khi tải dữ liệu bộ lọc.");
            }
        };
        fetchCategoriesAndBrands();
    }, []);


    // ... (useEffect fetchProducts) ...
    const fetchProducts = async () => {
        // ... (logic fetchProducts dựa trên pagination, filter) ...
         setLoading(true);
        try {
            console.log(`Fetching page: ${pagination.page}, limit: ${pagination.limit}, categories: ${selectedCategories.join(',') || 'none'}, brands: ${selectedBrands.join(',') || 'none'}`);
            const res = await fetchAllProductAPI(
                pagination.page,
                pagination.limit,
                null, // keyword
                selectedCategories.length > 0 ? selectedCategories.join(',') : null,
                selectedBrands.length > 0 ? selectedBrands.join(',') : null
            );

            if (res && res.data && Array.isArray(res.data.data)) {
                 console.log("API Response:", res.data);
                setProducts(res.data.data);
                // Lưu ý: Việc lọc và sắp xếp sẽ diễn ra trong useEffect khác
                // setFilteredProducts(res.data.data); // Bỏ dòng này, để useEffect lọc xử lý
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

    // useEffect gọi fetchProducts khi filter hoặc pagination thay đổi
    useEffect(() => {
        fetchProducts();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.limit, selectedCategories, selectedBrands]); // Chỉ fetch lại khi các dependencies này thay đổi

    // useEffect lọc và sắp xếp danh sách products đã fetch
     useEffect(() => {
        let result = [...products]; // Bắt đầu với danh sách sản phẩm đã fetch

        // --- BỘ LỌC ---
        // Không cần lọc category/brand ở đây nữa vì API đã làm
        // Filter by price range
        result = result.filter(
            product => product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // --- SẮP XẾP ---
        switch (sortBy) {
            case 'priceLowToHigh':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'priceHighToLow':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                 // Giả sử có trường `createdAt` hoặc tương tự
                result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            case 'popular':
            default:
                 // Sắp xếp theo tiêu chí khác nếu có, ví dụ: lượt bán, đánh giá, hoặc để nguyên thứ tự từ API
                // result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)); // Ví dụ
                break; // Giữ nguyên thứ tự từ API nếu không có tiêu chí rõ ràng
        }

        setFilteredProducts(result); // Cập nhật danh sách hiển thị
    }, [priceRange, sortBy, products]); // Chạy lại khi giá, sắp xếp, hoặc danh sách gốc từ API thay đổi


    // ... (resetFilters, handlePaginationChange) ...
    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setPriceRange([0, 5000000]);
        setSortBy('popular');
        setPagination(prev => ({ ...prev, page: 1 })); // Quay về trang 1
         // useEffect của fetchProducts sẽ tự động chạy lại
    };

    const handlePaginationChange = (page, pageSize) => {
        setPagination(prev => ({
            ...prev,
            page: page,
            limit: pageSize || prev.limit, // Cập nhật limit nếu thay đổi
        }));
         // useEffect của fetchProducts sẽ tự động chạy lại
    };


    // --- HÀM THÊM VÀO GIỎ HÀNG TỪ CARD ---
    const handleAddToCartFromCard = (productToAdd, event) => {
        // Ngăn chặn sự kiện click lan lên Card -> không bị chuyển trang
        if (event) {
            event.stopPropagation();
        }

        if (!productToAdd || !productToAdd.id) {
            message.error("Sản phẩm không hợp lệ.");
            return;
        }

        const quantityToAdd = 1; // Mặc định thêm 1 sản phẩm từ card

        console.log(`Adding product ${productToAdd.id} (${productToAdd.name}) to cart from card.`);

        // 1. Lấy giỏ hàng hiện tại từ localStorage
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

        // 2. Kiểm tra sản phẩm đã tồn tại chưa (dựa trên ID)
        // Lưu ý: Nếu sản phẩm có biến thể (màu, size) mà bạn muốn coi là item riêng biệt,
        // logic findIndex cần phức tạp hơn. Ở đây giả định chỉ cần ID.
        const existingItemIndex = cartItems.findIndex(item => item.id === productToAdd.id);

        if (existingItemIndex > -1) {
            // 3a. Nếu tồn tại, tăng số lượng
            cartItems[existingItemIndex].quantity += quantityToAdd;
            console.log(`Product ${productToAdd.id} exists, new quantity: ${cartItems[existingItemIndex].quantity}`);
        } else {
            // 3b. Nếu chưa, thêm mới vào giỏ hàng
            // Chỉ thêm các thông tin cần thiết vào giỏ hàng
            const newItem = {
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                imageProduct: productToAdd.imageProduct, // Lấy ảnh
                quantity: quantityToAdd,
                // Thêm các trường khác nếu cần (ví dụ: sku, category name, brand name)
                categoryName: productToAdd.category?.name,
                brandName: productToAdd.brand?.name,
                // Quan trọng: Không nên đưa toàn bộ object product vào cart
                // vì nó có thể chứa nhiều dữ liệu không cần thiết hoặc object lồng nhau phức tạp
            };
            cartItems.push(newItem);
            console.log(`Product ${productToAdd.id} added to cart.`);
        }

        // 4. Lưu lại giỏ hàng vào localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // 5. Hiển thị thông báo
        message.success(`Đã thêm ${productToAdd.name} vào giỏ hàng!`);

        // 6. Thông báo cho các component khác (như Header) cập nhật
        window.dispatchEvent(new Event('storage'));
    };


    // Component con để hiển thị thông tin sản phẩm
    // Truyền handleAddToCartFromCard và viewType xuống ProductCard
    const ProductCard = ({ product, viewType, onAddToCart }) => (
        <Badge.Ribbon
            text={product.discount > 0 ? `${product.discount}% GIẢM` : ''}
            color={product.discount > 0 ? 'red' : 'green'}
            style={{ display: product.discount > 0 ? 'block' : 'none' }}
        >
            <Card
                hoverable
                className={viewType === 'list' ? 'product-card-list' : 'product-card-grid'}
                // Quan trọng: onClick của Card để điều hướng
                onClick={() => navigate(`/product/${product.id}`)} // Sửa thành product_detail
                cover={
                    <div style={{ position: 'relative', paddingTop: '100%' /* Tạo tỷ lệ vuông */ }}>
                         <img
                            alt={product.name}
                            src={product.imageProduct ? `http://localhost:8082/images/product/${product.imageProduct}` : 'https://placehold.co/300x300?text=No+Image'} // Fallback image
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%', // Lấp đầy div chứa
                                objectFit: 'cover' // Giữ tỷ lệ và cắt nếu cần
                            }}
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x300?text=Error" }} // Xử lý lỗi tải ảnh
                        />
                        {!product.isActive && (
                            <div style={{
                                // ... style overlay hết hàng ...
                                 position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(255,255,255,0.7)', // Nền mờ hơn
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1 // Đảm bảo nằm trên ảnh
                            }}>
                                <Tag color="error" style={{ fontSize: 14, padding: '5px 10px' }}>Hết hàng</Tag>
                            </div>
                        )}
                    </div>
                }
                actions={[
                    <Button
                        type="primary"
                        icon={<ShoppingOutlined />}
                        disabled={!product.isActive}
                        // Gọi hàm onAddToCart đã được truyền xuống, nhớ truyền cả event
                        onClick={(event) => onAddToCart(product, event)}
                         // Dừng lan truyền ở đây cũng được, nhưng trong hàm xử lý rõ ràng hơn
                         // onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    >
                        {/* Hiển thị text tùy theo viewType */}
                        {viewType === 'list' ? 'Thêm vào giỏ' : ''}
                    </Button>,
                    <Button
                        type="default"
                        icon={<HeartOutlined />}
                        onClick={(e) => e.stopPropagation()} // Ngăn điều hướng khi bấm Yêu thích
                    >
                        {viewType === 'list' ? 'Yêu thích' : ''}
                    </Button>
                ]}
            >
                <Meta
                    // Bọc Link quanh Title, ngăn lan truyền event để không bị điều hướng 2 lần
                    title={
                        <Link to={`/product_detail/${product.id}`} onClick={(e) => e.stopPropagation()}>
                            {product.name || "Sản phẩm chưa có tên"}
                        </Link>
                    }
                    description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Space align="baseline">
                                <Text strong style={{ color: '#f5222d', fontSize: '1.1em' }}>{Number(product.price || 0).toLocaleString('vi-VN')}đ</Text>
                                {/* Hiển thị giá gốc nếu có giảm giá */}
                                {product.discount > 0 && product.originalPrice && (
                                     <Text delete type="secondary">{Number(product.originalPrice).toLocaleString('vi-VN')}đ</Text>
                                )}
                            </Space>
                            <div>
                                <Rate
                                    disabled
                                    allowHalf
                                    // Đảm bảo rating là số hợp lệ, nếu không thì 0
                                    defaultValue={Number(product.rating) || 0}
                                    style={{ fontSize: 14, marginRight: 8 }}
                                />
                                {/* <Text type="secondary">({product.reviewsCount || 0})</Text> */}
                            </div>
                             {/* Hiển thị tags Category và Brand */}
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

    // Hàm format giá tiền
    const formatPrice = value => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

    // --- RETURN JSX của ProductPage ---
    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1600, margin: '0 auto' }}>
                {/* Breadcrumb */}
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>Cửa hàng</Breadcrumb.Item> {/* Hoặc tên danh mục cụ thể nếu có */}
                </Breadcrumb>

                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Title level={2}>Danh sách sản phẩm</Title>
                    {/* Có thể thêm mô tả */}

                    <Row gutter={24}>
                        {/* Sidebar - Filters */}
                        <Col xs={24} sm={24} md={6} style={{ marginBottom: 24 }}> {/* Thêm margin bottom cho sidebar trên mobile */}
                             <Card title="Bộ lọc sản phẩm" extra={<Button icon={<ReloadOutlined />} onClick={resetFilters} size="small">Đặt lại</Button>}>
                                {/* Price Range Filter */}
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
                                {/* Category Filter */}
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
                                {/* Brand Filter */}
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

                        {/* Main content - Product list */}
                        <Col xs={24} sm={24} md={18}>
                            {/* Sort and View Options */}
                            <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                <div>
                                     {/* Hiển thị số lượng sản phẩm đang hiển thị / tổng số */}
                                     <Text type="secondary">
                                        Hiển thị {filteredProducts.length} trong tổng số {pagination.total} sản phẩm
                                    </Text>
                                </div>
                                <Space wrap> {/* Cho phép xuống dòng nếu không đủ chỗ */}
                                    <Select
                                        value={sortBy} // Sử dụng value thay vì defaultValue để control component
                                        style={{ width: 180 }}
                                        onChange={value => setSortBy(value)}
                                    >
                                        <Option value="popular">Phổ biến</Option>
                                        <Option value="newest">Mới nhất</Option>
                                        <Option value="priceLowToHigh">Giá: Thấp đến Cao</Option>
                                        <Option value="priceHighToLow">Giá: Cao đến Thấp</Option>
                                    </Select>
                                    <Space.Compact> {/* Nhóm 2 nút view lại */}
                                         <Button
                                            type={viewType === 'grid' ? 'primary' : 'default'}
                                            icon={<AppstoreOutlined />}
                                            onClick={() => setViewType('grid')}
                                            aria-label="Grid view" // Accessibility
                                        />
                                        <Button
                                            type={viewType === 'list' ? 'primary' : 'default'}
                                            icon={<UnorderedListOutlined />}
                                            onClick={() => setViewType('list')}
                                            aria-label="List view" // Accessibility
                                        />
                                    </Space.Compact>
                                </Space>
                            </div>

                            {/* Product Grid/List */}
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
                                        <Col key={`${product.id}-${viewType}`} // Thêm viewType vào key để re-render khi đổi view
                                           xs={24} // Full width trên extra small
                                           sm={12} // 2 cột trên small
                                           md={viewType === 'list' ? 24 : 8} // List: 1 cột; Grid: 3 cột trên medium
                                           lg={viewType === 'list' ? 24 : (viewType === 'grid' ? 8 : 24)} // Đảm bảo grid 3 cột trên large
                                          // xl={viewType === 'list' ? 24 : (viewType === 'grid' ? 6 : 24)} // Grid 4 cột trên extra large
                                           >
                                            {/* Truyền hàm xử lý và viewType xuống */}
                                            <ProductCard
                                                product={product}
                                                viewType={viewType}
                                                onAddToCart={handleAddToCartFromCard}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            )}

                            {/* Pagination */}
                            {pagination.total > pagination.limit && !loading && filteredProducts.length > 0 && ( // Chỉ hiển thị nếu có nhiều hơn 1 trang và không loading và có sản phẩm
                                <div style={{ marginTop: 24, textAlign: 'center' }}>
                                    <Pagination
                                        current={pagination.page}
                                        pageSize={pagination.limit}
                                        total={pagination.total}
                                        onChange={handlePaginationChange}
                                        onShowSizeChange={handlePaginationChange} // Xử lý cả thay đổi pageSize
                                        showSizeChanger // Hiển thị tùy chọn thay đổi pageSize
                                        pageSizeOptions={['6', '12', '24', '48']} // Các tùy chọn pageSize
                                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`} // Hiển thị tổng số
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </Content>
            <style jsx global>{`
                // CSS cho Product Card List View (ví dụ)
                 .product-card-list .ant-card-body {
                    display: flex;
                    align-items: center;
                }
                 .product-card-list .ant-card-cover {
                    width: 150px !important; // Giới hạn chiều rộng ảnh
                    flex-shrink: 0; // Không co lại
                     padding-top: 0 !important; // Bỏ padding-top nếu có
                     height: 150px; // Đặt chiều cao cố định cho ảnh
                }
                 .product-card-list .ant-card-cover img {
                    height: 100% !important; // Ảnh fill thẻ chứa cover
                    object-fit: cover;
                 }

                .product-card-list .ant-card-meta {
                    flex-grow: 1; // Phần meta chiếm phần còn lại
                    margin-left: 16px;
                 }
                .product-card-list .ant-card-actions {
                    border-top: none; // Bỏ border actions nếu muốn
                    margin-left: 16px;
                    flex-shrink: 0; // Actions không co lại
                 }
                 .product-card-list .ant-card-actions > li {
                     margin: 0 4px; // Giảm khoảng cách actions
                 }

                // CSS chung cho Card
                 .product-card-grid .ant-card-cover img,
                 .product-card-list .ant-card-cover img {
                    transition: transform 0.3s ease; // Hiệu ứng zoom nhẹ khi hover
                 }
                 .ant-card-hoverable:hover .ant-card-cover img {
                    transform: scale(1.03); // Zoom nhẹ ảnh khi hover card
                 }

                 // Responsive adjustments for sidebar/content
                 @media (max-width: 767px) {
                    // Có thể thêm style riêng cho mobile nếu cần
                 }
            `}</style>
        </Layout>
    );
};

export default ProductPage;
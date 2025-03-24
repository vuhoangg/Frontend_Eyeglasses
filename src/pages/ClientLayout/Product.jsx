import React, { useState, useEffect } from 'react';
import { Layout,
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
    HeartOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    ReloadOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { fetchAllProductAPI } from '../../services/api.product'; // Import API function

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const ProductPage = () => {
    // Các state để lưu trữ trạng thái của bộ lọc
    const [priceRange, setPriceRange] = useState([0, 5000000]); // Khoảng giá sản phẩm
    const [selectedCategories, setSelectedCategories] = useState([]); // Danh sách các category được chọn
    const [selectedBrands, setSelectedBrands] = useState([]); // Danh sách các brand được chọn
    const [viewType, setViewType] = useState('grid'); // Loại hiển thị sản phẩm ('grid' hoặc 'list')
    const [sortBy, setSortBy] = useState('popular'); // Tiêu chí sắp xếp sản phẩm

    // State để quản lý phân trang
    const [pagination, setPagination] = useState({
        page: 1, // Trang hiện tại
        limit: 6, // Số lượng sản phẩm trên mỗi trang
        total: 0, // Tổng số sản phẩm
    });

    // Products
    const [products, setProducts] = useState([]); // Danh sách tất cả sản phẩm lấy từ API
    const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sản phẩm sau khi áp dụng bộ lọc
    const [loading, setLoading] = useState(true); // Trạng thái loading khi gọi API

    // Categories and Brands (replace with API data in real application)
    const [categories, setCategories] = useState([]); // Danh sách categories
    const [brands, setBrands] = useState([]); // Danh sách brands

    // Hàm useEffect để lấy danh sách categories và brands từ API khi component mount
    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await fetchAllProductAPI(1, 100); // Lấy tất cả categories (điều chỉnh limit nếu cần)
                if (categoriesResponse && categoriesResponse.data) {
                    // Trích xuất các category duy nhất từ sản phẩm
                    const uniqueCategories = Array.from(new Set(categoriesResponse.data.data.map(p => JSON.stringify(p.category)))).map(JSON.parse);
                    setCategories(uniqueCategories);
                } else {
                    console.error("Failed to fetch categories:", categoriesResponse);
                    message.error("Failed to fetch categories.");
                }

                // Fetch brands
                const brandsResponse = await fetchAllProductAPI(1, 100); // Lấy tất cả brands (điều chỉnh limit nếu cần)
                if (brandsResponse && brandsResponse.data) {
                    // Trích xuất các brand duy nhất từ sản phẩm
                    const uniqueBrands = Array.from(new Set(brandsResponse.data.data.map(p => JSON.stringify(p.brand)))).map(JSON.parse);
                    setBrands(uniqueBrands);
                } else {
                    console.error("Failed to fetch brands:", brandsResponse);
                    message.error("Failed to fetch brands.");
                }
            } catch (error) {
                console.error("Error fetching categories and brands:", error);
                message.error("Error fetching categories and brands.");
            }
        };

        fetchCategoriesAndBrands();
    }, []);



    // Hàm useEffect để lấy danh sách sản phẩm từ API
    const fetchProducts = async () => {
        setLoading(true); // Bật trạng thái loading
        try {
            const res = await fetchAllProductAPI(
                pagination.page,
                pagination.limit,
                "", // Keyword (tạm thời để trống)
                selectedCategories.length > 0 ? selectedCategories.join(',') : null, // category_id (nếu có chọn)
                selectedBrands.length > 0 ? selectedBrands.join(',') : null   // brand_id (nếu có chọn)
            ); // Gọi API để lấy sản phẩm

            if (res && res.data) {
                setProducts(res.data.data); // Cập nhật danh sách sản phẩm
                setFilteredProducts(res.data.data); // Cập nhật danh sách sản phẩm đã lọc (ban đầu giống danh sách sản phẩm gốc)
                setPagination({
                    ...pagination,
                    total: res.data.total, // Cập nhật tổng số sản phẩm
                });
            } else {
                message.error("Failed to load products."); // Hiển thị thông báo lỗi
                setProducts([]); // Đặt danh sách sản phẩm thành rỗng
                setFilteredProducts([]); // Đặt danh sách sản phẩm đã lọc thành rỗng
                setPagination({ ...pagination, total: 0 }); // Đặt tổng số sản phẩm thành 0
            }
        } catch (error) {
            message.error("Failed to load products."); // Hiển thị thông báo lỗi
            console.error(error); // Ghi log lỗi
            setProducts([]); // Đặt danh sách sản phẩm thành rỗng
            setFilteredProducts([]); // Đặt danh sách sản phẩm đã lọc thành rỗng
            setPagination({ ...pagination, total: 0 }); // Đặt tổng số sản phẩm thành 0
        } finally {
            setLoading(false); // Tắt trạng thái loading
        }
    };

    // Hàm useEffect để gọi API khi trang, limit, category hoặc brand thay đổi
    useEffect(() => {
        fetchProducts();
    }, [pagination.page, pagination.limit, selectedCategories, selectedBrands]);


    // Hàm useEffect để áp dụng các bộ lọc (category, brand, price range, sort)
    useEffect(() => {
        let result = [...products]; // Tạo bản sao của danh sách sản phẩm gốc

        // Filter by category
        if (selectedCategories.length > 0) {
            result = result.filter(product => selectedCategories.includes(product.category_id)); // Lọc theo category
        }

        // Filter by brand
        if (selectedBrands.length > 0) {
            result = result.filter(product => selectedBrands.includes(product.brand_id)); // Lọc theo brand
        }

        // Filter by price range
        result = result.filter(
            product => product.price >= priceRange[0] && product.price <= priceRange[1] // Lọc theo khoảng giá
        );

        // Apply sorting
        switch (sortBy) {
            case 'priceLowToHigh':
                result.sort((a, b) => a.price - b.price); // Sắp xếp giá từ thấp đến cao
                break;
            case 'priceHighToLow':
                result.sort((a, b) => b.price - a.price); // Sắp xếp giá từ cao đến thấp
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)); // Sắp xếp theo ngày tạo mới nhất
                break;
            case 'popular':
            default:
                result.sort((a, b) => b.stock_quantity - a.stock_quantity);  // Sắp xếp theo số lượng tồn kho (tạm coi là độ phổ biến)
                break;
        }

        setFilteredProducts(result); // Cập nhật danh sách sản phẩm đã lọc
    }, [selectedCategories, selectedBrands, priceRange, sortBy, products]);

    // Hàm để reset tất cả các bộ lọc
    const resetFilters = () => {
        setSelectedCategories([]); // Xóa danh sách category đã chọn
        setSelectedBrands([]); // Xóa danh sách brand đã chọn
        setPriceRange([0, 5000000]); // Đặt lại khoảng giá
        setSortBy('popular'); // Đặt lại tiêu chí sắp xếp
        setPagination({ ...pagination, page: 1 }); // Đặt lại trang về trang 1
    };


  

    const handlePaginationChange = (page, pageSize) => {
        const newLimit = parseInt(pageSize, 10); // Convert size to a number
    
        console.log("New Limit: ", newLimit);
        console.log("New Page: ", page);
    
        setPagination({
            page: page,
            limit: newLimit,
            total: pagination.total
        });
    };


    // Component con để hiển thị thông tin sản phẩm
    const ProductCard = ({ product }) => (
        <Badge.Ribbon
            text={product.discount > 0 ? `${product.discount}% GIẢM` : ''} // Hiển thị tag giảm giá nếu có
            color={product.discount > 0 ? 'red' : 'green'}
            style={{ display: product.discount > 0 ? 'block' : 'none' }}
        >
            <Card
                hoverable
                className={viewType === 'list' ? 'product-card-list' : 'product-card-grid'} // Class CSS tùy thuộc vào loại hiển thị
                cover={
                    <div style={{ position: 'relative' }}>
                        <img
                            alt={product.name}
                            src={`http://localhost:8082/images/product/${product.imageProduct}`} // URL ảnh sản phẩm
                            style={{ height: viewType === 'list' ? 150 : 200, objectFit: 'cover', width: '100%' }} // Style cho ảnh
                        />
                        {!product.isActive && (
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
                        disabled={!product.isActive} // Disable button nếu sản phẩm không active
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
                    title={<Link to={`/product/${product.id}`}>{product.name}</Link>} // Title là link đến trang chi tiết sản phẩm
                    
                    description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Space>
                                {/* {product.oldPrice && <Text delete type="secondary">{product.oldPrice.toLocaleString('vi-VN')}đ</Text>} */}
                                <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>{Number(product.price).toLocaleString('vi-VN')}đ</Text> 
                            </Space>
                            <div>
                                <Rate
                                    disabled
                                    defaultValue={parseFloat(product.rating)}
                                    allowHalf
                                    style={{ fontSize: 14 }}
                                />
                                <Text type="secondary"> {product.reviews}</Text>
                            </div>
                            <div>
                                <Tag color="blue">{product.category?.name || "Unknown"}</Tag> 
                                <Tag color="purple">{product.brand?.name || "Unknown"}</Tag> 
                            </div>
                        </Space>
                    }
                />
            </Card>

        </Badge.Ribbon>
    );




    // Hàm format giá tiền
    const formatPrice = value => `${value.toLocaleString('vi-VN')}đ`;

    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1600, margin: '0 auto' }}>
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
                                    {filteredProducts.map(product => (
                                        <Col key={product.id} xs={24} sm={12} md={viewType === 'list' ? 24 : 8} lg={viewType === 'list' ? 24 : 8}>
                                            <ProductCard product={product} />
                                        </Col>
                                    ))}
                                </Row>
                            )}

                            {/* Pagination */}
                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <Pagination
                                current={pagination.page}
                                total={pagination.total}
                                pageSize={pagination.limit}
                                showSizeChanger
                                pageSizeOptions={['5', '6', '10', '20', '50']}
                                onChange={handlePaginationChange}
                                onShowSizeChange={handlePaginationChange}
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
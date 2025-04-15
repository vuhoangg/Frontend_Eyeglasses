import React, { useState, useEffect } from 'react';
import { 
    Layout, 
    Typography, 
    Row, 
    Col, 
    Card, 
    Space, 
    Divider, 
    Tag, 
    Pagination, 
    Input, 
    Breadcrumb, 
    Select, 
    Button, 
    Empty, 
    Skeleton 
} from 'antd';
import { 
    SearchOutlined, 
    ClockCircleOutlined, 
    EyeOutlined, 
    TagOutlined,
    RightOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

// Mock data cho bài viết blog
const mockBlogPosts = [
    {
        id: 1,
        title: 'Cách chọn kính phù hợp với khuôn mặt tròn',
        excerpt: 'Khuôn mặt tròn thường có đặc điểm là chiều rộng và chiều dài gần bằng nhau, với đường nét mềm mại và không có góc cạnh rõ ràng...',
        image: 'src/resources/News/2-1.png',
        date: '12/04/2025',
        author: 'HUNO Eyewear',
        views: 1250,
        category: 'Hướng dẫn',
        tags: ['kính cận', 'khuôn mặt tròn', 'cách chọn kính'],
        featured: true
    },
    {
        id: 2,
        title: 'Xu hướng kính mắt nổi bật năm 2025',
        excerpt: 'Năm 2025 chứng kiến sự trở lại mạnh mẽ của các mẫu kính retro với phiên bản hiện đại hơn. Gọng kính oversized, metallic frame...',
        image: 'src/resources/News/Mau-mat-kinh-hot-trend-2025-10.jpg',
        date: '08/04/2025',
        author: 'HUNO Eyewear',
        views: 980,
        category: 'Xu hướng',
        tags: ['xu hướng', 'kính thời trang', '2025'],
        featured: true
    },
    {
        id: 3,
        title: 'Cách bảo quản kính mắt đúng cách',
        excerpt: 'Kính mắt là vật dụng cần được bảo quản cẩn thận để kéo dài tuổi thọ và giữ được chất lượng tốt nhất. Hãy cùng HUNO Eyewear tìm hiểu...',
        image: 'src/resources/News/nguoimau.png',
        date: '05/04/2025',
        author: 'HUNO Eyewear',
        views: 845,
        category: 'Mẹo hay',
        tags: ['bảo quản kính', 'mẹo hay', 'chăm sóc kính'],
        featured: false
    },
    {
        id: 4,
        title: 'Kính chống ánh sáng xanh có thực sự cần thiết?',
        excerpt: 'Trong thời đại công nghệ số, chúng ta dành nhiều thời gian trước các thiết bị điện tử, khiến mắt phải tiếp xúc với ánh sáng xanh có hại...',
        image: 'src/resources/News/nen_chon_mua_kinh_ram_nhu_the_nao_de_an_toan_va_chat_luong_-min-1640572691000-1646044120000.jpeg',
        date: '01/04/2025',
        author: 'HUNO Eyewear',
        views: 1540,
        category: 'Sức khỏe',
        tags: ['kính chống ánh sáng xanh', 'bảo vệ mắt', 'công nghệ'],
        featured: false
    },
    {
        id: 5,
        title: 'Phân biệt các loại tròng kính',
        excerpt: 'Trên thị trường hiện nay có nhiều loại tròng kính khác nhau như tròng kính nhựa, tròng polycarbonate, tròng kính thủy tinh...',
        image: 'src/resources/News/anhcuahang2.jpg',
        date: '28/03/2025',
        author: 'HUNO Eyewear',
        views: 1120,
        category: 'Kiến thức',
        tags: ['tròng kính', 'chất liệu', 'so sánh'],
        featured: false
    },
    {
        id: 6,
        title: 'Lịch sử phát triển của kính mắt qua các thời kỳ',
        excerpt: 'Kính mắt đã có lịch sử phát triển hàng trăm năm, từ những chiếc kính đơn giản đầu tiên đến những sản phẩm công nghệ cao ngày nay...',
        image: 'src/resources/News/kinh-mat.jpg',
        date: '23/03/2025',
        author: 'HUNO Eyewear',
        views: 790,
        category: 'Lịch sử',
        tags: ['lịch sử kính mắt', 'phát triển', 'thời kỳ'],
        featured: false
    },
    {
        id: 7,
        title: 'Chọn kính râm cho mùa hè này',
        excerpt: 'Mùa hè là thời điểm lý tưởng để sở hữu một cặp kính râm chất lượng, vừa bảo vệ mắt khỏi tia UV, vừa tăng phong cách thời trang...',
        image: 'src/resources/News/photo-1654312676574-16543126771631037658695.webp',
        date: '18/03/2025',
        author: 'HUNO Eyewear',
        views: 1350,
        category: 'Mùa hè',
        tags: ['kính râm', 'mùa hè', 'chống UV'],
        featured: true
    },
    {
        id: 8,
        title: 'Phối đồ với kính mắt theo phong cách Hàn Quốc',
        excerpt: 'Phong cách Hàn Quốc đang trở thành xu hướng thời trang được yêu thích. Hãy cùng HUNO Eyewear khám phá cách phối đồ cùng kính mắt...',
        image: 'src/resources/News/cover8125-kinhmat-elleman.png',
        date: '14/03/2025',
        author: 'HUNO Eyewear',
        views: 2100,
        category: 'Thời trang',
        tags: ['phối đồ', 'Hàn Quốc', 'phong cách'],
        featured: false
    }
];

// Danh sách categories cho filter
const categories = [
    'Tất cả',
    'Hướng dẫn',
    'Xu hướng',
    'Mẹo hay',
    'Sức khỏe',
    'Kiến thức',
    'Lịch sử',
    'Mùa hè',
    'Thời trang'
];

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');

    // Giả lập API call để lấy dữ liệu
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setPosts(mockBlogPosts);
            setFilteredPosts(mockBlogPosts);
            setFeaturedPosts(mockBlogPosts.filter(post => post.featured));
            setLoading(false);
        }, 1000);
    }, []);

    // Xử lý tìm kiếm và lọc
    useEffect(() => {
        let results = [...posts];
        
        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            results = results.filter(post => 
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Lọc theo danh mục
        if (selectedCategory !== 'Tất cả') {
            results = results.filter(post => post.category === selectedCategory);
        }
        
        setFilteredPosts(results);
        setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
    }, [searchTerm, selectedCategory, posts]);

    // Tính toán phân trang
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Cuộn lên đầu trang khi chuyển trang
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Xử lý tìm kiếm
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // Xử lý chọn danh mục
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    return (
        <Layout>
            <Content>
                {/* Breadcrumb */}
                <div style={{ background: '#f0f2f5', padding: '16px 0' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                        <Breadcrumb>
                            <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>Tin tức</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                {/* Banner */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        height: '300px',
                        backgroundImage: 'url(src/resources/imagelayout/banner2.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.8)',
                        position: 'relative'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        color: 'white',
                        textAlign: 'center',
                        padding: '0 20px'
                    }}>
                        <Title style={{ color: 'white', marginBottom: 8 }}>TIN TỨC & BÀI VIẾT</Title>
                        <Divider style={{ background: '#fff', height: 2, width: 80, margin: '12px auto' }} />
                        <Paragraph style={{ color: 'white', fontSize: 18, maxWidth: 800, lineHeight: '1.6' }}>
                            Cập nhật những tin tức mới nhất về thời trang kính mắt, bí quyết chọn kính phù hợp và chăm sóc thị lực
                        </Paragraph>
                    </div>
                </div>

                {/* Main content */}
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px' }}>
                    {/* Featured Posts */}
                    {loading ? (
                        <div style={{ marginBottom: 40 }}>
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </div>
                    ) : featuredPosts.length > 0 && (
                        <div style={{ marginBottom: 40 }}>
                            <Title level={2} style={{ marginBottom: 20 }}>BÀI VIẾT NỔI BẬT</Title>
                            <Divider style={{ background: '#1890ff', height: 3, width: 60, marginLeft: 0, marginTop: 0 }} />
                            
                            <Row gutter={[24, 24]}>
                                {featuredPosts.slice(0, 3).map(post => (
                                    <Col xs={24} sm={24} md={8} key={post.id}>
                                        <Link to={`/blog/${post.id}`}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <div style={{ height: 200, overflow: 'hidden' }}>
                                                        <img 
                                                            alt={post.title}
                                                            src={post.image}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                }
                                                className="blog-card"
                                            >
                                                <Tag color="#1890ff" style={{ marginBottom: 12 }}>{post.category}</Tag>
                                                <Meta
                                                    title={post.title}
                                                    description={post.excerpt}
                                                />
                                                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                                                    <Text type="secondary"><ClockCircleOutlined /> {post.date}</Text>
                                                    <Text type="secondary"><EyeOutlined /> {post.views} lượt xem</Text>
                                                </div>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    {/* Filter Controls */}
                    <div style={{ marginBottom: 30 }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={24} md={8}>
                                <Title level={4}>TIN TỨC MỚI NHẤT</Title>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Search
                                    placeholder="Tìm kiếm bài viết..."
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    size="large"
                                    onSearch={handleSearch}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Chọn danh mục"
                                    onChange={handleCategoryChange}
                                    defaultValue="Tất cả"
                                    size="large"
                                >
                                    {categories.map(category => (
                                        <Option key={category} value={category}>{category}</Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                    </div>

                    {/* Blog Posts Grid */}
                    {loading ? (
                        <Row gutter={[24, 24]}>
                            {[...Array(6)].map((_, index) => (
                                <Col xs={24} sm={12} md={8} key={index}>
                                    <Card>
                                        <Skeleton active avatar paragraph={{ rows: 4 }} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : currentPosts.length > 0 ? (
                        <Row gutter={[24, 24]}>
                            {currentPosts.map(post => (
                                <Col xs={24} sm={12} md={8} key={post.id}>
                                    <Link to={`/blog/${post.id}`}>
                                        <Card
                                            hoverable
                                            cover={
                                                <div style={{ height: 200, overflow: 'hidden' }}>
                                                    <img 
                                                        alt={post.title}
                                                        src={post.image}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            }
                                            className="blog-card"
                                        >
                                            <Tag color="#1890ff" style={{ marginBottom: 12 }}>{post.category}</Tag>
                                            <Meta
                                                title={post.title}
                                                description={
                                                    <Paragraph ellipsis={{ rows: 2 }}>{post.excerpt}</Paragraph>
                                                }
                                            />
                                            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                                                <Text type="secondary"><ClockCircleOutlined /> {post.date}</Text>
                                                <Text type="secondary"><EyeOutlined /> {post.views}</Text>
                                            </div>
                                            <div style={{ marginTop: 12 }}>
                                                {post.tags.slice(0, 2).map(tag => (
                                                    <Tag key={tag} style={{ marginBottom: 5 }}>
                                                        <TagOutlined /> {tag}
                                                    </Tag>
                                                ))}
                                                {post.tags.length > 2 && <Tag>+{post.tags.length - 2}</Tag>}
                                            </div>
                                            <Button 
                                                type="link" 
                                                style={{ padding: 0, marginTop: 12, display: 'flex', alignItems: 'center' }}
                                            >
                                                Đọc tiếp <RightOutlined style={{ fontSize: 12, marginLeft: 4 }} />
                                            </Button>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty 
                            description="Không tìm thấy bài viết phù hợp" 
                            style={{ margin: '40px 0' }}
                        />
                    )}

                    {/* Pagination */}
                    {filteredPosts.length > postsPerPage && (
                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <Pagination 
                                current={currentPage}
                                total={filteredPosts.length}
                                pageSize={postsPerPage}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </div>
            </Content>

            {/* CSS Styles */}
            <style jsx>{`
                .blog-card {
                    height: 100%;
                    transition: all 0.3s;
                }
                .blog-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .ant-card-meta-title {
                    white-space: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    margin-bottom: 8px !important;
                    font-weight: 600;
                }
                .ant-card-meta-description {
                    color: #666;
                    height: 40px;
                    overflow: hidden;
                }
                .ant-divider {
                    margin: 16px 0 24px;
                }
                .ant-pagination {
                    margin-top: 20px;
                }
                .ant-tag {
                    margin-right: 8px;
                }
            `}</style>
        </Layout>
    );
};

export default BlogPage;
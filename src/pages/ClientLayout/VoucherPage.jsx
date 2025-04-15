import React, { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Button,
    Divider,
    Tag,
    Progress,
    Breadcrumb,
    Input,
    Modal,
    Form,
    Select,
    message,
    Tabs,
    Empty,
    Tooltip,
    Space,
    Skeleton,
    Pagination,
    Alert,
    Statistic
} from 'antd';
import {
    CopyOutlined,
    ClockCircleOutlined,
    GiftOutlined,
    ShoppingOutlined,
    UserOutlined,
    PercentageOutlined,
    InfoCircleOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    TagsOutlined,
    SearchOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;
const { Meta } = Card;

// Mock data cho voucher/mã giảm giá (giữ nguyên từ file gốc)
const mockVouchers = [
    {
        id: 1,
        code: 'WELCOME25',
        title: 'Ưu Đãi Đặc Biệt Khách Hàng Mới',
        description: 'Giảm 25% cho đơn hàng đầu tiên. Cơ hội trải nghiệm sản phẩm kính mắt cao cấp.',
        discountType: 'percent',
        discountValue: 25,
        minOrderValue: 500000,
        maxDiscount: 200000,
        expiryDate: '2025-05-15T23:59:59',
        totalQuantity: 200,
        usedQuantity: 78,
        imageUrl: '/src/resources/imagelayout/voucher1.jpg',
        category: 'new',
        conditions: [
            'Dành riêng cho khách hàng mới.',
            'Áp dụng cho đơn hàng từ 500.000 VNĐ.',
            'Mức giảm tối đa 200.000 VNĐ.',
            'Không áp dụng cho sản phẩm đang giảm giá khác.'
        ]
    },
    {
        id: 2,
        code: 'SUMMER30',
        title: 'Khuyến Mãi Hè Rực Rỡ - Giảm 30% Kính Râm',
        description: 'Chào hè với ưu đãi 30% cho bộ sưu tập kính râm thời thượng. Bảo vệ mắt, thêm phong cách.',
        discountType: 'percent',
        discountValue: 30,
        minOrderValue: 1000000,
        maxDiscount: 500000,
        expiryDate: '2025-05-31T23:59:59',
        totalQuantity: 100,
        usedQuantity: 67,
        imageUrl: '/src/resources/imagelayout/voucher2.jpg',
        category: 'seasonal',
        conditions: [
            'Chỉ áp dụng cho danh mục Kính Râm.',
            'Đơn hàng tối thiểu 1.000.000 VNĐ.',
            'Mức giảm tối đa 500.000 VNĐ.',
            'Không kết hợp với chương trình khác.'
        ]
    },
    {
        id: 3,
        code: 'FRAME100K',
        title: 'Ưu Đãi Gọng Kính - Giảm Ngay 100.000 VNĐ',
        description: 'Thay đổi diện mạo với gọng kính mới, giảm ngay 100.000 VNĐ. Đa dạng mẫu mã, chất lượng vượt trội.',
        discountType: 'fixed',
        discountValue: 100000,
        minOrderValue: 400000,
        maxDiscount: 100000,
        expiryDate: '2025-06-15T23:59:59',
        totalQuantity: 150,
        usedQuantity: 42,
        imageUrl: '/src/resources/imagelayout/voucher3.jpg',
        category: 'frame',
        conditions: [
            'Áp dụng cho danh mục Gọng Kính.',
            'Đơn hàng từ 400.000 VNĐ.',
            'Không áp dụng cho kính râm và phụ kiện.'
        ]
    },
    {
        id: 4,
        code: 'BDAYGIFT',
        title: 'Mừng Sinh Nhật - Quà Tặng Giảm 20%',
        description: 'Tháng sinh nhật thêm ý nghĩa với ưu đãi giảm 20%. HUNO Eyewear kính chúc quý khách an lành.',
        discountType: 'percent',
        discountValue: 20,
        minOrderValue: 300000,
        maxDiscount: 300000,
        expiryDate: '2025-12-31T23:59:59',
        totalQuantity: 999,
        usedQuantity: 215,
        imageUrl: '/src/resources/imagelayout/voucher4.jpg',
        category: 'birthday',
        conditions: [
            'Dành cho khách hàng có sinh nhật trong tháng.',
            'Đơn hàng tối thiểu 300.000 VNĐ.',
            'Mức giảm tối đa 300.000 VNĐ.',
            'Xác thực ngày sinh qua tài khoản.'
        ]
    },
    {
        id: 5,
        code: 'FREESHIP',
        title: 'Ưu Đãi Vận Chuyển - Miễn Phí Giao Hàng',
        description: 'Không lo phí ship, mua sắm thả ga. Miễn phí vận chuyển cho mọi đơn hàng từ 200.000 VNĐ.',
        discountType: 'shipping',
        discountValue: 40000,
        minOrderValue: 200000,
        maxDiscount: 40000,
        expiryDate: '2025-04-30T23:59:59',
        totalQuantity: 500,
        usedQuantity: 389,
        imageUrl: '/src/resources/imagelayout/voucher5.jpg',
        category: 'shipping',
        conditions: [
            'Đơn hàng tối thiểu 200.000 VNĐ.',
            'Áp dụng cho tất cả sản phẩm.',
            'Chỉ áp dụng khu vực nội thành.'
        ]
    },
    {
        id: 6,
        code: 'LENS20',
        title: 'Chăm Sóc Thị Lực - Giảm 20% Tròng Kính',
        description: 'Bảo vệ đôi mắt với tròng kính chống ánh sáng xanh, giảm ngay 20%. Áp dụng cho đơn hàng từ 600.000 VNĐ.',
        discountType: 'percent',
        discountValue: 20,
        minOrderValue: 600000,
        maxDiscount: 400000,
        expiryDate: '2025-06-30T23:59:59',
        totalQuantity: 200,
        usedQuantity: 56,
        imageUrl: '/src/resources/imagelayout/voucher6.jpg',
        category: 'lens',
        conditions: [
            'Áp dụng cho danh mục Tròng Kính.',
            'Đơn hàng từ 600.000 VNĐ.',
            'Mức giảm tối đa 400.000 VNĐ.',
            'Dành cho tròng kính chống ánh sáng xanh.'
        ]
    },
    {
        id: 7,
        code: 'MEMBER15',
        title: 'Ưu Đãi Thành Viên - Giảm 15% Cuối Tuần',
        description: 'Khách hàng thân thiết, ưu đãi đặc quyền. Giảm 15% khi mua sắm cuối tuần.',
        discountType: 'percent',
        discountValue: 15,
        minOrderValue: 800000,
        maxDiscount: 300000,
        expiryDate: '2025-07-31T23:59:59',
        totalQuantity: 300,
        usedQuantity: 127,
        imageUrl: '/src/resources/imagelayout/voucher7.jpg',
        category: 'member',
        conditions: [
            'Chỉ dành cho khách hàng thành viên.',
            'Đơn hàng tối thiểu 800.000 VNĐ.',
            'Mức giảm tối đa 300.000 VNĐ.',
            'Áp dụng Thứ 7 & Chủ Nhật.'
        ]
    },
    {
        id: 8,
        code: 'FLASH50',
        title: 'Săn Sale Chớp Nhoáng - Giảm 50%',
        description: 'Cơ hội vàng giảm 50% cho 10 khách hàng nhanh tay nhất. Số lượng có hạn, đừng bỏ lỡ!',
        discountType: 'percent',
        discountValue: 50,
        minOrderValue: 1500000,
        maxDiscount: 750000,
        expiryDate: '2025-04-25T12:00:00', // Thời gian cụ thể hơn cho Flash Sale
        totalQuantity: 10,
        usedQuantity: 9,
        imageUrl: '/src/resources/imagelayout/voucher8.jpg',
        category: 'flashsale',
        conditions: [
            'Giảm 50% cho 10 đơn hàng đầu tiên.',
            'Đơn hàng tối thiểu 1.500.000 VNĐ.',
            'Mức giảm tối đa 750.000 VNĐ.',
            'Áp dụng trong khung giờ Flash Sale.'
        ]
    }
];


// Danh sách categories cho filter (có thể điều chỉnh cho voucher categories nếu cần)
const voucherCategories = [
    'Tất cả',
    'new',
    'seasonal',
    'frame',
    'birthday',
    'shipping',
    'lens',
    'member',
    'flashsale'
];

const VoucherPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [featuredVouchers, setFeaturedVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [vouchersPerPage] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [copySuccess, setCopySuccess] = useState(false); // State for copy success message
    const [copiedCode, setCopiedCode] = useState(''); // State to track copied code

    // Giả lập API call để lấy dữ liệu (giữ nguyên logic mock data)
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setVouchers(mockVouchers);
            setFilteredVouchers(mockVouchers);
            setFeaturedVouchers(mockVouchers.filter(voucher => voucher.category === 'seasonal' || voucher.category === 'flashsale')); // Feature seasonal & flashsale vouchers
            setLoading(false);
        }, 1000);
    }, []);

    // Xử lý tìm kiếm và lọc (tương tự logic tìm kiếm blog, chỉ cần điều chỉnh field tìm kiếm)
    useEffect(() => {
        let results = [...vouchers];

        // Lọc theo từ khóa tìm kiếm (tìm kiếm trong title và description voucher)
        if (searchTerm) {
            results = results.filter(voucher =>
                voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) // Thêm tìm kiếm theo mã code
            );
        }

        // Lọc theo danh mục
        if (selectedCategory !== 'Tất cả') {
            results = results.filter(voucher => voucher.category === selectedCategory);
        }

        setFilteredVouchers(results);
        setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
    }, [searchTerm, selectedCategory, vouchers]);

    // Tính toán phân trang (giữ nguyên logic phân trang)
    const indexOfLastVoucher = currentPage * vouchersPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
    const currentVouchers = filteredVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

    // Xử lý thay đổi trang (giữ nguyên logic chuyển trang)
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Cuộn lên đầu trang khi chuyển trang
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Xử lý tìm kiếm (giữ nguyên logic tìm kiếm)
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // Xử lý chọn danh mục (giữ nguyên logic chọn category)
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    // Hàm copy mã voucher
    const copyToClipboard = (text, voucherCode) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setCopiedCode(voucherCode); // Set the copied voucher code
        message.success(`Mã ${voucherCode} đã được sao chép!`); // Show success message
        setTimeout(() => {
            setCopySuccess(false); // Reset copy success state after a delay
            setCopiedCode(''); // Reset copied code state
        }, 3000); // Message disappears after 3 seconds
    };


    const renderDiscount = (voucher) => {
        if (voucher.discountType === 'percent') {
            return <Statistic value={voucher.discountValue} suffix="%" prefix={<PercentageOutlined />} valueStyle={{ fontSize: 28 }} />;
        } else if (voucher.discountType === 'fixed') {
            return <Statistic value={voucher.discountValue} prefix="₫" valueStyle={{ fontSize: 28 }} />;
        } else if (voucher.discountType === 'shipping') {
            return (
                <Space direction="vertical" align="center">
                    <Statistic value="Miễn phí" valueStyle={{ fontSize: 28, color: '#52c41a' }} />
                    <Text type="secondary">Vận chuyển</Text>
                </Space>
            );
        }
        return null;
    };


    const renderExpiryStatus = (expiryDate) => {
        const expiry = moment(expiryDate);
        const now = moment();
        if (expiry.isBefore(now)) {
            return <Tag color="error">Đã hết hạn</Tag>;
        } else if (expiry.diff(now, 'days') <= 7) {
            return <Tag color="warning">Sắp hết hạn</Tag>;
        } else {
            return <Tag color="success">Còn hạn</Tag>;
        }
    };


    return (
        <Layout>
            <Content style={{ padding: '0 50px' }}>
                {/* Breadcrumb */}
                <div style={{ background: '#f0f2f5', padding: '16px 0' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                        <Breadcrumb separator=">" style={{ color: '#99703d' }}>
                            <Breadcrumb.Item ><Link to="/" style={{ color: '#99703d' }}>Trang chủ</Link></Breadcrumb.Item>
                            <Breadcrumb.Item style={{ color: '#71542d' }}>Ưu đãi</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>


                {/* Banner */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        height: '300px',
                        backgroundImage: 'url(src/resources/banner/web-02.webp)', // Thay banner blog bằng banner voucher
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
                        <Title level={2} style={{ color: 'white', marginBottom: 8, fontFamily: 'serif' }}>ƯU ĐÃI ĐẶC BIỆT</Title>
                        <Divider style={{ background: '#fff', height: 2, width: 80, margin: '12px auto' }} />
                        <Paragraph style={{ color: 'white', fontSize: 18, maxWidth: 800, lineHeight: '1.6', fontFamily: 'serif' }}>
                            Khám phá các chương trình khuyến mãi hấp dẫn nhất từ HUNO Eyewear. Đừng bỏ lỡ cơ hội sở hữu kính mắt hàng hiệu với giá ưu đãi!
                        </Paragraph>
                    </div>
                </div>

                {/* Main content */}
                <div style={{ maxWidth: 1200, margin: '20px auto', padding: '20px 16px' }}>
                    {/* Featured Vouchers */}
                    {loading ? (
                        <div style={{ marginBottom: 40 }}>
                            <Skeleton active paragraph={{ rows: 4 }} />
                        </div>
                    ) : featuredVouchers.length > 0 && (
                        <div style={{ marginBottom: 40 }}>
                            <Title level={3} style={{ marginBottom: 20, color: '#c0955b', fontFamily: 'serif' }}>ƯU ĐÃI NỔI BẬT</Title>
                            <Divider style={{ background: '#c0955b', height: 3, width: 60, marginLeft: 0, marginTop: 0 }} />

                            <Row gutter={[24, 24]}>
                                {featuredVouchers.slice(0, 3).map(voucher => (
                                    <Col xs={24} sm={24} md={8} key={voucher.id}>
                                        <Card
                                            hoverable
                                            cover={
                                                <div style={{ height: 200, overflow: 'hidden' }}>
                                                    <img
                                                        alt={voucher.title}
                                                        src={voucher.imageUrl}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            }
                                            className="voucher-card"
                                            style={{ border: '1px solid #e8e8e8', borderRadius: '8px', boxShadow: '2px 2px 5px rgba(0,0,0,0.05)' }}
                                        >
                                            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                                {renderDiscount(voucher)}
                                            </div>
                                            <Meta
                                                title={<Title level={4} style={{ margin: 0, fontFamily: 'serif', color: '#333' }}>{voucher.title}</Title>}
                                                description={<Paragraph style={{ color: '#666', fontFamily: 'serif' }}>{voucher.description}</Paragraph>}
                                            />
                                            <Divider dashed style={{ margin: '12px 0' }} />
                                            <Row justify="space-between" align="middle">
                                                <Col>
                                                    <Text type="secondary" style={{ fontFamily: 'serif' }}><CalendarOutlined /> Hết hạn: {moment(voucher.expiryDate).format('DD/MM/YYYY')}</Text>
                                                </Col>
                                                <Col>
                                                    {renderExpiryStatus(voucher.expiryDate)}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    {/* Filter Controls */}
                    <div style={{ marginBottom: 30 }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={24} md={8}>
                                <Title level={4} style={{ color: '#c0955b', fontFamily: 'serif' }}>TẤT CẢ ƯU ĐÃI</Title>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Search
                                    placeholder="Tìm kiếm ưu đãi..."
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    size="large"
                                    onSearch={handleSearch}
                                    style={{ fontFamily: 'serif' }}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Select
                                    style={{ width: '100%', fontFamily: 'serif' }}
                                    placeholder="Chọn danh mục"
                                    onChange={handleCategoryChange}
                                    defaultValue="Tất cả"
                                    size="large"
                                >
                                    {voucherCategories.map(category => (
                                        <Select.Option key={category} value={category} style={{ fontFamily: 'serif' }}>
                                            {category === 'Tất cả' ? 'Tất cả ưu đãi' : category}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                    </div>

                    {/* Voucher Grid */}
                    {loading ? (
                        <Row gutter={[24, 24]}>
                            {[...Array(6)].map((_, index) => (
                                <Col xs={24} sm={12} md={8} key={index}>
                                    <Card style={{ borderRadius: '8px' }}>
                                        <Skeleton active avatar paragraph={{ rows: 3 }} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : currentVouchers.length > 0 ? (
                        <Row gutter={[24, 24]}>
                            {currentVouchers.map(voucher => (
                                <Col xs={24} sm={12} md={8} key={voucher.id}>
                                    <Card
                                        className="voucher-card"
                                        style={{ border: '1px solid #e8e8e8', borderRadius: '8px', boxShadow: '2px 2px 5px rgba(0,0,0,0.05)' }}
                                    >
                                        <div style={{ padding: '20px', textAlign: 'center' }}>
                                            <div style={{ marginBottom: 12 }}>
                                                {renderDiscount(voucher)}
                                            </div>
                                            <Title level={5} style={{ margin: 0, fontFamily: 'serif', color: '#333' }}>{voucher.title}</Title>
                                            <Paragraph style={{ color: '#666', marginTop: 8, fontFamily: 'serif' }}>{voucher.description}</Paragraph>
                                        </div>

                                        <Divider style={{ margin: '16px 0' }} />

                                        <div style={{ padding: '0 20px' }}>
                                            <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                                                <Col>
                                                    <Text style={{ fontWeight: 'bold', color: '#333', fontFamily: 'serif' }}>Mã ưu đãi:</Text>
                                                </Col>
                                                <Col style={{ textAlign: 'right' }}>
                                                    <Tooltip title={copySuccess && copiedCode === voucher.code ? "Đã sao chép!" : "Sao chép mã"}>
                                                        <Button
                                                            type="primary"
                                                            icon={<CopyOutlined />}
                                                            size="small"
                                                            onClick={() => copyToClipboard(voucher.code, voucher.code)}
                                                            style={{ marginLeft: 8, fontFamily: 'serif' }}
                                                        >
                                                            {voucher.code}
                                                        </Button>
                                                    </Tooltip>
                                                </Col>
                                            </Row>

                                            <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                                                <Col>
                                                    <Text type="secondary" style={{ fontFamily: 'serif' }}><ClockCircleOutlined /> Hết hạn:</Text>
                                                </Col>
                                                <Col style={{ textAlign: 'right' }}>
                                                    <Text type="secondary" style={{ fontFamily: 'serif' }}>{moment(voucher.expiryDate).format('DD/MM/YYYY')}</Text>
                                                    {renderExpiryStatus(voucher.expiryDate)}
                                                </Col>
                                            </Row>

                                            <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                                                <Col>
                                                    <Text type="secondary" style={{ fontFamily: 'serif' }}><ShoppingOutlined /> Tối thiểu:</Text>
                                                </Col>
                                                <Col style={{ textAlign: 'right' }}>
                                                    <Text type="secondary" style={{ fontFamily: 'serif' }}>{voucher.minOrderValue.toLocaleString()}₫</Text>
                                                </Col>
                                            </Row>

                                            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                                                <Col>
                                                    <Text type="secondary" style={{ fontFamily: 'serif' }}><UserOutlined /> Sử dụng:</Text>
                                                </Col>
                                                <Col style={{ textAlign: 'right' }}>
                                                    <Text type="secondary" style={{ fontFamily: 'serif' }}>{voucher.usedQuantity}/{voucher.totalQuantity} lượt</Text>
                                                </Col>
                                            </Row>

                                            <Progress percent={(voucher.usedQuantity / voucher.totalQuantity) * 100} status="active" strokeColor="#c0955b" />


                                            {voucher.conditions && voucher.conditions.length > 0 && (
                                                <div style={{ marginTop: 20 }}>
                                                    <Divider dashed style={{ margin: '12px 0' }} />
                                                    <Tooltip title={
                                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                            {voucher.conditions.map((condition, index) => (
                                                                <li key={index} style={{ fontFamily: 'serif' }}>{condition}</li>
                                                            ))}
                                                        </ul>
                                                    }>
                                                        <Text style={{ color: '#c0955b', cursor: 'pointer', fontFamily: 'serif' }}><InfoCircleOutlined /> Điều kiện & Điều khoản</Text>
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty
                            description="Không tìm thấy ưu đãi phù hợp"
                            style={{ margin: '40px 0' }}
                        />
                    )}

                    {/* Pagination */}
                    {filteredVouchers.length > vouchersPerPage && (
                        <div style={{ textAlign: 'center', marginTop: 40 }}>
                            <Pagination
                                current={currentPage}
                                total={filteredVouchers.length}
                                pageSize={vouchersPerPage}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </div>
            </Content>

            {/* CSS Styles */}
            <style jsx>{`
                .voucher-card {
                    transition: all 0.3s;
                }
                .voucher-card:hover {
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
                    font-family: serif; /* Apply serif font to tags as well */
                }
                .ant-breadcrumb-separator {
                    color: #99703d; /* Style breadcrumb separator */
                }

            `}</style>
        </Layout>
    );
};

export default VoucherPage;
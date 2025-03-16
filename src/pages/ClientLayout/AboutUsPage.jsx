import React from 'react';
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Space,
    Divider,
    Button,
    Image,
    Carousel,
    Timeline,
    Statistic,
    Avatar,
    Breadcrumb,
    List,
    Tag,
    Tooltip
} from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    ClockCircleOutlined,
    CheckCircleFilled,
    TeamOutlined,
    ShopOutlined,
    StarFilled,
    HeartFilled,
    TrophyOutlined,
    LinkedinOutlined,
    FacebookOutlined,
    InstagramOutlined,
    EyeOutlined,
    VerifiedOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card; //Import Meta from Card

const AboutUsPage = () => {
    // Hình ảnh mô phỏng
    const storeImages = [
        'src/resources/imagelayout/anh_cuahang1.webp',
        'src/resources/imagelayout/anhcuahang2.jpg',
        'src/resources/imagelayout/banner4.png',
    ];

    // Đội ngũ nhân viên
    const teamMembers = [
        {
            name: 'Nguyễn Văn An',
            position: 'Nhà sáng lập & CEO',
            avatar: 'https://images.unsplash.com/photo-1564564244674-741c164bb771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1972&q=80',
            bio: 'Với hơn 15 năm kinh nghiệm trong ngành kính mắt và đam mê về thị giác, anh An đã sáng lập LilyAnna với mong muốn mang đến những sản phẩm kính mắt chất lượng cho người Việt Nam.',
            social: {
                facebook: '#',
                instagram: '#',
                linkedin: '#'
            }
        },
        {
            name: 'Lê Thị Bích',
            position: 'Giám đốc sản phẩm',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80',
            bio: 'Chị Bích chịu trách nhiệm về việc lựa chọn các sản phẩm chất lượng cao từ các thương hiệu quốc tế và trong nước. Với con mắt thẩm mỹ tinh tế, chị luôn biết được xu hướng thời trang kính mắt mới nhất.',
            social: {
                facebook: '#',
                instagram: '#',
                linkedin: '#'
            }
        },
        {
            name: 'Trần Minh Hiếu',
            position: 'Bác sĩ nhãn khoa',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            bio: 'Bác sĩ Hiếu tốt nghiệp chuyên ngành Nhãn khoa tại Đại học Y Hà Nội và có hơn 10 năm kinh nghiệm trong lĩnh vực khám và điều trị các vấn đề về mắt.',
            social: {
                facebook: '#',
                instagram: '#',
                linkedin: '#'
            }
        },
        {
            name: 'Phạm Thu Hà',
            position: 'Quản lý cửa hàng',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            bio: 'Với tinh thần nhiệt huyết và thân thiện, chị Hà luôn đảm bảo mọi khách hàng đến với LilyAnna đều nhận được sự tư vấn và phục vụ tốt nhất.',
            social: {
                facebook: '#',
                instagram: '#',
                linkedin: '#'
            }
        }
    ];

    // Lịch sử phát triển
    const historyItems = [
        {
            year: 2010,
            title: 'Thành lập LilyAnna',
            description: 'Cửa hàng đầu tiên được mở tại Hà Nội với diện tích khiêm tốn 30m².'
        },
        {
            year: 2013,
            title: 'Mở rộng chi nhánh',
            description: 'Khai trương chi nhánh thứ hai tại Thành phố Hồ Chí Minh.'
        },
        {
            year: 2015,
            title: 'Hợp tác quốc tế',
            description: 'Trở thành đối tác phân phối chính thức của các thương hiệu kính mắt quốc tế.'
        },
        {
            year: 2018,
            title: 'Ra mắt thương hiệu riêng',
            description: 'Thành lập dòng sản phẩm kính mắt mang thương hiệu LilyAnna.'
        },
        {
            year: 2020,
            title: 'Mở rộng kênh bán hàng',
            description: 'Phát triển website thương mại điện tử và mở rộng mạng lưới đại lý trên toàn quốc.'
        },
        {
            year: 2023,
            title: 'Kỷ niệm 13 năm thành lập',
            description: 'Vượt mốc 10 cửa hàng trên toàn quốc với hơn 100,000 khách hàng thân thiết.'
        }
    ];

    // Các con số ấn tượng
    const statistics = [
        {
            title: 'Khách hàng',
            value: '100,000+',
            icon: <TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        },
        {
            title: 'Sản phẩm',
            value: '5,000+',
            icon: <ShopOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        },
        {
            title: 'Đánh giá 5 sao',
            value: '95%',
            icon: <StarFilled style={{ fontSize: 24, color: '#1890ff' }} />
        },
        {
            title: 'Cửa hàng',
            value: '10+',
            icon: <EnvironmentOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        }
    ];

    // Các giá trị cốt lõi
    const coreValues = [
        {
            title: 'Chất lượng hàng đầu',
            description: 'Tất cả sản phẩm kính mắt đều được chọn lọc kỹ lưỡng và kiểm tra chất lượng nghiêm ngặt.',
            icon: <TrophyOutlined style={{ fontSize: 40, color: '#1890ff' }} />
        },
        {
            title: 'Dịch vụ chăm sóc tận tâm',
            description: 'Đội ngũ nhân viên được đào tạo chuyên nghiệp, luôn sẵn sàng tư vấn và hỗ trợ khách hàng.',
            icon: <HeartFilled style={{ fontSize: 40, color: '#1890ff' }} />
        },
        {
            title: 'Giá cả hợp lý',
            description: 'Cam kết mang đến sản phẩm chất lượng với mức giá phù hợp nhất cho người tiêu dùng.',
            icon: <CheckCircleFilled style={{ fontSize: 40, color: '#1890ff' }} />
        }
    ];

    // Thông tin liên hệ
    const contactInfo = [
        {
            icon: <EnvironmentOutlined style={{ fontSize: 20 }} />,
            title: 'Địa chỉ',
            content: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'
        },
        {
            icon: <PhoneOutlined style={{ fontSize: 20 }} />,
            title: 'Hotline',
            content: '1900 123 456'
        },
        {
            icon: <MailOutlined style={{ fontSize: 20 }} />,
            title: 'Email',
            content: 'contact@lilyanna.com'
        },
        {
            icon: <ClockCircleOutlined style={{ fontSize: 20 }} />,
            title: 'Giờ mở cửa',
            content: '8:00 - 21:00 (Tất cả các ngày trong tuần)'
        }
    ];

    return (
        <Layout>
            <Content>
                {/* Breadcrumb */}
                <div style={{ background: '#f0f2f5', padding: '16px 0' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
                        <Breadcrumb>
                            <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                            <Breadcrumb.Item>Giới thiệu</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>

                {/* Banner */}
                <div style={{ position: 'relative' }}>
                    <Image
                        preview={false}
                        src="src/resources/imagelayout/banner1.webp"
                        alt="Về LilyAnna"
                        style={{ width: '100%', height: '400px', objectFit: 'cover', filter: 'brightness(0.8)' }}
                    />
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
                        <Title style={{ color: 'white', marginBottom: 8 }}>Chào mừng đến với LilyAnna - Thế giới Kính Mắt Thời Trang</Title>
                        <Divider style={{ background: '#fff', height: 2, width: 80, margin: '12px auto' }} />
                        <Paragraph style={{ color: 'white', fontSize: 18, maxWidth: 800, lineHeight: '1.6' }}>
                            Khám phá bộ sưu tập kính mắt đa dạng, từ gọng kính cận thanh lịch đến kính râm thời thượng, được thiết kế để tôn vinh vẻ đẹp và bảo vệ đôi mắt của bạn.
                        </Paragraph>
                    </div>
                </div>

                {/* Giới thiệu chung */}
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 16px' }}>
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} sm={24} md={12}>
                            <Title level={2}>CHÚNG TÔI LÀ AI</Title>
                            <Divider style={{ background: '#1890ff', height: 3, width: 60, marginLeft: 0 }} />
                            <Paragraph style={{ fontSize: 16, lineHeight: '1.8', textAlign: 'justify' }}>
                                LilyAnna là thương hiệu kính mắt hàng đầu Việt Nam, được thành lập từ năm 2010 với mong muốn mang đến cho khách hàng những sản phẩm kính mắt chất lượng cao, đa dạng về mẫu mã và phù hợp với nhiều phong cách khác nhau.
                            </Paragraph>
                            <Paragraph style={{ fontSize: 16, lineHeight: '1.8', textAlign: 'justify' }}>
                                Với đội ngũ chuyên gia giàu kinh nghiệm và hệ thống cửa hàng hiện đại, LilyAnna cam kết mang đến cho khách hàng trải nghiệm mua sắm tốt nhất, từ khâu tư vấn, chọn lựa sản phẩm đến dịch vụ hậu mãi chu đáo.
                            </Paragraph>
                            <Button type="primary" size="large">Xem các sản phẩm</Button>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Image
                                src="src/resources/imagelayout/1-1.jpeg"
                                alt="LilyAnna store"
                                style={{ borderRadius: 8, boxShadow: '0 8px 16px rgba(0,0,0,0.1)', width: '100%', objectFit: 'cover', height: 400 }}
                            />
                        </Col>
                    </Row>
                </div>

                {/* Tầm nhìn & Sứ mệnh */}
                <div style={{ background: '#f5f5f5', padding: '60px 16px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Row gutter={[48, 48]} justify="center">
                            <Col xs={24} sm={24} md={12}>
                                <Card bordered={false} style={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: 'transparent', textAlign: 'center' }}>
                                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                        <EyeOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                                    </div>
                                    <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>TẦM NHÌN</Title>
                                    <Paragraph style={{ fontSize: 16, lineHeight: '1.8', textAlign: 'justify' }}>
                                        Trở thành người bạn đồng hành tin cậy của mọi khách hàng trong việc chăm sóc và bảo vệ đôi mắt, mang đến sự tự tin và phong cách riêng thông qua những sản phẩm kính mắt chất lượng và thời trang.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                                <Card bordered={false} style={{ height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: 'transparent', textAlign: 'center' }}>
                                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                        <CustomerServiceOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                                    </div>
                                    <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>SỨ MỆNH</Title>
                                    <Paragraph style={{ fontSize: 16, lineHeight: '1.8', textAlign: 'justify' }}>
                                        Cung cấp các sản phẩm kính mắt chính hãng, đa dạng về mẫu mã, đảm bảo chất lượng và giá cả hợp lý. Mang đến dịch vụ tư vấn chuyên nghiệp, tận tâm và chu đáo, giúp khách hàng lựa chọn được sản phẩm phù hợp nhất.
                                    </Paragraph>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Các con số ấn tượng */}
                <div style={{ padding: '60px 16px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                        <Title level={2} style={{ marginBottom: 24 }}>CÁC CON SỐ ẤN TƯỢNG</Title>
                        <Divider style={{ background: '#1890ff', height: 3, width: 60, margin: '12px auto' }} />
                        <Row gutter={[48, 48]} justify="center">
                            {statistics.map((item, index) => (
                                <Col xs={12} sm={12} md={6} key={index}>
                                    <Statistic
                                        title={item.title}
                                        value={item.value}
                                        prefix={item.icon}
                                        style={{ textAlign: 'center' }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* Giá trị cốt lõi */}
                <div style={{ background: '#f5f5f5', padding: '60px 16px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>GIÁ TRỊ CỐT LÕI</Title>
                        <Row gutter={[48, 48]} justify="center">
                            {coreValues.map((value, index) => (
                                <Col xs={24} sm={12} md={8} key={index}>
                                    <Card bordered={false} style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: 'transparent' }}>
                                        {value.icon}
                                        <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>{value.title}</Title>
                                        <Paragraph style={{ lineHeight: '1.6', textAlign: 'justify' }}>{value.description}</Paragraph>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* Đội ngũ nhân viên */}
                <div style={{ padding: '60px 16px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>ĐỘI NGŨ CỦA CHÚNG TÔI</Title>
                        <Row gutter={[32, 32]} justify="center">
                            {teamMembers.map((member, index) => (
                                <Col xs={24} sm={12} md={6} key={index}>
                                    <Card
                                        style={{ textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: 'transparent' }}
                                        cover={
                                            <Image
                                                alt={member.name}
                                                src={member.avatar}
                                                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                                            />
                                        }
                                    >
                                        <Meta
                                            title={member.name}
                                            description={
                                                <>
                                                    <Text type="secondary">{member.position}</Text>
                                                    <Paragraph style={{ textAlign: 'left', marginTop: 8 }}>{member.bio}</Paragraph>
                                                    <Space size="middle">
                                                        <Tooltip title="Facebook">
                                                            <a href={member.social.facebook} target="_blank" rel="noopener noreferrer">
                                                                <FacebookOutlined style={{ fontSize: 20 }} />
                                                            </a>
                                                        </Tooltip>
                                                        <Tooltip title="Instagram">
                                                            <a href={member.social.instagram} target="_blank" rel="noopener noreferrer">
                                                                <InstagramOutlined style={{ fontSize: 20 }} />
                                                            </a>
                                                        </Tooltip>
                                                        <Tooltip title="LinkedIn">
                                                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                                                                <LinkedinOutlined style={{ fontSize: 20 }} />
                                                            </a>
                                                        </Tooltip>
                                                    </Space>
                                                </>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>

                {/* Lịch sử phát triển */}
                <div style={{ background: '#f5f5f5', padding: '60px 16px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>LỊCH SỬ PHÁT TRIỂN</Title>
                        <Timeline mode="alternate">
                            {historyItems.map((item, index) => (
                                <Timeline.Item key={index} label={item.year}>
                                    <Title level={4}>{item.title}</Title>
                                    <Paragraph>{item.description}</Paragraph>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </div>
                </div>

                {/* Thông tin liên hệ */}
                <div style={{ padding: '60px 16px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>LIÊN HỆ</Title>
                        <List
                            itemLayout="horizontal"
                            dataSource={contactInfo}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={item.icon}
                                        title={item.title}
                                        description={item.content}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </div>

                {/* Store Images Carousel */}
                <div style={{ padding: '60px 16px', background: '#f0f2f5' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>HÌNH ẢNH CỬA HÀNG</Title>
                        <Carousel autoplay>
                            {storeImages.map((image, index) => (
                                <div key={index}>
                                    <Image
                                        src={image}
                                        alt={`Cửa hàng LilyAnna ${index + 1}`}
                                        style={{ width: '100%', maxHeight: 500, objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default AboutUsPage;
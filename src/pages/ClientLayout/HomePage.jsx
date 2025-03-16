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
  List
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

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Content } = Layout;

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState([
    {
      id: 1,
      name: 'Kính mắt thời trang LilyAnna TF001',
      price: 750000,
      oldPrice: 950000,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.8,
      reviews: 120,
      discount: 25
    },
    {
      id: 2,
      name: 'Kính mắt gọng kim loại LilyAnna M220',
      price: 850000,
      oldPrice: 1050000,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.7,
      reviews: 98,
      discount: 20
    },
    {
      id: 3,
      name: 'Kính râm thời trang LilyAnna S110',
      price: 650000,
      oldPrice: 800000,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.9,
      reviews: 135,
      discount: 18
    },
    {
      id: 4,
      name: 'Kính mắt gọng nhựa LilyAnna P440',
      price: 550000,
      oldPrice: 700000,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.6,
      reviews: 87,
      discount: 22
    },
  ]);

  const [newArrivals, setNewArrivals] = useState([
    {
      id: 5,
      name: 'Kính mắt cao cấp LilyAnna Elite E001',
      price: 1250000,
      oldPrice: null,
      image: 'https://via.placeholder.com/300x200',
      rating: 5.0,
      reviews: 23,
      discount: null,
      new: true
    },
    {
      id: 6,
      name: 'Kính mắt chống ánh sáng xanh LilyAnna B350',
      price: 950000,
      oldPrice: null,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.9,
      reviews: 19,
      discount: null,
      new: true
    },
    {
      id: 7,
      name: 'Kính mắt gọng titan LilyAnna T220',
      price: 1550000,
      oldPrice: null,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.8,
      reviews: 14,
      discount: null,
      new: true
    },
    {
      id: 8,
      name: 'Kính râm phân cực LilyAnna P180',
      price: 1150000,
      oldPrice: null,
      image: 'https://via.placeholder.com/300x200',
      rating: 4.7,
      reviews: 12,
      discount: null,
      new: true
    },
  ]);

  const [categories, setCategories] = useState([
    {
      title: 'Kính mắt thời trang',
      image: 'https://via.placeholder.com/200x200',
      count: 120
    },
    {
      title: 'Kính râm',
      image: 'https://via.placeholder.com/200x200',
      count: 85
    },
    {
      title: 'Kính mắt trẻ em',
      image: 'https://via.placeholder.com/200x200',
      count: 45
    },
    {
      title: 'Gọng kính',
      image: 'https://via.placeholder.com/200x200',
      count: 98
    },
    {
      title: 'Tròng kính',
      image: 'https://via.placeholder.com/200x200',
      count: 76
    },
    {
      title: 'Phụ kiện',
      image: 'https://via.placeholder.com/200x200',
      count: 52
    },
  ]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
  };

  const ProductCard = ({ product }) => (
    <Badge.Ribbon
      text={product.discount ? `${product.discount}% GIẢM` : product.new ? 'MỚI' : ''}
      color={product.discount ? 'red' : 'blue'}
      style={{ display: product.discount || product.new ? 'block' : 'none' }}
    >
      <Card
        hoverable
        cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: 'cover' }} />}
        actions={[
          <Button type="link" icon={<ShoppingOutlined />}>Thêm vào giỏ</Button>,
          <Button type="link" icon={<HeartOutlined />}>Yêu thích</Button>
        ]}
      >
        <Meta
          title={product.name}
          description={
            <Space direction="vertical" size="small">
              <Space>
                {product.oldPrice && <Text delete type="secondary">{product.oldPrice.toLocaleString('vi-VN')}đ</Text>}
                <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>{product.price.toLocaleString('vi-VN')}đ</Text>
              </Space>
              <Space>
                <StarFilled style={{ color: '#fadb14' }} />
                <Text>{product.rating}/5</Text>
                <Text type="secondary">({product.reviews} đánh giá)</Text>
              </Space>
            </Space>
          }
        />
      </Card>
    </Badge.Ribbon>
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
      // image: 'https://via.placeholder.com/1200x500'
      image: 'src/resources/imagelayout/banner1.webp'
    },
    {
      title: 'Giảm Giá Lên Đến 30%',
      subtitle: 'Cho tất cả sản phẩm kính mắt thời trang',
      // image: 'https://via.placeholder.com/1200x500'
      image: 'src/resources/imagelayout/banner2.jpg'
    },
    {
      title: 'Chương Trình Khám Mắt Miễn Phí',
      subtitle: 'Khi mua kính tại LilyAnna',
      // image: 'https://via.placeholder.com/1200x500'
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

            <Row gutter={[24, 24]}>
              {categories.map((category, index) => (
                <Col xs={12} sm={8} md={4} key={index}>
                  <Card
                    hoverable
                    cover={<img alt={category.title} src={category.image} />}
                    bodyStyle={{ padding: '12px', textAlign: 'center' }}
                  >
                    <Text strong>{category.title}</Text>
                    <br />
                    <Text type="secondary">{category.count} sản phẩm</Text>
                  </Card>
                </Col>
              ))}
            </Row>
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
              <Button type="link">
                Xem tất cả <RightOutlined />
              </Button>
            </div>

            <Row gutter={[24, 24]}>
              {bestSellers.map(product => (
                <Col xs={24} sm={12} md={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
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
            <Button type="primary" size="large">Xem ngay</Button>
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
              <Button type="link">
                Xem tất cả <RightOutlined />
              </Button>
            </div>

            <Row gutter={[24, 24]}>
              {newArrivals.map(product => (
                <Col xs={24} sm={12} md={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
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
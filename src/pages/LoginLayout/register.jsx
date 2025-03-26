import React, { useState } from 'react';
import { Layout, Form, Input, Button, Typography, message, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPI } from '../../services/api.auth';

const { Content } = Layout;
const { Title } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        // Kiểm tra tính hợp lệ của dữ liệu đầu vào
        if (!values.email || !values.password || !values.username || !values.firstName || !values.lastName || !values.phone) {
            message.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const response = await registerAPI(
                values.username,
                values.email,
                values.password,
                values.firstName,
                values.lastName,
                values.phone,
                values.address
            );
            
            // Kiểm tra phản hồi một cách chặt chẽ hơn
            if (response?.data) {
                message.success(response.data.message || "Đăng ký thành công!");
                navigate('/login');
            } else {
                message.error("Đăng ký thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            // Xử lý lỗi chi tiết hơn
            const errorMessage = error.response?.data?.message 
                || error.message 
                || "Đã xảy ra lỗi khi đăng ký";
            
            message.error(errorMessage);
            console.error('Đăng ký error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Content style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh', 
                padding: '50px' 
            }}>
                <Card style={{ 
                    width: '100%', 
                    maxWidth: 500,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                }}>
                    <Title level={2} style={{ 
                        textAlign: 'center', 
                        marginBottom: 24,
                        color: '#1890ff'  // Màu nhấn 
                    }}>
                        Đăng ký
                    </Title>
                    <Form
                        name="register_form"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' }, 
                                { type: 'email', message: 'Định dạng email không hợp lệ!' }
                            ]}
                        >
                            <Input 
                                prefix={<MailOutlined className="site-form-item-icon" />} 
                                placeholder="Email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
                        >
                            <Input 
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Tên người dùng"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' }, 
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Mật khẩu"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="firstName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input 
                                placeholder="Tên" 
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="lastName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                        >
                            <Input 
                                placeholder="Họ" 
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input 
                                prefix={<PhoneOutlined className="site-form-item-icon" />} 
                                placeholder="Số điện thoại"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="address"
                        >
                            <Input 
                                placeholder="Địa chỉ (không bắt buộc)" 
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                style={{ width: '100%' }}
                                size="large"
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div style={{ 
                            textAlign: 'center', 
                            marginTop: 16,
                            color: 'rgba(0,0,0,0.65)' 
                        }}>
                            Đã có tài khoản? <Link to="/login">Đăng nhập ngay!</Link>
                        </div>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default RegisterPage;
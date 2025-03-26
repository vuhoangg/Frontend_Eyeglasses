import React, { useState } from 'react';
import { Layout, Form, Input, Button, Typography, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI } from '../../services/api.auth';

const { Content } = Layout;
const { Title } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        // Validate input
        if (!values.email || !values.password) {
            message.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const response = await loginAPI(values.email, values.password);
            
            // More robust response checking
            if (response?.data?.token) {
                // Success scenario
                message.success(response.data.message || "Đăng nhập thành công");

                // Store user data securely
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify({
                    username: response.data.username || '',
                    email: values.email,
                    role: response.data.role || 'user'
                }));

                // Navigate to home page
                navigate('/', { replace: true });
            } else {
                // Handle unexpected response structure
                message.error("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
            }
        } catch (error) {
            // More detailed error handling
            const errorMessage = error.response?.data?.message 
                || error.message 
                || "Đã xảy ra lỗi khi đăng nhập";
            
            message.error(errorMessage);
            console.error('Login error:', error);
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
                    maxWidth: 400,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                }}>
                    <Title level={2} style={{ 
                        textAlign: 'center', 
                        marginBottom: 24,
                        color: '#1890ff'  // Accent color
                    }}>
                        Đăng nhập
                    </Title>
                    <Form
                        name="login_form"
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
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="Email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Mật khẩu"
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
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div style={{ 
                            textAlign: 'center', 
                            marginTop: 16,
                            color: 'rgba(0,0,0,0.65)' 
                        }}>
                            Chưa có tài khoản? <Link to="/register">Đăng ký ngay!</Link>
                        </div>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default LoginPage;
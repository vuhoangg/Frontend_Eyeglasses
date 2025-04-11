// LoginPage.jsx
import React, { useState } from 'react';
import { Layout, Form, Input, Button, Typography, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI } from '../../services/api.auth';
import * as jwt_decode from 'jwt-decode';
import { fetchAllCartItemsAPI } from '../../services/api.cartItems';

const { Content } = Layout;
const { Title } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const reloadApp = () => {
        window.location.reload(true);
    };

    const onFinish = async (values) => {
        if (!values.email || !values.password) {
            message.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const response = await loginAPI(values.email, values.password);

            if (response?.data?.token) {
                const decodedToken = jwt_decode.jwtDecode(response.data.token);
                const userId = decodedToken.userId;
                const userRole = Array.isArray(response.data.role) ? response.data.role[0] : response.data.role;


                message.success(response.data.message || "Đăng nhập thành công");

                localStorage.setItem('access_token', response.data.token);
                localStorage.setItem('userData', JSON.stringify({
                    username: response.data.username || '',
                    email: values.email,
                    phone: response.data.phone || '',
                    role: userRole || 'user',
                    id: userId
                }));

                await fetchCartItems(userId);

                if (userRole === 'customer') {
                    navigate('/', { replace: true });
                } else if (userRole === 'admin' || userRole === 'staff') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }

                setTimeout(() => {
                    reloadApp();
                }, 100);
            } else {
                message.error("Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message
                || error.message
                || "Đã xảy ra lỗi khi đăng nhập";

            message.error(errorMessage);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCartItems = async (userId) => {
        try {
            const response = await fetchAllCartItemsAPI(1, 100, userId);

            if (response && response.data && response.data.data) {
                localStorage.setItem('cartItems', JSON.stringify(response.data.data));
            } else {
                localStorage.setItem("cartItems", JSON.stringify([]));
                message.info("Không có sản phẩm nào trong giỏ hàng.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin giỏ hàng:", error);
            message.error("Có lỗi xảy ra khi tải lại giỏ hàng.");
            localStorage.setItem("cartItems", JSON.stringify([]));
        }
    };

    return (
        <Layout>
            <Content style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                padding: '20px' // Reduced padding
            }}>
                <Card style={{
                    width: '100%',
                    maxWidth: 350, // Slightly smaller max width
                    // boxShadow: '0 0 0 rgba(0,0,0,0)', // Removed shadow
                }}>
                    <Title level={3} style={{ // Reduced title level and styling
                        textAlign: 'center',
                        marginBottom: 16, // Reduced margin
                        // color: '#1890ff' // Removed accent color
                    }}>
                        Đăng nhập hệ thống
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
                                size="middle" // Reduced input size
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
                                size="middle" // Reduced input size
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                style={{ width: '100%' }}
                                size="middle" // Reduced button size
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>

                        <div style={{
                            textAlign: 'center',
                            marginTop: 12, // Reduced margin
                            color: 'rgba(0,0,0,0.65)'
                        }}>
                            <Link to="/register">Đăng ký tài khoản</Link>
                        </div>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};

export default LoginPage;
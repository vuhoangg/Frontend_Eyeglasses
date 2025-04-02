// LoginPage.jsx
import React, { useState } from 'react';
import { Layout, Form, Input, Button, Typography, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { loginAPI } from '../../services/api.auth';
import * as jwt_decode from 'jwt-decode'; // Sửa cách import
import { fetchAllCartItemsAPI } from '../../services/api.cartItems'; // Import API

const { Content } = Layout;
const { Title } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const reloadApp = () => {
        // Xóa cache của trình duyệt
        window.location.reload(true);
    };

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
                // Giải mã token để lấy userId
                const decodedToken = jwt_decode.jwtDecode(response.data.token);
                const userId = decodedToken.userId;

                // Success scenario
                message.success(response.data.message || "Đăng nhập thành công");

                // Store user data securely
                localStorage.setItem('access_token', response.data.token);
                localStorage.setItem('userData', JSON.stringify({
                    username: response.data.username || '',
                    email: values.email,
                    phone: response.data.phone || '',
                    role: response.data.role || 'user',
                    id: userId
                }));

                // Lấy và lưu cartItems từ backend
                await fetchCartItems(userId);

                // Chuyển hướng đến trang chủ và reload toàn bộ ứng dụng
                navigate('/', { replace: true });
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
              // Gọi API để lấy thông tin giỏ hàng từ backend
              const response = await fetchAllCartItemsAPI(1, 100, userId); // Thay cartId bằng userId (nếu backend trả về giỏ hàng theo userId)

              if (response && response.data && response.data.data) {
                  // Lưu thông tin giỏ hàng vào localStorage
                  localStorage.setItem('cartItems', JSON.stringify(response.data.data));
                //    message.success("Đã tải lại giỏ hàng từ hệ thống.");
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
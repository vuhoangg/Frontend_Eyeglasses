// ChangePassword.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Typography, notification } from "antd";
import { changePasswordAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ChangePassword = () => {
    const [user, setUser] = useState(null);
    const [form] = Form.useForm();
    const [loadingPassword, setLoadingPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            setUser(parsedUserData);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleChangePassword = async (values) => {
        try {
            setLoadingPassword(true);

            if (!user || !user.id) {
                message.error("Không tìm thấy thông tin người dùng để đổi mật khẩu.");
                setLoadingPassword(false);
                return;
            }

            const response = await changePasswordAPI(user.id, values.oldPassword, values.newPassword);

            if (response && (response.statusCode === 200 || response.status === 200)) {
                notification.success({
                    message: "Đổi mật khẩu thành công",
                    description: "Bạn đã đổi mật khẩu thành công. Vui lòng đăng nhập lại."
                });
                form.resetFields(); // Clear password form after success
                localStorage.clear(); // Clear localStorage
                navigate('/login'); // Redirect to login page
            } else {
                const errorMsg = response?.message || response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
                message.error(errorMsg);
            }
        } catch (error) {
            if (error.name === 'ValidateError') {
                message.warning('Vui lòng kiểm tra lại thông tin mật khẩu.');
            } else if (error.response && error.response.status === 401) {
                message.error('Mật khẩu cũ không đúng.');
            }
            else {
                console.error("Lỗi khi đổi mật khẩu:", error);
                const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.';
                message.error(errorMsg);
            }
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Card title={<Title level={3}>Đổi mật khẩu</Title>}>
                {user ? (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleChangePassword}
                    >
                        <Form.Item
                            name="oldPassword"
                            label="Mật khẩu cũ"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                        >
                            <Input.Password placeholder="Mật khẩu cũ" />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu mới" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loadingPassword}>
                                Đổi Mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <p>Đang tải thông tin tài khoản...</p>
                )}
            </Card>
        </div>
    );
};

export default ChangePassword;
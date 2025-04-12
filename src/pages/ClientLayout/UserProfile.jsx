// UserProfile.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Typography, Row, Col, Avatar, Divider, Descriptions, Space, Spin, notification } from "antd";
import { updateUserAPI, handleUploadFile, fetchUserByIdAPI } from "../../services/api.service"; // Import fetchUserByIdAPI
import { useNavigate } from "react-router-dom";
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, UploadOutlined, SaveOutlined, InfoCircleOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [form] = Form.useForm();
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [initialAvatar, setInitialAvatar] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const userId = parsedUserData.id; // Get user ID from localStorage data

            const fetchUserData = async () => {
                try {
                    const res = await fetchUserByIdAPI(userId);
                    if (res.data) {
                        const fetchedUser = res.data;
                        console.log(" User ", fetchedUser)
                        setUser(fetchedUser);
                        form.setFieldsValue(fetchedUser);
                        const avatarUrl = `http://localhost:8082/images/user/${fetchedUser.avartar}`;
                        setPreview(avatarUrl);
                        setInitialAvatar(avatarUrl);
                    } else {
                        message.error("Không thể tải thông tin người dùng.");
                    }
                } catch (error) {
                    console.error("Lỗi khi tải thông tin người dùng:", error);
                    message.error("Lỗi khi tải thông tin người dùng.");
                    navigate('/login'); // Redirect to login if fetch fails
                }
            };

            fetchUserData();

        } else {
            navigate('/login');
        }
    }, [form, navigate]);

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleUpdateUserAvatar = async () => {
        if (!selectedFile) {
            message.warning("Vui lòng chọn ảnh đại diện mới.");
            return;
        }
        try {
            setUploadLoading(true);
            const resUpload = await handleUploadFile(selectedFile, "user");
            setUploadLoading(false);
            if (resUpload.data) {
                const newAvatar = resUpload.data.fileName;
                const resUpdateAvatar = await updateUserAPI(
                    user.id,
                    user.username,
                    user.email,
                    user.phone,
                    user.firstName,
                    user.lastName,
                    user.address,
                    newAvatar,
                  
                );

                if (resUpdateAvatar.data) {
                    const updatedUserData = {
                        ...user,
                        avartar: newAvatar
                    };
                    setUser(updatedUserData);
                    localStorage.setItem("userData", JSON.stringify(updatedUserData));
                    setInitialAvatar(`http://localhost:8082/images/user/${newAvatar}`); // Update initial avatar URL
                    setPreview(`http://localhost:8082/images/user/${newAvatar}`); // Update preview to new avatar after save
                    setSelectedFile(null);
                    notification.success({
                        message: "Cập nhật avatar",
                        description: "Avatar người dùng đã được cập nhật thành công"
                    });
                } else {
                    notification.error({
                        message: "Lỗi cập nhật",
                        description: "Không thể cập nhật avatar người dùng"
                    });
                }
            }
        } catch (error) {
            setUploadLoading(false);
            notification.error({
                message: "Lỗi cập nhật",
                description: error.message || "Đã xảy ra lỗi khi cập nhật avatar"
            });
        }
    };


    const handleUpdateProfile = async () => {
        try {
            const values = await form.validateFields();
            setLoadingUpdate(true);

            if (!user || !user.id) {
                message.error("Không tìm thấy thông tin người dùng để cập nhật.");
                setLoadingUpdate(false);
                return;
            }

            const avatarFileName = user.avartar; // Avatar is handled separately

            const response = await updateUserAPI(
                user.id,
                values.username,
                values.email,
                values.phone,
                values.firstName || '',
                values.lastName || '',
                values.address || '',
                avatarFileName, // Keep current avatar, avatar update is separate
               
            );

            if (response && (response.statusCode === 200 || response.status === 200)) {
                message.success("Cập nhật tài khoản thành công");
                const updatedUserData = {
                    ...user,
                    username: values.username,
                    email: values.email,
                    phone: values.phone,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    address: values.address,
                };
                localStorage.setItem("userData", JSON.stringify(updatedUserData));
                setUser(updatedUserData);

            } else {
                const errorMsg = response?.message || response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản';
                message.error(errorMsg);
            }
        } catch (error) {
            if (error.name === 'ValidateError') {
                message.warning('Vui lòng kiểm tra lại thông tin.');
            } else {
                console.error("Lỗi khi cập nhật tài khoản:", error);
                const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại.';
                message.error(errorMsg);
            }
        } finally {
            setLoadingUpdate(false);
        }
    };

    const uploadButton = (
        <div>
            {uploadLoading ? <Spin spinning={uploadLoading} size="small" /> : <UploadOutlined />}
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            {user ? (
                <Row gutter={[24, 24]}>
                    <Col span={10}>
                        <Card bordered={false}>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <Avatar
                                    size={150}
                                    src={preview}
                                    icon={<UserOutlined />}
                                    onError={() => setPreview(initialAvatar)}
                                />
                                <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>
                                    {user.username}
                                </Title>
                                <Text type="secondary">
                                    {user.firstName} {user.lastName}
                                </Text>
                                <Divider />

                                <div style={{ marginTop: '15px' }}>
                                    <label
                                        htmlFor="btnUpload"
                                        style={{
                                            display: "inline-block",
                                            padding: "8px 16px",
                                            background: "#1890ff",
                                            color: "white",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            transition: "all 0.3s"
                                        }}
                                    >
                                        <UploadOutlined style={{ marginRight: 8 }} /> Tải ảnh đại diện mới
                                        <input
                                            hidden
                                            id="btnUpload"
                                            type="file"
                                            onChange={(event) => handleOnChangeFile(event)}
                                            // accept="image/png, image/jpeg"
                                        />
                                    </label>
                                </div>

                                {preview && selectedFile && ( // Show preview and save button only when selectedFile is not null
                                    <div style={{ marginTop: '20px' }}>
                                        <Title level={5}>Xem trước</Title>
                                        <Avatar
                                            size={100}
                                            src={preview}
                                            style={{ margin: '10px 0' }}
                                        />
                                        <div style={{ marginTop: '15px' }}>
                                            <Button
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                onClick={() => handleUpdateUserAvatar()}
                                                loading={uploadLoading} // Use uploadLoading for avatar save button
                                            >
                                                Lưu Avatar
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Card
                                title={<Title level={5}><InfoCircleOutlined /> Thông tin chi tiết</Title>}
                                bordered={false}
                                style={{ marginTop: '20px' }}
                            >
                                <Descriptions column={1} bordered size="small">
                                    {/* <Descriptions.Item label="ID">{user.id}</Descriptions.Item> */}
                                    <Descriptions.Item label="Tên đăng nhập">{user.username}</Descriptions.Item>
                                    <Descriptions.Item label="Email">
                                        <Space><MailOutlined />{user.email}</Space>
                                    </Descriptions.Item>
                                    {user.phone && (
                                        <Descriptions.Item label="Số điện thoại">
                                            <Space><PhoneOutlined />{user.phone}</Space>
                                        </Descriptions.Item>
                                    )}
                                    {user.address && (
                                        <Descriptions.Item label="Địa chỉ">
                                            <Space><HomeOutlined />{user.address}</Space>
                                        </Descriptions.Item>
                                    )}
                                    {/* {user.roles && (
                                        <Descriptions.Item label="Vai trò">
                                            {Array.isArray(user.roles) ?
                                                user.roles.map(role => (
                                                    <span key={role} style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#bae7ff', color: '#0050b3', borderRadius: '4px', margin: '2px' }}>
                                                        {role.name || role.description || role.id || 'Vai trò không xác định'}
                                                    </span>
                                                ))
                                                :
                                                (typeof user.roles === 'object' && user.roles !== null) ? (
                                                    <span style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#bae7ff', color: '#0050b3', borderRadius: '4px', margin: '2px' }}>
                                                        {user.roles.name || user.roles.description || user.roles.id || 'Vai trò không xác định'}
                                                    </span>
                                                ) : (
                                                    String(user.roles) || 'Không có thông tin vai trò'
                                                )
                                            }
                                        </Descriptions.Item>
                                    )} */}
                                </Descriptions>
                            </Card>
                        </Card>
                    </Col>
                    <Col span={14}>
                        <Card
                            title={<Title level={5}><EditOutlined /> Chỉnh sửa thông tin cá nhân</Title>}
                            bordered={false}
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleUpdateProfile}
                            >
                                <Form.Item
                                    name="username"
                                    label="Tên hiển thị"
                                    rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
                                >
                                    <Input placeholder="Tên hiển thị" />
                                </Form.Item>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập email!" },
                                        { type: "email", message: "Email không hợp lệ!" },
                                    ]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                >
                                    <Input placeholder="Số điện thoại" />
                                </Form.Item>
                                <Form.Item
                                    name="firstName"
                                    label="Tên"
                                >
                                    <Input placeholder="Tên" />
                                </Form.Item>
                                <Form.Item
                                    name="lastName"
                                    label="Họ"
                                >
                                    <Input placeholder="Họ" />
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    label="Địa chỉ"
                                >
                                    <Input placeholder="Địa chỉ" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loadingUpdate}>
                                        Cập nhật Thông tin
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <p>Đang tải thông tin tài khoản...</p>
            )}
        </div>
    );
};

export default UserProfile;
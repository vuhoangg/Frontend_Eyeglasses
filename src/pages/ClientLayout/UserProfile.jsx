// UserProfile.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Typography, Row, Col, Avatar, Divider, Descriptions, Space, Spin, notification } from "antd";
import { updateUserAPI, handleUploadFile, fetchUserByIdAPI } from "../../services/api.service";
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
    const [loadingUser, setLoadingUser] = useState(true); // Thêm state loading user

    useEffect(() => {
        setLoadingUser(true); // Bắt đầu loading
        const userData = localStorage.getItem("userData");
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const userId = parsedUserData.id;

            const fetchUserData = async () => {
                try {
                    const res = await fetchUserByIdAPI(userId);
                    if (res.data) {
                        const fetchedUser = res.data;
                        setUser(fetchedUser);
                        form.setFieldsValue(fetchedUser);
                        if (fetchedUser.avartar) { // Kiểm tra nếu có avatar
                            const avatarUrl = `http://localhost:8082/images/user/${fetchedUser.avartar}`;
                            setPreview(avatarUrl);
                            setInitialAvatar(avatarUrl);
                        } else {
                            // Nếu không có avatar, không cần set preview/initial
                             setPreview(null);
                             setInitialAvatar(null);
                        }
                    } else {
                        message.error("Không thể tải thông tin người dùng.");
                    }
                } catch (error) {
                    console.error("Lỗi khi tải thông tin người dùng:", error);
                    message.error("Lỗi khi tải thông tin người dùng.");
                    // navigate('/login'); // Có thể không cần redirect ngay
                } finally {
                    setLoadingUser(false); // Kết thúc loading dù thành công hay lỗi
                }
            };
            fetchUserData();
        } else {
            navigate('/login');
            setLoadingUser(false); // Kết thúc loading nếu không có user data
        }
    }, [form, navigate]);


    // --- Các hàm xử lý khác (handleOnChangeFile, handleUpdateUserAvatar, handleUpdateProfile) giữ nguyên ---
    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null);
            // *** QUAN TRỌNG: Khi hủy chọn file, quay về avatar ban đầu, không phải null ***
            setPreview(initialAvatar);
            return;
        }
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Hiển thị preview ảnh mới chọn
        }
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
                // Chỉ gọi API cập nhật avatar thôi, không cần cập nhật các trường khác ở đây
                const resUpdateAvatar = await updateUserAPI(
                    user.id,
                    user.username, // Giữ nguyên các trường khác
                    user.email,
                    user.phone,
                    user.firstName,
                    user.lastName,
                    user.address,
                    newAvatar, // Chỉ cập nhật avatar
                    // user.roles // Bỏ roles nếu API không cần
                );

                if (resUpdateAvatar.data) { // Kiểm tra dựa trên response API update
                     const updatedUserData = {
                        ...user,
                        avartar: newAvatar // Cập nhật avatar trong state user
                    };
                    setUser(updatedUserData);
                    localStorage.setItem("userData", JSON.stringify(updatedUserData));
                    const newAvatarUrl = `http://localhost:8082/images/user/${newAvatar}`;
                    setInitialAvatar(newAvatarUrl); // Cập nhật avatar gốc mới
                    setPreview(newAvatarUrl);       // Hiển thị avatar mới đã lưu
                    setSelectedFile(null);        // Reset file đã chọn
                    notification.success({
                        message: "Cập nhật avatar",
                        description: "Avatar người dùng đã được cập nhật thành công"
                    });
                } else {
                     // Xử lý lỗi nếu API update không thành công như mong đợi
                     console.error("Update avatar API response error:", resUpdateAvatar);
                    notification.error({
                        message: "Lỗi cập nhật",
                        description: resUpdateAvatar.message || "Không thể cập nhật avatar người dùng trên hệ thống"
                    });
                     // Quay lại avatar ban đầu nếu lỗi
                    setPreview(initialAvatar);
                }
            } else {
                // Xử lý lỗi upload file
                 console.error("Upload file response error:", resUpload);
                notification.error({
                     message: "Lỗi Upload",
                     description: resUpload.message || "Không thể tải ảnh lên"
                 });
                 // Quay lại avatar ban đầu nếu lỗi
                 setPreview(initialAvatar);
            }
        } catch (error) {
            setUploadLoading(false);
             console.error("Error during avatar update process:", error);
            notification.error({
                message: "Lỗi hệ thống",
                description: error.message || "Đã xảy ra lỗi khi cập nhật avatar"
            });
             // Quay lại avatar ban đầu nếu lỗi
             setPreview(initialAvatar);
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

            // Lấy avatar hiện tại từ state `user` (đã được cập nhật nếu đổi avatar thành công trước đó)
            const currentAvatarFileName = user.avartar;

            const response = await updateUserAPI(
                user.id,
                values.username,
                values.email,
                values.phone,
                values.firstName || '',
                values.lastName || '',
                values.address || '',
                currentAvatarFileName, // Gửi avatar hiện tại
               // Bỏ roles nếu API không yêu cầu
            );

             // Kiểm tra response cẩn thận hơn
            if (response && response.data) { // Giả sử API trả về data khi thành công
                message.success("Cập nhật tài khoản thành công");
                const updatedUserData = { // Chỉ cập nhật các trường đã thay đổi trong form + avatar hiện tại
                    ...user, // Giữ lại các trường không đổi như id, avartar, roles
                    username: values.username,
                    email: values.email,
                    phone: values.phone,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    address: values.address,
                };
                localStorage.setItem("userData", JSON.stringify(updatedUserData));
                setUser(updatedUserData); // Cập nhật state user

            } else {
                 // Xử lý lỗi dựa trên cấu trúc response API thực tế
                 const errorMsg = response?.message || response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản';
                 console.error("Update profile API error:", response);
                message.error(errorMsg);
            }
        } catch (error) {
             // Xử lý lỗi validate form và lỗi gọi API
            if (error.name === 'ValidateError' || error.errorFields) { // Kiểm tra lỗi validation của Antd
                message.warning('Vui lòng kiểm tra lại thông tin đã nhập.');
             } else {
                console.error("Lỗi khi cập nhật tài khoản:", error);
                 const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại.';
                message.error(errorMsg);
            }
        } finally {
            setLoadingUpdate(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            {/* Sử dụng Spin bao ngoài để hiển thị loading toàn trang */}
            <Spin spinning={loadingUser} tip="Đang tải thông tin..." size="large" style={{ minHeight: '300px' }}>
                 {/* Chỉ render Row khi không loading VÀ có user */}
                {!loadingUser && user ? (
                    <Row gutter={[24, 24]}> {/* Giữ gutter */}
                        {/* --- Cột Trái: Thông tin & Avatar --- */}
                         {/* *** SỬA COL SPAN THÀNH RESPONSIVE *** */}
                        <Col xs={24} md={10} lg={8} xl={7}> {/* Thu nhỏ hơn trên màn lớn */}
                            <Card bordered={false} className="profile-left-col">
                                <div style={{ textAlign: 'center', padding: '20px 0 0' }}> {/* Giảm padding top */}
                                    <Avatar
                                        size={150}
                                        src={preview || initialAvatar} // Ưu tiên preview, nếu không có thì dùng initial
                                        icon={<UserOutlined />}
                                        // Bỏ onError ở đây vì đã xử lý ở useEffect và handleOnChangeFile
                                    />
                                    <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>
                                        {user.username}
                                    </Title>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: '15px' }}> {/* Thêm margin bottom */}
                                        {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''}
                                    </Text>
                                    {/* <Divider /> */} {/* Có thể bỏ Divider ở đây */}

                                    {/* --- Phần Upload Avatar --- */}
                                    <div style={{ marginBottom: '20px' }}> {/* Tách ra và thêm margin */}
                                        <label htmlFor="btnUpload" className="ant-btn ant-btn-default"> {/* Giả dạng button Antd */}
                                            <UploadOutlined /> Chọn ảnh
                                            <input
                                                hidden
                                                id="btnUpload"
                                                type="file"
                                                onChange={handleOnChangeFile}
                                                accept="image/png, image/jpeg, image/gif, image/webp" // Thêm định dạng ảnh
                                            />
                                        </label>
                                        {/* Nút Lưu Avatar chỉ hiện khi có ảnh được chọn (selectedFile) */}
                                        {selectedFile && (
                                            <Button
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                onClick={handleUpdateUserAvatar}
                                                loading={uploadLoading}
                                                style={{ marginLeft: '10px' }} // Thêm khoảng cách
                                            >
                                                Lưu Avatar
                                            </Button>
                                        )}
                                    </div>
                                     {/* --- Kết thúc Phần Upload Avatar --- */}
                                     <Divider />
                                </div>

                                {/* --- Card Thông tin chi tiết --- */}
                                <Card
                                    title={<Title level={5} style={{ marginBottom: 0 }}><InfoCircleOutlined /> Thông tin chi tiết</Title>}
                                    bordered={false}
                                    style={{ marginTop: '0px' }} // Bỏ margin top nếu đã có Divider
                                    bodyStyle={{ padding: '16px' }} // Giảm padding body
                                >
                                    <Descriptions column={1} bordered size="small" layout="horizontal">
                                        <Descriptions.Item label="Email">
                                            <Space><MailOutlined />{user.email}</Space>
                                        </Descriptions.Item>
                                        {user.phone && (
                                            <Descriptions.Item label="Điện thoại">
                                                <Space><PhoneOutlined />{user.phone}</Space>
                                            </Descriptions.Item>
                                        )}
                                        {user.address && (
                                            <Descriptions.Item label="Địa chỉ">
                                                <Space><HomeOutlined />{user.address}</Space>
                                            </Descriptions.Item>
                                        )}
                                         {/* Bỏ phần Roles nếu không dùng */}
                                    </Descriptions>
                                </Card>
                                {/* --- Kết thúc Card Thông tin chi tiết --- */}
                            </Card>
                        </Col>

                        {/* --- Cột Phải: Form Chỉnh Sửa --- */}
                        {/* *** SỬA COL SPAN THÀNH RESPONSIVE *** */}
                        <Col xs={24} md={14} lg={16} xl={17}>
                            <Card
                                title={<Title level={5} style={{ marginBottom: 0 }}><EditOutlined /> Chỉnh sửa thông tin</Title>}
                                bordered={false}
                                bodyStyle={{ paddingTop: '16px' }} // Giảm padding top
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleUpdateProfile}
                                >
                                    {/* --- Các Form Item giữ nguyên --- */}
                                     <Row gutter={16}> {/* Cho các trường thông tin cá nhân vào Row */}
                                         <Col xs={24} sm={12}>
                                             <Form.Item
                                                 name="username"
                                                 label="Tên hiển thị"
                                                 rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
                                             >
                                                 <Input placeholder="Tên hiển thị" />
                                             </Form.Item>
                                         </Col>
                                         <Col xs={24} sm={12}>
                                             <Form.Item
                                                 name="email"
                                                 label="Email"
                                                 rules={[ { required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không hợp lệ!" }]}
                                             >
                                                 <Input placeholder="Email" />
                                             </Form.Item>
                                         </Col>
                                         <Col xs={24} sm={12}>
                                            <Form.Item name="firstName" label="Tên">
                                                <Input placeholder="Tên" />
                                            </Form.Item>
                                         </Col>
                                         <Col xs={24} sm={12}>
                                             <Form.Item name="lastName" label="Họ">
                                                 <Input placeholder="Họ" />
                                             </Form.Item>
                                         </Col>
                                         <Col span={24}> {/* Phone và Address chiếm full width */}
                                             <Form.Item name="phone" label="Số điện thoại">
                                                 <Input placeholder="Số điện thoại" />
                                             </Form.Item>
                                         </Col>
                                         <Col span={24}>
                                             <Form.Item name="address" label="Địa chỉ">
                                                 <Input placeholder="Địa chỉ" />
                                             </Form.Item>
                                         </Col>
                                     </Row>
                                    <Form.Item style={{ marginTop: '10px' }}> {/* Thêm margin top cho nút */}
                                        <Button type="primary" htmlType="submit" loading={loadingUpdate} icon={<SaveOutlined />}>
                                            Lưu thay đổi
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                 // Hiển thị thông báo nếu không loading nhưng không có user (trường hợp lỗi fetch)
                ) : !loadingUser ? (
                     <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                        <Title level={4} type="danger">Lỗi tải dữ liệu</Title>
                        <Text>Không thể tải thông tin người dùng. Vui lòng thử lại hoặc đăng nhập lại.</Text>
                        <div style={{ marginTop: '20px' }}>
                            <Button onClick={() => window.location.reload()} style={{ marginRight: '10px' }}>Tải lại trang</Button>
                            <Button type="primary" onClick={() => navigate('/login')}>Đi đến đăng nhập</Button>
                        </div>
                     </div>
                ) : null /* Trong khi loading, Spin sẽ hiển thị */}
            </Spin>

            {/* ----- CSS TÙY CHỈNH CHO RESPONSIVE ----- */}
            <style jsx global>{`
                @media (max-width: 767px) { /* Áp dụng cho màn hình nhỏ hơn md */
                    .profile-left-col .ant-card-body {
                        padding: 0 !important; /* Bỏ padding của card trái để căn giữa dễ hơn */
                    }
                    .profile-left-col > .ant-card-body > div:first-of-type {
                        padding: 20px 15px 0 !important; /* Thêm lại padding cho phần avatar */
                    }
                    .profile-left-col .ant-card-body .ant-card {
                        /* Card thông tin chi tiết bên trong */
                        margin-top: 20px !important; /* Thêm khoảng cách trên mobile */
                    }
                     .ant-descriptions-item-label {
                        width: 80px; /* Cố định chiều rộng label trong Descriptions */
                     }
                     .ant-form-item {
                         margin-bottom: 16px; /* Giảm khoảng cách dưới của Form Item */
                     }
                }
                @media (max-width: 575px) { /* Áp dụng cho màn hình nhỏ hơn sm */
                     .profile-left-col .ant-avatar {
                         width: 120px !important; /* Avatar nhỏ hơn */
                         height: 120px !important;
                         line-height: 120px !important; /* Căn icon nếu không có ảnh */
                     }
                     h4.ant-typography { /* Title username */
                        font-size: 1.1em;
                     }
                     .ant-descriptions-view {
                        font-size: 13px; /* Chữ trong descriptions nhỏ hơn */
                     }
                     .ant-form label {
                        font-size: 13px; /* Label form nhỏ hơn */
                     }
                }
            `}</style>
        </div>
    );
};

export default UserProfile;
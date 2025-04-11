// src/pages/AdminLayout/AdminUser/UserDetail.jsx
import { Drawer, Button, notification, message, Card, Descriptions, Typography, Divider, Row, Col, Space, Image, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { handleUploadFile, updateUserAPI } from '../../../services/api.service';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, UploadOutlined, SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Giữ nguyên props và state như ban đầu
const UserDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadUsers } = props;
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Giữ nguyên hàm onClose
    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null); // Clear data when closing
        setPreview(null);    // Clear preview
        setSelectedFile(null); // Clear selected file
    };

    // Giữ nguyên hàm handleOnChangeFile
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

    // Giữ nguyên hàm handleUpdateUserAvatar
    const handleUpdateUserAvatar = async () => {
        if (!selectedFile) {
            notification.warning({ message: "Chưa chọn file", description: "Vui lòng chọn file ảnh đại diện mới." });
            return;
        }
        if (!dataDetail || !dataDetail.id) {
             notification.error({ message: "Lỗi dữ liệu", description: "Không tìm thấy thông tin người dùng để cập nhật." });
            return;
        }

        try {
            const resUpload = await handleUploadFile(selectedFile, "user");
            if (resUpload.data && resUpload.data.fileName) { // Kiểm tra response upload
                const newAvatar = resUpload.data.fileName;

                 // Lấy các role IDs hiện tại để gửi lại API update
                const currentRoleIds = (dataDetail.roles && Array.isArray(dataDetail.roles))
                    ? dataDetail.roles.map(role => role.id)
                    : [];


                // Gọi updateUserAPI với đầy đủ thông tin và avatar mới
                const resUpdateAvatar = await updateUserAPI(
                    dataDetail.id,
                    dataDetail.username, // Giữ nguyên các thông tin khác
                    dataDetail.email,
                    dataDetail.phone,
                    dataDetail.firstName,
                    dataDetail.lastName,
                    dataDetail.address,
                    newAvatar,          // Avatar mới
                    currentRoleIds      // Giữ nguyên roles hiện tại
                );

                if (resUpdateAvatar.data || resUpdateAvatar.statusCode === 200) { // Kiểm tra response update
                    // setIsDetailOpen(false); // Không tự đóng drawer, để user thấy kết quả
                    setSelectedFile(null);
                    setPreview(null);
                    if(reloadUsers) {
                        reloadUsers(); // Tải lại danh sách users để cập nhật avatar ở bảng ManageUser
                    }
                    // Cập nhật lại dataDetail ngay lập tức để hiển thị avatar mới trong Drawer
                    setDataDetail(prevDetails => ({ ...prevDetails, avartar: newAvatar }));

                    notification.success({
                        message: "Cập nhật avatar",
                        description: "Avatar người dùng đã được cập nhật thành công"
                    });
                } else {
                    notification.error({
                        message: "Lỗi cập nhật",
                        description: resUpdateAvatar.message || "Không thể cập nhật avatar người dùng"
                    });
                }
            } else {
                 notification.error({
                    message: "Lỗi upload",
                    description: resUpload.message || "Tải lên avatar thất bại."
                });
            }
        } catch (error) {
             console.error("Update Avatar Error:", error);
            notification.error({
                message: "Lỗi cập nhật",
                description: error.response?.data?.message || error.message || "Đã xảy ra lỗi khi cập nhật avatar"
            });
        }
    };

    // --- GIAO DIỆN UI GIỮ NGUYÊN ---
    return (
        <Drawer
            // Giữ nguyên các props của Drawer
            width="50vw"
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Thông tin người dùng</Title>
                </div>
            }
            onClose={onClose}
            open={isDetailOpen}
            maskClosable={false}
            destroyOnClose={true} // Thêm để reset state khi đóng hẳn
            extra={
                <Button type="primary" onClick={onClose}>
                    Đóng
                </Button>
            }
        >
            {dataDetail ? (
                // Giữ nguyên cấu trúc Row, Col, Card
                <Row gutter={[24, 24]}>
                    <Col span={10}>
                        <Card bordered={false}>
                            {/* Giữ nguyên cấu trúc phần Avatar và thông tin cơ bản */}
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <Avatar
                                    size={150}
                                    // Luôn hiển thị avatar từ dataDetail để cập nhật ngay khi thành công
                                    src={dataDetail.avartar ? `http://localhost:8082/images/user/${dataDetail.avartar}` : undefined}
                                    icon={<UserOutlined />} // Icon fallback
                                />
                                <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>
                                    {dataDetail.username}
                                </Title>
                                <Text type="secondary">
                                    {dataDetail.firstName} {dataDetail.lastName}
                                </Text>

                                <Divider />

                                {/* Giữ nguyên phần Upload Avatar */}
                                <div style={{ marginTop: '15px' }}>
                                    <label
                                        htmlFor="btnUploadDetail" // Đổi id để tránh trùng lặp nếu có nhiều instance
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
                                    </label>
                                    <input
                                        hidden
                                        id="btnUploadDetail" // Đổi id tương ứng
                                        type="file"
                                        onChange={handleOnChangeFile} // Event handler không đổi
                                        accept="image/png, image/jpeg"
                                    />
                                </div>

                                {/* Giữ nguyên phần Preview và nút Lưu */}
                                {preview && (
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
                                                onClick={handleUpdateUserAvatar} // Event handler không đổi
                                                disabled={!selectedFile} // Disable nút nếu chưa chọn file
                                            >
                                                Lưu thay đổi
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                    <Col span={14}>
                        {/* Giữ nguyên Card Thông tin chi tiết */}
                        <Card
                            title={<Title level={5}><InfoCircleOutlined /> Thông tin chi tiết</Title>}
                            bordered={false}
                        >
                            {/* Giữ nguyên Descriptions và các Item khác */}
                            <Descriptions column={1} bordered>
                                <Descriptions.Item label="ID">{dataDetail.id}</Descriptions.Item>
                                <Descriptions.Item label="Tên đăng nhập">{dataDetail.username}</Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    <Space>
                                        <MailOutlined />
                                        {dataDetail.email}
                                    </Space>
                                </Descriptions.Item>
                                {dataDetail.phone && (
                                    <Descriptions.Item label="Số điện thoại">
                                        <Space>
                                            <PhoneOutlined />
                                            {dataDetail.phone}
                                        </Space>
                                    </Descriptions.Item>
                                )}
                                {dataDetail.address && (
                                    <Descriptions.Item label="Địa chỉ">
                                        <Space>
                                            <HomeOutlined />
                                            {dataDetail.address}
                                        </Space>
                                    </Descriptions.Item>
                                )}

                                {/* ----- PHẦN HIỂN THỊ ROLE ĐÃ ĐƯỢC SỬA ----- */}
                                <Descriptions.Item label="Vai trò">
                                    {/* Kiểm tra dataDetail.roles có tồn tại và là mảng không */}
                                    {dataDetail.roles && Array.isArray(dataDetail.roles) && dataDetail.roles.length > 0 ? (
                                        // Nếu có, map qua mảng roles
                                        dataDetail.roles.map(role => (
                                            // Sử dụng role.id làm key cho mỗi span
                                            <span key={role.id} style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#bae7ff', color: '#0050b3', borderRadius: '4px', margin: '2px' }}>
                                                {/* Hiển thị role.name, nếu không có thì hiển thị ID */}
                                                {role.name || `ID: ${role.id}`}
                                            </span>
                                        ))
                                    ) : (
                                        // Nếu không có roles hoặc mảng rỗng, hiển thị thông báo
                                        <Text type="secondary">Không có vai trò</Text>
                                    )}
                                </Descriptions.Item>
                                {/* ----- KẾT THÚC PHẦN SỬA ROLE ----- */}

                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            ) : (
                 // Giữ nguyên phần hiển thị khi không có data
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Text type="secondary">Không có dữ liệu người dùng</Text>
                    </div>
                </Card>
            )}
        </Drawer>
    );
};

export default UserDetail;
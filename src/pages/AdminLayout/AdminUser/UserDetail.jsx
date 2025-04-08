import { Drawer, Button, notification, message, Card, Descriptions, Typography, Divider, Row, Col, Space, Image, Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { handleUploadFile, updateUserAPI } from '../../../services/api.service';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, UploadOutlined, SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadUsers } = props;
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null);
        setPreview(null);
        setSelectedFile(null);
    };

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

    const handleUpdateUserAvatar = async () => {
        try {
            const resUpload = await handleUploadFile(selectedFile, "user");
            if (resUpload.data) {
                const newAvatar = resUpload.data.fileName;
                const resUpdateAvatar = await updateUserAPI(
                    dataDetail.id,
                    dataDetail.username,
                    dataDetail.email,
                    dataDetail.phone,
                    dataDetail.firstName,
                    dataDetail.lastName,
                    dataDetail.address,
                    newAvatar,
                    dataDetail.roles
                );

                if (resUpdateAvatar.data) {
                    setIsDetailOpen(false);
                    setSelectedFile(null);
                    setPreview(null);
                    reloadUsers();
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
            notification.error({
                message: "Lỗi cập nhật",
                description: error.message || "Đã xảy ra lỗi khi cập nhật avatar"
            });
        }
    };

    return (
        <Drawer
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
            extra={
                <Button type="primary" onClick={onClose}>
                    Đóng
                </Button>
            }
        >
            {dataDetail ? (
                <Row gutter={[24, 24]}>
                    <Col span={10}>
                        <Card bordered={false}>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <Avatar
                                    size={150}
                                    src={`http://localhost:8082/images/user/${dataDetail.avartar}`}
                                    icon={<UserOutlined />}
                                />
                                <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>
                                    {dataDetail.username}
                                </Title>
                                <Text type="secondary">
                                    {dataDetail.firstName} {dataDetail.lastName}
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
                                            accept="image/png, image/jpeg"
                                        />
                                    </label>
                                </div>

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
                                                onClick={() => handleUpdateUserAvatar()}
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
                        <Card
                            title={<Title level={5}><InfoCircleOutlined /> Thông tin chi tiết</Title>}
                            bordered={false}
                        >
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
                                {dataDetail.roles && (
                                    <Descriptions.Item label="Vai trò">
                                        {console.log("dataDetail.roles:", dataDetail.roles)} {/* DEBUGGING CONSOLE LOG */}
                                        {Array.isArray(dataDetail.roles) ?
                                            dataDetail.roles.map(role => (
                                                <span key={role} style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#bae7ff', color: '#0050b3', borderRadius: '4px', margin: '2px' }}>
                                                    {/* Giả định role là object và có trường 'name' hoặc 'description' để hiển thị */}
                                                    {role.name || role.description || role.id || 'Vai trò không xác định'}
                                                </span>
                                            ))
                                            :
                                            (typeof dataDetail.roles === 'object' && dataDetail.roles !== null) ? (
                                                <span style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: '#bae7ff', color: '#0050b3', borderRadius: '4px', margin: '2px' }}>
                                                    {/* Nếu dataDetail.roles là object, giả định nó là một object vai trò và có trường 'name' hoặc 'description' */}
                                                    {dataDetail.roles.name || dataDetail.roles.description || dataDetail.roles.id || 'Vai trò không xác định'}
                                                </span>
                                            ) : (
                                                String(dataDetail.roles) || 'Không có thông tin vai trò' // Fallback cuối cùng, chuyển đổi thành string hoặc hiển thị thông báo mặc định
                                            )
                                        }
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            ) : (
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
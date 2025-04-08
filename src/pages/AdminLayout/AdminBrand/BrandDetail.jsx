import { Drawer, Button, notification, message, Card, Descriptions, Typography, Divider, Row, Col, Space, Avatar, Image } from 'antd';
import { useEffect, useState } from 'react';
import { handleUploadFile, updateBrandAPI } from '../../../services/api.brand';
import { InfoCircleOutlined, UploadOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BrandDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadBrands } = props;
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

    const handleUpdateBrandLogo = async () => {
        try {
            const resUpload = await handleUploadFile(selectedFile, "brand");
            if (resUpload.data) {
                const newLogo = resUpload.data.fileName;
                const resUpdateLogo = await updateBrandAPI(dataDetail.id, dataDetail.name, dataDetail.description, newLogo);

                if (resUpdateLogo.data) {
                    setIsDetailOpen(false);
                    setSelectedFile(null);
                    setPreview(null);
                    reloadBrands();
                    notification.success({
                        message: "Cập nhật logo thương hiệu",
                        description: "Logo thương hiệu đã được cập nhật thành công"
                    });
                } else {
                    notification.error({
                        message: "Lỗi cập nhật logo",
                        description: "Cập nhật logo thương hiệu thất bại"
                    });
                }
            }
        } catch (error) {
            notification.error({
                message: "Lỗi cập nhật",
                description: error.message || "Đã xảy ra lỗi khi cập nhật logo thương hiệu"
            });
        }
    };

    return (
        <Drawer
            width="50vw"
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InfoCircleOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Thông tin thương hiệu</Title>
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
                                <Image
                                    width={150}
                                    height={150}
                                    style={{ objectFit: 'contain' }}
                                    src={`http://localhost:8082/images/brand/${dataDetail.logo}`}
                                    fallback="https://via.placeholder.com/150?text=Logo" // Placeholder image if logo fails to load
                                />
                                <Title level={4} style={{ marginTop: '16px', marginBottom: '4px' }}>
                                    {dataDetail.name}
                                </Title>

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
                                        <UploadOutlined style={{ marginRight: 8 }} /> Tải logo mới
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
                                        <Title level={5}>Xem trước logo mới</Title>
                                        <Image
                                            width={100}
                                            height={100}
                                            style={{ objectFit: 'contain', margin: '10px 0' }}
                                            src={preview}
                                            fallback="https://via.placeholder.com/100?text=Preview"
                                        />
                                        <div style={{ marginTop: '15px' }}>
                                            <Button
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                onClick={() => handleUpdateBrandLogo()}
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
                                <Descriptions.Item label="Mã thương hiệu">{dataDetail.id}</Descriptions.Item>
                                <Descriptions.Item label="Tên thương hiệu">{dataDetail.name}</Descriptions.Item>
                                <Descriptions.Item label="Mô tả">
                                    {dataDetail.description}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Text type="secondary">Không có dữ liệu thương hiệu</Text>
                    </div>
                </Card>
            )}
        </Drawer>
    );
};

export default BrandDetail;
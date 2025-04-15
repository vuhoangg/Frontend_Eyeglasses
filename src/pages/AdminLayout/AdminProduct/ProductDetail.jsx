//src/pages/AdminLayout/AdminProduct/ProductDetail.jsx
import { Drawer, Button, notification, message, Card, Descriptions, Typography, Divider, Row, Col, Space, Image, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { handleUploadFile, updateProductAPI } from '../../../services/api.product';
import { fetchAllCategoryAPI } from '../../../services/api.category';
import { fetchAllBrandAPI } from '../../../services/api.brand';
import { ShopOutlined, TagOutlined, DollarOutlined, FileImageOutlined, UploadOutlined, SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProductDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadProducts } = props;
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categoryName, setCategoryName] = useState("N/A");
    const [brandName, setBrandName] = useState("N/A");

    useEffect(() => {
        loadCategories();
        loadBrands();
    }, []);

    useEffect(() => {
        if (dataDetail && categories.length > 0 && brands.length > 0) {
            const foundCategory = categories.find(cat => cat.id === dataDetail.category_id);
            setCategoryName(foundCategory ? foundCategory.name : "N/A");

            const foundBrand = brands.find(brand => brand.id === dataDetail.brand_id);
            setBrandName(foundBrand ? foundBrand.name : "N/A");
        } else {
            setCategoryName("N/A");
            setBrandName("N/A");
        }
    }, [dataDetail, categories, brands]);

    const loadCategories = async () => {
        try {
            const res = await fetchAllCategoryAPI(1, 1000);
            if (res.data) {
                setCategories(res.data.data);
            }
        } catch (error) {
            console.error("Error loading categories:", error);
            notification.error({
                message: "Error",
                description: "Failed to load categories."
            });
        }
    };

    const loadBrands = async () => {
        try {
            const res = await fetchAllBrandAPI(1, 1000);
            if (res.data) {
                setBrands(res.data.data);
            }
        } catch (error) {
            console.error("Error loading brands:", error);
            notification.error({
                message: "Error",
                description: "Failed to load brands."
            });
        }
    };

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

    const handleUpdateProductImage = async () => {
        try {
            const resUpload = await handleUploadFile(selectedFile, "product");
            if (resUpload.data) {
                const newImage = resUpload.data.fileName;
                const resUpdateImage = await updateProductAPI(
                    dataDetail.id,
                    dataDetail.name,
                    dataDetail.description,
                    dataDetail.price,
                    dataDetail.stock_quantity,
                    dataDetail.category_id,
                    dataDetail.brand_id,
                    newImage,
                    dataDetail.sku
                );

                if (resUpdateImage.data) {
                    setIsDetailOpen(false);
                    setSelectedFile(null);
                    setPreview(null);
                    reloadProducts();
                    notification.success({
                        message: "Cập nhật hình ảnh",
                        description: "Hình ảnh sản phẩm đã được cập nhật thành công"
                    });
                } else {
                    notification.error({
                        message: "Lỗi cập nhật",
                        description: "Không thể cập nhật hình ảnh sản phẩm"
                    });
                }
            }
        } catch (error) {
            notification.error({
                message: "Lỗi cập nhật",
                description: error.message || "Đã xảy ra lỗi khi cập nhật hình ảnh"
            });
        }
    };

    return (
        <Drawer
            width="50vw"
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShopOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Chi tiết sản phẩm</Title>
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
                <>
                    <Row gutter={[24, 24]}>
                        <Col span={16}>
                            <Card 
                                title={<Title level={5}><InfoCircleOutlined /> Thông tin sản phẩm</Title>} 
                                bordered={false}
                            >
                                <Descriptions column={1} bordered>
                                    <Descriptions.Item label="ID">{dataDetail.id}</Descriptions.Item>
                                    <Descriptions.Item label="Tên sản phẩm">{dataDetail.name}</Descriptions.Item>
                                    <Descriptions.Item label="Mô tả">{dataDetail.description}</Descriptions.Item>
                                    <Descriptions.Item label="Giá">
                                        <Text type="success" strong>
                                            <DollarOutlined /> {dataDetail.price} đ
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Số lượng trong kho">{dataDetail.stock_quantity}</Descriptions.Item>
                                    <Descriptions.Item label="Danh mục">
                                        <Text type="secondary">
                                            <TagOutlined style={{ marginRight: 8 }} />
                                            {categoryName}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Thương hiệu">
                                        <Text type="secondary">
                                            <ShopOutlined style={{ marginRight: 8 }} />
                                            {brandName}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="SKU">{dataDetail.sku}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card 
                                title={<Title level={5}><FileImageOutlined /> Hình ảnh sản phẩm</Title>} 
                                bordered={false}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Image
                                        src={`http://localhost:8082/images/product/${dataDetail.imageProduct}`}
                                        alt={dataDetail.name}
                                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                                        fallback="data:image/png;base64,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"
                                    />
                                </div>

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
                                        <UploadOutlined style={{ marginRight: 8 }} /> Tải ảnh mới
                                        <input
                                            hidden
                                            id="btnUpload"
                                            type="file"
                                            onChange={(event) => handleOnChangeFile(event)}
                                            // accept="image/png, image/jpeg"
                                        />
                                    </label>
                                </div>

                                {preview && (
                                    <div style={{ marginTop: '20px' }}>
                                        <Title level={5}>Xem trước</Title>
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            style={{ maxHeight: '200px', objectFit: 'contain' }}
                                        />
                                        <div style={{ marginTop: '15px' }}>
                                            <Button 
                                                type="primary" 
                                                icon={<SaveOutlined />}
                                                onClick={() => handleUpdateProductImage()}
                                            >
                                                Lưu thay đổi
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                <Card>
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Text type="secondary">Không có dữ liệu sản phẩm</Text>
                    </div>
                </Card>
            )}
        </Drawer>
    );
};

export default ProductDetail;
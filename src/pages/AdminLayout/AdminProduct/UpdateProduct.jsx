//src/pages/AdminLayout/AdminProduct/UpdateProduct.jsx
import { Form, Input, Button, Row, Col, notification, Modal, InputNumber, Select } from "antd";
import React, { useState, useEffect } from "react";
import { updateProductAPI, handleUploadFile } from "../../../services/api.product";
import { fetchAllCategoryAPI } from "../../../services/api.category"; // Import API for categories
import { fetchAllBrandAPI } from "../../../services/api.brand";     // Import API for brands

const UpdateProduct = ({ isModalOpen, setIsModalOpen, productData, reloadProducts }) => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock_quantity, setStockQuantity] = useState(0);
    const [category_id, setCategoryId] = useState(null); // Changed to null initially
    const [brand_id, setBrandId] = useState(null);     // Changed to null initially
    const [sku, setSku] = useState("");

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [initialImage, setInitialImage] = useState("");
    const [categories, setCategories] = useState([]); // State to store categories
    const [brands, setBrands] = useState([]);       // State to store brands

    const [form] = Form.useForm();

    useEffect(() => {
        loadCategories(); // Load categories on component mount
        loadBrands();     // Load brands on component mount
    }, []);

    useEffect(() => {
        if (productData) {
            setId(productData.id || "");
            setName(productData.name || "");
            setDescription(productData.description || "");
            setPrice(productData.price || 0);
            setStockQuantity(productData.stock_quantity || 0);
            setCategoryId(productData.category_id || null); // Set to null initially
            setBrandId(productData.brand_id || null);     // Set to null initially
            setSku(productData.sku || "");
            setInitialImage(productData.imageProduct || "");

            form.setFieldsValue({
                id: productData.id || "",
                name: productData.name || "",
                description: productData.description || "",
                price: productData.price || 0,
                stock_quantity: productData.stock_quantity || 0,
                category_id: productData.category_id || null, // Set to null initially
                brand_id: productData.brand_id || null,     // Set to null initially
                sku: productData.sku || "",
            });
        }
        setSelectedFile(null);
        setPreview(null);
    }, [productData, form]);


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


    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
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

    const onFinish = (values) => {
        console.log("Form Data:", values);
    };

    const handleSubmit = async () => {
        try {
            let imageProduct = initialImage;

            if (selectedFile) {
                const resUpload = await handleUploadFile(selectedFile, "product");
                if (resUpload.data) {
                    imageProduct = resUpload.data.fileName;
                } else {
                    notification.error({
                        message: "Update Product",
                        description: "Failed to upload image.",
                    });
                    return;
                }
            }

            const response = await updateProductAPI(id, name, description, price, stock_quantity, category_id, brand_id, imageProduct, sku);

            if (response.data) {
                notification.success({
                    message: "Update Product",
                    description: "Product updated successfully!",
                });
                setIsModalOpen(false);
                reloadProducts();
            } else {
                notification.error({
                    message: "Update Product",
                    description: response.message || "Failed to update product.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Update Product",
                description: error.response?.data?.message || "Failed to update product.",
            });
        }
    };

    const handleCategoryChange = (value) => {
        setCategoryId(value);
    };

    const handleBrandChange = (value) => {
        setBrandId(value);
    };


    return (
        <Modal
            title="Cập nhật sản phẩm"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Please enter product name" }]}>
                            <Input placeholder="Enter product name" onChange={(e) => setName(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Please enter description" }]}>
                            <Input placeholder="Enter description" onChange={(e) => setDescription(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Đơn giá" name="price" rules={[{ required: true, message: "Please enter price" }]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Enter price"
                                formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value.replace(/(,*)/g, "")}
                                onChange={(value) => setPrice(value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Số lượng trong kho" name="stock_quantity" rules={[{ required: true, message: "Please enter stock quantity" }]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Enter stock quantity"
                                onChange={(value) => setStockQuantity(value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: "Please select category" }]}>
                            <Select
                                placeholder="Select Category"
                                onChange={handleCategoryChange}
                                value={category_id}
                                options={categories.map(cat => ({
                                    value: cat.id,
                                    label: cat.name,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Thương Hiệu" name="brand_id" rules={[{ required: true, message: "Please select brand" }]}>
                            <Select
                                placeholder="Select Brand"
                                onChange={handleBrandChange}
                                value={brand_id}
                                options={brands.map(brand => ({
                                    value: brand.id,
                                    label: brand.name,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="SKU" name="sku" rules={[{ required: true, message: "Please enter SKU" }]}>
                            <Input placeholder="Enter SKU" onChange={(e) => setSku(e.target.value)} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <div style={{ marginTop: "30px", position: "relative" }} >
                            <label htmlFor="btnUpload" style={{
                                display: "block",
                                width: "fit-content",
                                marginTop: "15px",
                                padding: "5px 10px ",
                                background: "orange",
                                borderRadius: "5px",
                                cursor: "pointer"
                            }}>
                                Cập nhật ảnh sản phẩm
                            </label>
                            <input
                                hidden
                                id='btnUpload'
                                type="file"
                                onChange={(event) => handleOnChangeFile(event)}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer",
                                }}
                            />
                        </div>

                        {preview ? (
                            <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                                <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Product Preview" />
                            </div>
                        ) : (
                            initialImage && (
                                <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                                    <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={`http://localhost:8082/images/product/${initialImage}`} alt="Product Preview" />
                                </div>
                            )
                        )}
                    </Col>

                </Row>

                <Row justify="end" gutter={16}>
                    <Col>
                        <Button onClick={handleCancel}>Huỷ</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                            Cập nhật sản phẩm
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateProduct;
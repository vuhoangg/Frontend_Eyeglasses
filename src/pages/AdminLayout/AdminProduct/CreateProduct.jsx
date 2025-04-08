import { Form, Input, Button, Row, Col, notification, InputNumber, Select } from "antd";
import React, { useState, useEffect } from "react";
import { createProductAPI, handleUploadFile } from "../../../services/api.product";
import { fetchAllCategoryAPI } from "../../../services/api.category";
import { fetchAllBrandAPI } from "../../../services/api.brand";

const CreateProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [stock_quantity, setStockQuantity] = useState(0);
    const [category_id, setCategoryId] = useState(null); // Changed to null initially
    const [brand_id, setBrandId] = useState(null);     // Changed to null initially
    const [sku, setSku] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categories, setCategories] = useState([]); // State to store categories
    const [brands, setBrands] = useState([]);       // State to store brands

    const [form] = Form.useForm();

    useEffect(() => {
        loadCategories();
        loadBrands();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await fetchAllCategoryAPI(1, 1000); // Adjust page and limit as needed
            if (res.data) {
                setCategories(res.data.data); // Assuming data is nested like this, adjust if needed based on your API response
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
            const res = await fetchAllBrandAPI(1, 1000); // Adjust page and limit as needed
            if (res.data) {
                setBrands(res.data.data); // Assuming data is nested like this, adjust if needed based on your API response
            }
        } catch (error) {
            console.error("Error loading brands:", error);
            notification.error({
                message: "Error",
                description: "Failed to load brands."
            });
        }
    };


    const onFinish = (values) => {
        console.log("Form Data:", values);
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

    const handleSubmit = async () => {
        try {
            if (!selectedFile) {
                notification.error({
                    message: "Create Product",
                    description: "Please upload an image for the product.",
                });
                return;
            }

            const resUpload = await handleUploadFile(selectedFile, "product");
            if (resUpload.data) {
                const imageProduct = resUpload.data.fileName;
                const response = await createProductAPI(name, description, price, stock_quantity, category_id, brand_id, imageProduct, sku);
                console.log("Response:", response.data);

                if (response.data) {
                    notification.success({
                        message: "Create Product",
                        description: "Product created successfully!",
                    });
                    form.resetFields();
                    setSelectedFile(null);
                    setPreview(null);
                    setCategoryId(null); // Reset category_id and brand_id
                    setBrandId(null);
                } else {
                    notification.error({
                        message: "Create Product",
                        description: "Failed to create product.",
                    });
                }
            } else {
                notification.error({
                    message: "Create Product",
                    description: "Failed to upload image.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Create Product",
                description: error.response?.data?.message || "Failed to create product.",
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
        <>
            <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 800, margin: "0 auto" }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: "Please enter product name" }]}>
                            <Input placeholder="Kính HKG 0924" onChange={(e) => setName(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Please enter description" }]}>
                            <Input placeholder="Sản phẩm cao cấp" onChange={(e) => setDescription(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Đơn giá" name="price" rules={[{ required: true, message: "Please enter price" }]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder="Nhập đơn giá"
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
                                placeholder="Nhập số lượng trong kho"
                                onChange={(value) => setStockQuantity(value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Danh mục" name="category_id" rules={[{ required: true, message: "Please select category" }]}>
                            <Select
                                placeholder="Chọn danh mục"
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
                        <Form.Item label="Thương hiệu" name="brand_id" rules={[{ required: true, message: "Please select brand" }]}>
                            <Select
                                placeholder="Chọn thương hiệu"
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
                            <Input placeholder="SKU" onChange={(e) => setSku(e.target.value)} />
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
                                Upload ảnh
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


                        {preview && (
                            <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                                <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Product Preview" />
                            </div>
                        )}
                    </Col>
                </Row>


                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSubmit} disabled={!selectedFile || !category_id || !brand_id}>
                        Tạo sản phẩm mới
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateProduct;
import { Form, Input, Button, Row, Col, notification } from "antd";
import React, { useState } from "react";
import { createBrandAPI, handleUploadFile } from "../../../services/api.brand";

const CreateBrand = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [form] = Form.useForm();

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
                    message: "Create Brand",
                    description: "Please upload a logo for the brand.",
                });
                return;
            }

            const resUpload = await handleUploadFile(selectedFile, "brand");
            if (resUpload.data) {
                const logo = resUpload.data.fileName;
                const response = await createBrandAPI(name, description, logo);
                if (response.data) {
                    notification.success({
                        message: "Create Brand",
                        description: "Brand created successfully!",
                    });
                    form.resetFields();
                    setName("");
                    setDescription("");
                    setSelectedFile(null);
                    setPreview(null);
                } else {
                    notification.error({
                        message: "Create Brand",
                        description: "Failed to create brand.",
                    });
                }
            } else {
                notification.error({
                    message: "Create Brand",
                    description: "Failed to upload logo.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Create Brand",
                description: error.response?.data?.message || "Failed to create brand.",
            });
        }
    };

    return (
        <>
            <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 800, margin: "0 auto" }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Tên thương hiệu" name="name" rules={[{ required: true, message: "Please enter brand name" }]}>
                            <Input placeholder="Enter brand name" onChange={(e) => setName(e.target.value)} />
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
                        <Form.Item label="Logo thương hiệu" name="logo" rules={[{ required: true, message: "Please upload brand logo" }]}>
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
                                    Upload Logo
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
                                    <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Brand Logo Preview" />
                                </div>
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSubmit} disabled={!selectedFile}>
                        Tạo thương hiệu
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateBrand;
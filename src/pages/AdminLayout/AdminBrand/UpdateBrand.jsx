import { Form, Input, Button, Row, Col, notification, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { updateBrandAPI, handleUploadFile } from "../../../services/api.brand";

const UpdateBrand = ({ isModalOpen, setIsModalOpen, brandData, reloadBrands }) => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [initialLogo, setInitialLogo] = useState("");

    const [form] = Form.useForm();

    useEffect(() => {
        if (brandData) {
            setId(brandData.id || "");
            setName(brandData.name || "");
            setDescription(brandData.description || "");
            setInitialLogo(brandData.logo || "");

            form.setFieldsValue({
                id: brandData.id || "",
                name: brandData.name || "",
                description: brandData.description || "",
            });
        }
        setSelectedFile(null);
        setPreview(null);
    }, [brandData, form]);

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
            let logo = initialLogo;

            if (selectedFile) {
                const resUpload = await handleUploadFile(selectedFile, "brand");
                if (resUpload.data) {
                    logo = resUpload.data.fileName;
                } else {
                    notification.error({
                        message: "Update Brand",
                        description: "Failed to upload logo.",
                    });
                    return;
                }
            }

            const response = await updateBrandAPI(id, name, description, logo);

            if (response.data) {
                notification.success({
                    message: "Update Brand",
                    description: "Brand updated successfully!",
                });
                setIsModalOpen(false);
                reloadBrands();
            } else {
                notification.error({
                    message: "Update Brand",
                    description: response.message || "Failed to update brand.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Update Brand",
                description: error.response?.data?.message || "Failed to update brand.",
            });
        }
    };

    return (
        <Modal
            title="Cập nhật thương hiệu"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
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
                        <Form.Item label="Logo thương hiệu" name="logo" >
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

                            {preview ? (
                                <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                                    <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={preview} alt="Brand Logo Preview" />
                                </div>
                            ) : (
                                initialLogo && (
                                    <div style={{ marginTop: "10px", height: "200px", width: "150px", border: "1px solid #ccc" }}>
                                        <img style={{ height: "100%", width: "100%", objectFit: "contain" }} src={`http://localhost:8082/images/brand/${initialLogo}`} alt="Brand Logo Preview" />
                                    </div>
                                )
                            )}
                        </Form.Item>
                    </Col>
                </Row>


                <Row justify="end" gutter={16}>
                    <Col>
                        <Button onClick={handleCancel}>Huỷ</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                           Cập nhật 
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateBrand;
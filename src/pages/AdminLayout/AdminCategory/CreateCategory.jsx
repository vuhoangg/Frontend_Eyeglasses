import { Form, Input, Button, Row, Col, notification } from "antd";
import React, { useState } from "react";
import { createCategoryAPI } from "../../../services/api.category";

const CreateCategory = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [parentId, setParentId] = useState(null);

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log("Form Data:", values);
    };

    const handleSubmit = async () => {
        try {
            const response = await createCategoryAPI(name, description, parentId);
            if (response.data) {
                notification.success({
                    message: "Create Category",
                    description: "Category created successfully!",
                });
                form.resetFields();
                setName("");
                setDescription("");
                setParentId(null);
            } else {
                notification.error({
                    message: "Create Category",
                    description: "Failed to create category.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Create Category",
                description: error.response?.data?.message || "Failed to create category.",
            });
        }
    };

    return (
        <>
            <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 800, margin: "0 auto" }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Tên danh mục " name="name" rules={[{ required: true, message: "Please enter category name" }]}>
                            <Input placeholder="Enter category name" onChange={(e) => setName(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Please enter description" }]}>
                            <Input placeholder="Enter description" onChange={(e) => setDescription(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Parent Category ID" name="parent_id" >
                            <Input placeholder="Enter Parent Category ID (optional)" type="number" onChange={(e) => setParentId(e.target.value ? parseInt(e.target.value) : null)} />
                        </Form.Item>
                    </Col>
                </Row> */}


                <Form.Item>
                    <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                        Tạo danh mục
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateCategory;
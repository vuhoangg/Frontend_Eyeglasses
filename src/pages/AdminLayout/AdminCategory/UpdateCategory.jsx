import { Form, Input, Button, Row, Col, notification, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { updateCategoryAPI } from "../../../services/api.category";

const UpdateCategory = ({ isModalOpen, setIsModalOpen, categoryData, reloadCategories }) => {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [parentId, setParentId] = useState(null);


    const [form] = Form.useForm();

    useEffect(() => {
        if (categoryData) {
            setId(categoryData.id || "");
            setName(categoryData.name || "");
            setDescription(categoryData.description || "");
            setParentId(categoryData.parent_id || null);

            form.setFieldsValue({
                id: categoryData.id || "",
                name: categoryData.name || "",
                description: categoryData.description || "",
                parent_id: categoryData.parent_id || null,
            });
        }
    }, [categoryData, form]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = (values) => {
        console.log("Form Data:", values);
    };

    const handleSubmit = async () => {
        try {
            const response = await updateCategoryAPI(id, name, description, parentId);

            if (response.data) {
                notification.success({
                    message: "Update Category",
                    description: "Category updated successfully!",
                });
                setIsModalOpen(false);
                reloadCategories();
            } else {
                notification.error({
                    message: "Update Category",
                    description: response.message || "Failed to update category.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Update Category",
                description: error.response?.data?.message || "Failed to update category.",
            });
        }
    };

    return (
        <Modal
            title="Cập nhật danh mục"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
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


                <Row justify="end" gutter={16}>
                    <Col>
                        <Button onClick={handleCancel}>Huỷ</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                            Cập nhật danh mục
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateCategory;
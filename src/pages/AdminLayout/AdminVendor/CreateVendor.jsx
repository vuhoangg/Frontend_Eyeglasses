import React, { useState } from "react";
import { Form, Input, Button, Row, Col, notification, Typography, Breadcrumb } from "antd";
import { createVendorAPI } from '../../../services/api.vendor'; // Import API tạo vendor
import { Link, useNavigate } from "react-router-dom";
import { ShopOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LinkOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CreateVendor = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Không cần state riêng lẻ nếu dùng form.getFieldsValue() hoặc onFinish
    // const [name, setName] = useState("");
    // ... other states

    const onFinish = async (values) => {
        console.log("Form Data to Submit:", values);
        setLoading(true);
        try {
            const res = await createVendorAPI(
                values.name,
                values.email,
                values.phoneNumber,
                values.address,
                values.websiteUrl,
                null, // Logo chưa xử lý upload ở đây
                values.description
            );

            if (res.statusCode === 201) {
                notification.success({
                    message: "Tạo Nhà cung cấp",
                    description: "Tạo nhà cung cấp thành công!",
                });
                form.resetFields();
                navigate('/admin/list-supplier'); // Chuyển về trang danh sách sau khi tạo
            } else {
                notification.error({
                    message: "Tạo Nhà cung cấp",
                    description: res.message || "Tạo nhà cung cấp thất bại.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Tạo Nhà cung cấp",
                description: error?.response?.data?.message || "Tạo nhà cung cấp thất bại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item><Link to="/admin">Admin</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to="/admin/list-supplier">Quản lý NCC</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Thêm mới</Breadcrumb.Item>
            </Breadcrumb>
            <Title level={3} style={{ marginBottom: 24 }}>Thêm Nhà Cung Cấp Mới</Title>
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 800, margin: "0 auto" }}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên Nhà cung cấp"
                            name="name"
                            rules={[{ required: true, message: "Vui lòng nhập tên nhà cung cấp!" }]}
                        >
                            <Input prefix={<ShopOutlined />} placeholder="VD: Công ty Kính Mắt An Phát" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { type: 'email', message: 'Email không đúng định dạng!' },
                                { required: true, message: 'Vui lòng nhập email!' } // Email là bắt buộc ở backend DTO
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="VD: contact@anphat.com" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]} // SĐT là bắt buộc
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="VD: 0987654321" />
                        </Form.Item>
                    </Col>
                     <Col span={12}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]} // Địa chỉ bắt buộc
                        >
                            <Input prefix={<HomeOutlined />} placeholder="VD: 123 Đường ABC, Quận XYZ, TP HCM" />
                        </Form.Item>
                    </Col>
                </Row>
                 <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Website (Nếu có)"
                            name="websiteUrl"
                            rules={[{ type: 'url', warningOnly: true, message: 'Địa chỉ website không hợp lệ!' }]}
                        >
                            <Input prefix={<LinkOutlined />} placeholder="VD: https://anphatoptic.com" />
                        </Form.Item>
                    </Col>
                     <Col span={12}>
                         {/* Tạm thời bỏ qua upload logo */}
                     </Col>
                 </Row>


                <Form.Item label="Mô tả thêm" name="description">
                    <Input.TextArea rows={3} prefix={<InfoCircleOutlined />} placeholder="Mô tả ngắn về nhà cung cấp..." />
                </Form.Item>

                {/* Upload Logo - Cần component Upload riêng hoặc xử lý phức tạp hơn */}
                {/* <Form.Item label="Logo"> ... </Form.Item> */}

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tạo Nhà cung cấp
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => navigate('/admin/list-supplier')}>
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateVendor;
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, notification, Modal, Switch, Typography } from "antd";
import { updateVendorAPI } from '../../../services/api.vendor';
import { ShopOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LinkOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const UpdateVendor = ({ isModalOpen, setIsModalOpen, vendorData, reloadVendors }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(true); // State cho Switch

    useEffect(() => {
        if (vendorData) {
            form.setFieldsValue({
                name: vendorData.name,
                email: vendorData.email,
                phoneNumber: vendorData.phoneNumber,
                address: vendorData.address,
                websiteUrl: vendorData.websiteUrl,
                description: vendorData.description,
                isActive: vendorData.isActive,
            });
            setIsActive(vendorData.isActive); // Cập nhật state cho Switch
        } else {
            form.resetFields();
            setIsActive(true);
        }
    }, [vendorData, form]);

    const handleCancel = () => {
        setIsModalOpen(false);
        // Không cần reset form ở đây vì useEffect sẽ xử lý khi modal mở lại
    };

    const onFinish = async (values) => {
        console.log("Form Data to Update:", values);
        setLoading(true);
        try {
            const res = await updateVendorAPI(
                vendorData.id, // Lấy ID từ vendorData prop
                values.name,
                values.email,
                values.phoneNumber,
                values.address,
                values.websiteUrl,
                null, // Logo chưa xử lý
                values.description,
                values.isActive // Lấy trạng thái từ form values (Switch)
            );

            if (res.statusCode === 200 || res.status === 200) {
                notification.success({
                    message: "Cập nhật Nhà cung cấp",
                    description: "Cập nhật thông tin thành công!",
                });
                setIsModalOpen(false);
                reloadVendors(); // Gọi hàm reload từ props
            } else {
                notification.error({
                    message: "Cập nhật Nhà cung cấp",
                    description: res.message || "Cập nhật thất bại.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Cập nhật Nhà cung cấp",
                description: error?.response?.data?.message || "Cập nhật thất bại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<Title level={4}>Cập Nhật Nhà Cung Cấp</Title>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null} // Footer sẽ được custom bên dưới
            width={800}
            maskClosable={false}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Copy các Form.Item từ CreateVendor.jsx */}
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
                                { required: true, message: 'Vui lòng nhập email!' }
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
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="VD: 0987654321" />
                        </Form.Item>
                    </Col>
                     <Col span={12}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                             rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
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

                {/* Upload Logo Update */}
                {/* ... */}

                {/* Thêm trường Trạng thái */}
                <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
                    <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" checked={isActive} onChange={setIsActive} />
                </Form.Item>

                <Row justify="end" style={{ marginTop: 24 }}>
                    <Col>
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu thay đổi
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateVendor;
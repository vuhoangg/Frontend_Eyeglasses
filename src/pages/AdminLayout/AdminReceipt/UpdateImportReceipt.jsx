//src/pages/AdminLayout/AdminReceipt/UpdateImportReceipt.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, notification, Modal, Select, Typography, DatePicker, Switch } from "antd";
import { updateImportReceiptAPI } from '../../../services/api.importReceipt';
import { fetchAllVendorAPI } from '../../../services/api.vendor'; // Có thể cần nếu cho phép đổi NCC
import { ClockCircleOutlined, CheckCircleOutlined, FileTextOutlined, BarcodeOutlined, CalendarOutlined, ShopOutlined } from "@ant-design/icons";
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const UpdateImportReceipt = ({ isModalOpen, setIsModalOpen, receiptData, reloadReceipts }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState([]); // Nếu cho phép đổi Vendor
    const [currentStatus, setCurrentStatus] = useState(null);

    // Load vendors nếu cần
    useEffect(() => {
        const loadVendorsIfNeeded = async () => {
            // if (cho_phep_doi_vendor) {
            //     try {
            //         const res = await fetchAllVendorAPI(1, 1000, "", "", true);
            //         if (res.data) setVendors(res.data.data);
            //     } catch (error) { console.error("Failed to load vendors:", error); }
            // }
        };
        loadVendorsIfNeeded();
    }, []);

    useEffect(() => {
        if (receiptData) {
            setCurrentStatus(receiptData.status); // Lưu trạng thái hiện tại
            form.setFieldsValue({
                receiptCode: receiptData.receiptCode,
                notes: receiptData.notes,
                importDate: receiptData.importDate ? moment(receiptData.importDate) : null,
                status: receiptData.status,
                isActive: receiptData.isActive,
                // vendorId: receiptData.vendorId, // Nếu cho phép đổi Vendor
            });
        } else {
            form.resetFields();
            setCurrentStatus(null);
        }
    }, [receiptData, form]);

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleStatusChange = (value) => {
        if (currentStatus === 'COMPLETED' && (value === 'PENDING' || value === 'CANCELLED')) {
            Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                content: 'Chuyển trạng thái từ COMPLETED sang PENDING/CANCELLED sẽ hoàn tác việc cập nhật số lượng tồn kho. Bạn có chắc chắn?',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: () => {
                    form.setFieldsValue({ status: value }); // Cập nhật form nếu xác nhận
                },
                onCancel: () => {
                    form.setFieldsValue({ status: currentStatus }); // Hoàn tác về trạng thái cũ nếu hủy
                },
            });
        } else if (value === 'COMPLETED' && currentStatus !== 'COMPLETED') {
             Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                content: 'Chuyển trạng thái sang COMPLETED sẽ cập nhật số lượng tồn kho theo chi tiết phiếu nhập này. Bạn có chắc chắn?',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: () => {
                    form.setFieldsValue({ status: value });
                },
                onCancel: () => {
                     form.setFieldsValue({ status: currentStatus });
                },
            });
        } else {
             form.setFieldsValue({ status: value }); // Các trường hợp khác thì cập nhật bình thường
        }
    };

    const onFinish = async (values) => {
        console.log("Form Data to Update:", values);
        setLoading(true);
        try {
            const payload = {
                receiptCode: values.receiptCode,
                notes: values.notes,
                importDate: values.importDate ? values.importDate.toISOString() : undefined, // Gửi nếu có thay đổi
                status: values.status,
                isActive: values.isActive,
                // vendorId: values.vendorId, // Nếu cho phép đổi Vendor
            };

            const res = await updateImportReceiptAPI(
                receiptData.id, // ID của phiếu nhập cần cập nhật
                payload.vendorId, // Có thể undefined nếu không cho đổi
                payload.receiptCode,
                payload.notes,
                payload.importDate,
                payload.status,
                payload.isActive
            );

            if (res.statusCode === 200 || res.status === 200) {
                notification.success({
                    message: "Cập nhật Phiếu Nhập",
                    description: "Cập nhật thông tin phiếu nhập thành công!",
                });
                setIsModalOpen(false);
                reloadReceipts(); // Gọi hàm reload từ props
            } else {
                notification.error({
                    message: "Cập nhật Phiếu Nhập",
                    description: res.message || "Cập nhật thất bại.",
                });
            }
        } catch (error) {
             console.error("Update receipt error:", error.response || error);
            notification.error({
                message: "Cập nhật Phiếu Nhập",
                description: error?.response?.data?.message || "Cập nhật thất bại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<Title level={4}>Cập Nhật Phiếu Nhập Hàng</Title>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={700}
            maskClosable={false}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                 {/* Không cho phép sửa details ở đây */}
                 <Row gutter={24}>
                    {/* <Col span={12}>
                        <Form.Item label="Nhà cung cấp" name="vendorId" rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}>
                            <Select placeholder="Chọn nhà cung cấp" disabled={!cho_phep_doi_vendor}>
                                {vendors.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col> */}
                     <Col span={12}>
                         <Form.Item label="Mã Phiếu Nhập" name="receiptCode">
                            <Input prefix={<BarcodeOutlined />} placeholder="VD: PNK20240521001" />
                        </Form.Item>
                     </Col>
                      <Col span={12}>
                        <Form.Item label="Ngày nhập" name="importDate">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" showTime={{ format: 'HH:mm' }} prefix={<CalendarOutlined />} />
                        </Form.Item>
                    </Col>

                 </Row>

                <Form.Item label="Ghi chú" name="notes">
                    <Input.TextArea rows={3} prefix={<FileTextOutlined />} placeholder="Ghi chú thêm..." />
                </Form.Item>

                 <Row gutter={24}>
                     <Col span={12}>
                        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}>
                             {/* Dùng onChange để xử lý cảnh báo */}
                            <Select onChange={handleStatusChange}>
                                <Option value="PENDING"><ClockCircleOutlined /> PENDING</Option>
                                <Option value="COMPLETED"><CheckCircleOutlined /> COMPLETED</Option>
                                <Option value="CANCELLED">CANCELLED</Option>
                            </Select>
                        </Form.Item>
                     </Col>
                     <Col span={12}>
                        <Form.Item label="Hoạt động" name="isActive" valuePropName="checked">
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </Col>
                 </Row>


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

export default UpdateImportReceipt;
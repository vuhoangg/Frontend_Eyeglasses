//src/pages/AdminLayout/AdminReceipt/UpdateImportReceipt.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, notification, Modal, Select, Typography, DatePicker, Switch, Alert } from "antd";
import { updateImportReceiptAPI } from '../../../services/api.importReceipt';
import { ClockCircleOutlined, CheckCircleOutlined, FileTextOutlined, BarcodeOutlined, CalendarOutlined, InfoCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const UpdateImportReceipt = ({ isModalOpen, setIsModalOpen, receiptData, reloadReceipts }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialStatus, setInitialStatus] = useState(null);
    // const [isActuallyPrinted, setIsActuallyPrinted] = useState(false); // Không cần state riêng này nữa, dùng receiptData.isPrintedClientSide

    useEffect(() => {
        if (receiptData && isModalOpen) { // Chỉ set giá trị khi modal mở và có data
            setInitialStatus(receiptData.status);
            // setIsActuallyPrinted(receiptData.isPrintedClientSide || false); // Lấy từ props
            form.setFieldsValue({
                receiptCode: receiptData.receiptCode,
                notes: receiptData.notes,
                importDate: receiptData.importDate ? moment(receiptData.importDate) : null,
                status: receiptData.status,
                isActive: receiptData.isActive,
            });
        } else if (!isModalOpen) { // Reset form khi modal đóng
             form.resetFields();
             setInitialStatus(null);
            // setIsActuallyPrinted(false);
        }
    }, [receiptData, form, isModalOpen]);

    const handleCancel = () => {
        setIsModalOpen(false);
        // form.resetFields(); // Đã xử lý trong useEffect
    };

    const handleStatusChange = (newStatus) => {
        // ... (Logic cảnh báo giữ nguyên)
        if (initialStatus === 'COMPLETED' && (newStatus === 'PENDING' || newStatus === 'CANCELLED')) {
            Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                icon: <InfoCircleOutlined style={{ color: 'orange' }} />,
                content: 'Chuyển trạng thái từ COMPLETED sang PENDING/CANCELLED sẽ hoàn tác việc cập nhật số lượng tồn kho (nếu backend hỗ trợ). Bạn có chắc chắn?',
                okText: 'Xác nhận',
                cancelText: 'Hủy',
                onOk: () => {
                    form.setFieldsValue({ status: newStatus });
                },
                onCancel: () => {
                    form.setFieldsValue({ status: initialStatus });
                },
            });
        } else if (newStatus === 'COMPLETED' && initialStatus !== 'COMPLETED') {
            Modal.confirm({
                title: 'Xác nhận hoàn thành phiếu nhập',
                icon: <InfoCircleOutlined style={{ color: 'green' }} />,
                content: 'Chuyển trạng thái sang COMPLETED sẽ cập nhật số lượng tồn kho theo chi tiết phiếu nhập này. Hành động này có thể không thể đảo ngược hoàn toàn. Bạn có chắc chắn?',
                okText: 'Xác nhận Hoàn thành',
                cancelText: 'Hủy',
                onOk: () => {
                    form.setFieldsValue({ status: newStatus });
                },
                onCancel: () => {
                    form.setFieldsValue({ status: initialStatus });
                },
            });
        } else {
            form.setFieldsValue({ status: newStatus });
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                receiptCode: values.receiptCode,
                notes: values.notes,
                importDate: values.importDate ? values.importDate.toISOString() : undefined,
                status: values.status, // Gửi trạng thái hiện tại từ form
                isActive: values.isActive,
            };

            const res = await updateImportReceiptAPI(
                receiptData.id,
                undefined,
                payload.receiptCode,
                payload.notes,
                payload.importDate,
                payload.status,
                payload.isActive
            );

            if (res.statusCode === 200 || (res.data && res.data.id)) {
                notification.success({
                    message: "Cập nhật Phiếu Nhập",
                    description: "Cập nhật thông tin phiếu nhập thành công!",
                });
                setIsModalOpen(false);
                reloadReceipts();
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
                description: error?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Yêu cầu 3 (đã điều chỉnh): Khóa trạng thái nếu phiếu ban đầu là COMPLETED VÀ đã được in (theo client-side)
    const isActuallyPrinted = receiptData?.isPrintedClientSide || false;
    const isStatusLocked = initialStatus === 'COMPLETED' && isActuallyPrinted;
    const statusLockMessage = "Không thể thay đổi trạng thái của phiếu nhập đã hoàn thành và đã được in.";


    return (
        <Modal
            title={<Title level={4}>Cập Nhật Phiếu Nhập Hàng #{receiptData?.id}</Title>}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={700}
            maskClosable={false}
            destroyOnClose // Rất quan trọng để reset state của form và các state khác khi modal đóng hẳn
        >
            <Form form={form} layout="vertical" onFinish={onFinish} key={receiptData?.id || 'new'}> {/* Thêm key để re-render form khi receiptData thay đổi */}
                {isStatusLocked && (
                    <Alert
                        message="Thông báo quan trọng"
                        description={statusLockMessage}
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}
                 {initialStatus === 'COMPLETED' && !isActuallyPrinted && (
                    <Alert
                        message="Lưu ý"
                        description="Phiếu này đã HOÀN THÀNH. Nếu bạn in phiếu này, bạn sẽ không thể thay đổi trạng thái của nó nữa."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}
                <Row gutter={24}>
                    {/* ... (các trường khác giữ nguyên) ... */}
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
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                            tooltip={isStatusLocked ? statusLockMessage : "Chọn trạng thái cho phiếu nhập"}
                        >
                            <Select
                                onChange={handleStatusChange}
                                disabled={isStatusLocked} // Khóa nếu đã COMPLETED VÀ đã in
                            >
                                <Option value="PENDING"><ClockCircleOutlined /> PENDING</Option>
                                <Option value="COMPLETED"><CheckCircleOutlined /> COMPLETED</Option>
                                <Option value="CANCELLED"><CloseCircleOutlined /> CANCELLED</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Hoạt động (Ẩn/Hiện)" name="isActive" valuePropName="checked">
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
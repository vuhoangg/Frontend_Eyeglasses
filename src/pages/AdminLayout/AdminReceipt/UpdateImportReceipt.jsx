import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, notification, Modal, Select, Typography, DatePicker, Switch, Alert } from "antd";
import { updateImportReceiptAPI } from '../../../services/api.importReceipt';
import { ClockCircleOutlined, CheckCircleOutlined, FileTextOutlined, BarcodeOutlined, CalendarOutlined, InfoCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Title } = Typography;
const { Option } = Select;

const STATUS_LABELS = {
    PENDING: 'Chờ xử lý',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
};

const UpdateImportReceipt = ({ isModalOpen, setIsModalOpen, receiptData, reloadReceipts }) => {
const [form] = Form.useForm();
const [loading, setLoading] = useState(false);
const [initialStatus, setInitialStatus] = useState(null);

useEffect(() => {
    if (receiptData && isModalOpen) {
        setInitialStatus(receiptData.status);
        form.setFieldsValue({
            receiptCode: receiptData.receiptCode,
            notes: receiptData.notes,
            importDate: receiptData.importDate ? moment(receiptData.importDate) : null,
            status: receiptData.status,
            isActive: receiptData.isActive !== undefined ? receiptData.isActive : true, // Default to true if undefined
        });
    } else if (!isModalOpen) {
         form.resetFields();
         setInitialStatus(null);
    }
}, [receiptData, form, isModalOpen]);

const handleCancel = () => {
    setIsModalOpen(false);
};

const handleStatusChange = (newStatus) => {
    const currentStatusLabel = STATUS_LABELS[initialStatus] || initialStatus;
    const newStatusLabel = STATUS_LABELS[newStatus] || newStatus;

    if (initialStatus === 'COMPLETED' && (newStatus === 'PENDING' || newStatus === 'CANCELLED')) {
        Modal.confirm({
            title: 'Xác nhận thay đổi trạng thái',
            icon: <InfoCircleOutlined style={{ color: 'orange' }} />,
            content: `Chuyển trạng thái từ ${currentStatusLabel} sang ${newStatusLabel} sẽ hoàn tác việc cập nhật số lượng tồn kho (nếu backend hỗ trợ). Bạn có chắc chắn?`,
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                form.setFieldsValue({ status: newStatus });
            },
            onCancel: () => {
                form.setFieldsValue({ status: initialStatus }); // Revert to initial if cancelled
            },
        });
    } else if (newStatus === 'COMPLETED' && initialStatus !== 'COMPLETED') {
        Modal.confirm({
            title: `Xác nhận ${newStatusLabel} phiếu nhập`,
            icon: <InfoCircleOutlined style={{ color: 'green' }} />,
            content: `Chuyển trạng thái sang ${newStatusLabel} sẽ cập nhật số lượng tồn kho theo chi tiết phiếu nhập này. Hành động này có thể không thể đảo ngược hoàn toàn. Bạn có chắc chắn?`,
            okText: `Xác nhận (${newStatusLabel})`,
            cancelText: 'Hủy',
            onOk: () => {
                form.setFieldsValue({ status: newStatus });
            },
            onCancel: () => {
                form.setFieldsValue({ status: initialStatus }); // Revert to initial if cancelled
            },
        });
    } else if (newStatus === 'CANCELLED' && initialStatus !== 'CANCELLED') {
         Modal.confirm({
            title: `Xác nhận ${newStatusLabel} phiếu nhập`,
            icon: <InfoCircleOutlined style={{ color: 'red' }} />,
            content: `Chuyển trạng thái sang ${newStatusLabel} sẽ đánh dấu phiếu này là đã hủy và có thể hoàn tác tồn kho (nếu backend hỗ trợ). Bạn có chắc chắn?`,
            okText: `Xác nhận (${newStatusLabel})`,
            cancelText: 'Hủy',
            onOk: () => {
                form.setFieldsValue({ status: newStatus });
            },
            onCancel: () => {
                form.setFieldsValue({ status: initialStatus });
            },
        });
    }
    else {
        form.setFieldsValue({ status: newStatus }); // Directly set for other cases (e.g. PENDING to PENDING)
    }
};

const onFinish = async (values) => {
    setLoading(true);
    try {
        const payload = {
            receiptCode: values.receiptCode,
            notes: values.notes,
            importDate: values.importDate ? values.importDate.toISOString() : undefined,
            status: values.status,
            isActive: values.isActive,
        };
        const res = await updateImportReceiptAPI(
            receiptData.id,
            undefined, // vendorId - not updated here
            payload.receiptCode,
            payload.notes,
            payload.importDate,
            payload.status,
            payload.isActive
        );
        if (res.statusCode === 200 || (res.data && res.data.id)) {
            notification.success({
                message: "Cập nhật Phiếu Nhập",
                description: `Cập nhật thông tin phiếu nhập (${STATUS_LABELS[payload.status] || payload.status}) thành công!`,
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
        notification.error({
            message: "Cập nhật Phiếu Nhập",
            description: error?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.",
        });
    } finally {
        setLoading(false);
    }
};

const isActuallyPrinted = receiptData?.isPrintedClientSide || false;
const isStatusLocked = initialStatus === 'COMPLETED' && isActuallyPrinted;
const isCancelled = initialStatus === 'CANCELLED';
let statusLockMessage = "";
if (isStatusLocked) {
    statusLockMessage = `Không thể thay đổi trạng thái của phiếu nhập đã ${STATUS_LABELS.COMPLETED} và đã được in.`;
} else if (isCancelled) {
    statusLockMessage = `Không thể thay đổi trạng thái của phiếu nhập đã ${STATUS_LABELS.CANCELLED}.`;
}


return (
    <Modal
        title={<Title level={4}>Cập Nhật Phiếu Nhập Hàng #{receiptData?.id} {receiptData?.receiptCode ? `(${receiptData.receiptCode})` : ''}</Title>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
        maskClosable={false}
        destroyOnClose
    >
        <Form form={form} layout="vertical" onFinish={onFinish} key={receiptData?.id || 'new'}>
            {(isStatusLocked || isCancelled) && (
                <Alert
                    message="Thông báo quan trọng"
                    description={statusLockMessage}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
             {initialStatus === 'COMPLETED' && !isActuallyPrinted && !isCancelled && (
                <Alert
                    message="Lưu ý"
                    description={`Phiếu này đã ${STATUS_LABELS.COMPLETED}. Nếu bạn in phiếu này, bạn sẽ không thể thay đổi trạng thái của nó nữa.`}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
            <Row gutter={24}>
                 <Col span={12}>
                    <Form.Item label="Mã Phiếu Nhập" name="receiptCode">
                        <Input prefix={<BarcodeOutlined />} placeholder="VD: PNK20240521001" disabled={isCancelled} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Ngày nhập" name="importDate">
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" showTime={{ format: 'HH:mm' }} prefix={<CalendarOutlined />} disabled={isCancelled}/>
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Ghi chú" name="notes">
                <Input.TextArea rows={3} prefix={<FileTextOutlined />} placeholder="Ghi chú thêm..." disabled={isCancelled}/>
            </Form.Item>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                        tooltip={isStatusLocked || isCancelled ? statusLockMessage : "Chọn trạng thái cho phiếu nhập"}
                    >
                        <Select
                            onChange={handleStatusChange}
                            disabled={isStatusLocked || isCancelled}
                        >
                            <Option value="PENDING"><ClockCircleOutlined /> {STATUS_LABELS.PENDING}</Option>
                            <Option value="COMPLETED"><CheckCircleOutlined /> {STATUS_LABELS.COMPLETED}</Option>
                            <Option value="CANCELLED"><CloseCircleOutlined /> {STATUS_LABELS.CANCELLED}</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Kích hoạt (Ẩn/Hiện)" name="isActive" valuePropName="checked">
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" disabled={isCancelled}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="end" style={{ marginTop: 24 }}>
                <Col>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} disabled={isCancelled}>
                        Lưu thay đổi
                    </Button>
                </Col>
            </Row>
        </Form>
    </Modal>
);
};
export default UpdateImportReceipt;
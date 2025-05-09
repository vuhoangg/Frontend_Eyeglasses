import React, { useState, useEffect, useRef } from "react";
import {
Form, Input, Button, Row, Col, notification, Typography, Breadcrumb, Select, DatePicker,
InputNumber, Table, Popconfirm, message, Divider, Card
} from "antd";
import { createImportReceiptAPI } from '../../../services/api.importReceipt';
import { fetchAllVendorAPI } from '../../../services/api.vendor';
import { fetchAllProductAPI } from '../../../services/api.product';
import { Link, useNavigate } from "react-router-dom";
import { PlusOutlined, DeleteOutlined, CalendarOutlined, ShopOutlined, FileTextOutlined, BarcodeOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
const { Title, Text } = Typography;
const { Option } = Select;

const STATUS_LABELS = {
    PENDING: 'Chờ xử lý',
    COMPLETED: 'Hoàn thành',
    // CANCELLED is not typically a creation option
};

const formatCurrency = (value) => {
if (value === null || value === undefined) return 'N/A';
return Number(value).toLocaleString('vi-VN');
};
const parseCurrency = (value) => {
if (!value) return 0;
return value.replace(/[^0-9.-]+/g,"");
};

const CreateImportReceipt = () => {
const [form] = Form.useForm();
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const [vendors, setVendors] = useState([]);
const [products, setProducts] = useState([]);
const [receiptDetails, setReceiptDetails] = useState([]);
const [currentProduct, setCurrentProduct] = useState(null);
const [currentQuantity, setCurrentQuantity] = useState(1);
const [currentImportPrice, setCurrentImportPrice] = useState(0);
const [totalAmount, setTotalAmount] = useState(0);
const detailKey = useRef(0);

useEffect(() => {
    const loadInitialData = async () => {
        try {
            const [vendorRes, productRes] = await Promise.all([
                fetchAllVendorAPI(1, 1000, "", "", true), // Fetch active vendors
                fetchAllProductAPI(1, 10000, "", null, null, true) // Fetch active products, high limit
            ]);
            if (vendorRes.data) setVendors(vendorRes.data.data);
            if (productRes.data) setProducts(productRes.data.data.filter(p => p.isActive !== false)); // Ensure only active products
        } catch (error) {
            notification.error({ message: "Lỗi tải dữ liệu", description: "Không thể tải danh sách NCC hoặc Sản phẩm." });
        }
    };
    loadInitialData();
}, []);

useEffect(() => {
    const newTotal = receiptDetails.reduce((sum, item) => sum + (item.quantity * item.importPrice), 0);
    setTotalAmount(newTotal);
}, [receiptDetails]);

const handleAddDetail = () => {
    if (!currentProduct || currentQuantity <= 0 || currentImportPrice < 0) {
        message.warning("Vui lòng chọn sản phẩm, nhập số lượng và giá nhập hợp lệ.");
        return;
    }
    const existingIndex = receiptDetails.findIndex(item => item.productId === currentProduct.id);
    if (existingIndex > -1) {
        message.warning(`Sản phẩm "${currentProduct.name}" đã có trong phiếu. Bạn có thể xóa và thêm lại với số lượng/giá mới.`);
    } else {
        detailKey.current += 1;
        const newDetail = {
            key: detailKey.current,
            productId: currentProduct.id,
            productName: currentProduct.name,
            sku: currentProduct.sku,
            quantity: currentQuantity,
            importPrice: currentImportPrice,
        };
        setReceiptDetails([...receiptDetails, newDetail]);
    }
    setCurrentProduct(null);
    setCurrentQuantity(1);
    setCurrentImportPrice(0);
    form.setFieldsValue({ productId: null, quantity: 1, importPrice: 0 });
};

const handleRemoveDetail = (keyToRemove) => {
    setReceiptDetails(receiptDetails.filter(item => item.key !== keyToRemove));
};

const onFinish = async (values) => {
    if (receiptDetails.length === 0) {
        message.error("Phiếu nhập phải có ít nhất một sản phẩm.");
        return;
    }
    const finalDetails = receiptDetails.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        importPrice: item.importPrice,
    }));
    const payload = {
        vendorId: values.vendorId,
        receiptCode: values.receiptCode || null,
        notes: values.notes || null,
        importDate: values.importDate ? values.importDate.toISOString() : new Date().toISOString(),
        status: values.status,
        details: finalDetails,
    };
    setLoading(true);
    try {
        const res = await createImportReceiptAPI(
            payload.vendorId,
            payload.details,
            payload.receiptCode,
            payload.notes,
            payload.importDate,
            payload.status
        );
        if (res.statusCode === 201) {
            notification.success({
                message: "Tạo Phiếu Nhập",
                description: `Tạo phiếu nhập (${STATUS_LABELS[payload.status] || payload.status}) ${payload.status === 'COMPLETED' ? 'và cập nhật kho' : ''} thành công!`,
            });
            form.resetFields();
            setReceiptDetails([]);
            navigate('/admin/list-receipt'); // This will trigger ManageImportReceipt to load with default sort
        } else {
            notification.error({
                message: "Tạo Phiếu Nhập",
                description: res.message || "Tạo phiếu nhập thất bại.",
            });
        }
    } catch (error) {
         notification.error({
            message: "Tạo Phiếu Nhập",
            description: error?.response?.data?.message || "Đã xảy ra lỗi khi tạo phiếu nhập.",
        });
    } finally {
        setLoading(false);
    }
};

 const detailColumns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku', width: 120 },
    { title: 'Tên Sản phẩm', dataIndex: 'productName', key: 'productName', ellipsis: true },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', align: 'center', width: 100 },
    {
        title: 'Giá nhập',
        dataIndex: 'importPrice',
        key: 'importPrice',
        render: (price) => formatCurrency(price) + ' đ',
        align: 'right',
        width: 150
    },
    {
        title: 'Thành tiền',
        key: 'lineTotal',
        render: (_, record) => formatCurrency(record.quantity * record.importPrice) + ' đ',
        align: 'right',
        width: 150
    },
    {
        title: 'Hành động',
        key: 'action',
        render: (_, record) => (
            <Popconfirm
                title="Xóa sản phẩm?"
                description="Bạn có chắc muốn xóa sản phẩm này khỏi phiếu nhập?"
                onConfirm={() => handleRemoveDetail(record.key)}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
        ),
        align: 'center',
        width: 100
    },
];

return (
    <>
        <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item><Link to="/admin">Admin</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/admin/list-receipt">Quản lý Nhập hàng</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Thêm mới</Breadcrumb.Item>
        </Breadcrumb>
        <Title level={3} style={{ marginBottom: 24 }}>Tạo Phiếu Nhập Hàng Mới</Title>

         <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'PENDING', quantity: 1, importPrice: 0, importDate: moment() }}>
             <Card title="Thông tin chung" style={{ marginBottom: 24 }}>
                 <Row gutter={24}>
                     <Col xs={24} md={8}>
                        <Form.Item
                            label="Nhà cung cấp"
                            name="vendorId"
                            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
                        >
                            <Select
                                placeholder="Chọn nhà cung cấp"
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {vendors.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                         <Form.Item label="Mã Phiếu Nhập (Tự động nếu bỏ trống)" name="receiptCode">
                            <Input prefix={<BarcodeOutlined />} placeholder="VD: PNK20240521001" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label="Ngày nhập" name="importDate">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" showTime={{ format: 'HH:mm' }} prefix={<CalendarOutlined />} />
                        </Form.Item>
                    </Col>
                     <Col xs={24} md={16}>
                        <Form.Item label="Ghi chú" name="notes">
                            <Input.TextArea rows={1} prefix={<FileTextOutlined />} placeholder="Ghi chú thêm về phiếu nhập..." />
                        </Form.Item>
                    </Col>
                     <Col xs={24} md={8}>
                          <Form.Item
                            label="Trạng thái & Cập nhật kho"
                            name="status"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                            tooltip={`Chọn '${STATUS_LABELS.COMPLETED}' sẽ cập nhật số lượng tồn kho ngay khi tạo phiếu.`}
                        >
                            <Select>
                                <Option value="PENDING"><ClockCircleOutlined /> {STATUS_LABELS.PENDING} (Chưa cập nhật kho)</Option>
                                <Option value="COMPLETED"><CheckCircleOutlined /> {STATUS_LABELS.COMPLETED} (Cập nhật kho ngay)</Option>
                            </Select>
                        </Form.Item>
                     </Col>
                </Row>
             </Card>
             <Card title="Thêm sản phẩm vào phiếu" style={{ marginBottom: 24 }}>
                 <Row gutter={24} align="bottom">
                    <Col xs={24} md={10}>
                         <Form.Item label="Sản phẩm" name="productId">
                            <Select
                                placeholder="Tìm và chọn sản phẩm"
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={(value, option) => setCurrentProduct(option?.data)}
                            >
                                 {products.map(p => (
                                    <Option key={p.id} value={p.id} data={p}>
                                        {`${p.name} (SKU: ${p.sku || 'N/A'})`}
                                    </Option>
                                ))}
                            </Select>
                         </Form.Item>
                     </Col>
                     <Col xs={12} md={4}>
                        <Form.Item label="Số lượng" name="quantity" >
                             <InputNumber min={1} style={{ width: '100%' }} onChange={setCurrentQuantity} />
                        </Form.Item>
                     </Col>
                    <Col xs={12} md={6}>
                         <Form.Item label="Giá nhập (VNĐ)" name="importPrice">
                             <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={formatCurrency}
                                parser={parseCurrency}
                                onChange={setCurrentImportPrice}
                                addonAfter="đ"
                            />
                        </Form.Item>
                     </Col>
                     <Col xs={24} md={4}>
                          <Form.Item label=" "> {/* For alignment */}
                            <Button type="dashed" onClick={handleAddDetail} icon={<PlusOutlined />} block>
                                Thêm vào phiếu
                            </Button>
                        </Form.Item>
                     </Col>
                 </Row>
             </Card>
             <Card title="Chi tiết sản phẩm trong phiếu" style={{ marginBottom: 24 }}>
                  <Table
                    columns={detailColumns}
                    dataSource={receiptDetails}
                    pagination={false}
                    rowKey="key"
                    bordered
                    summary={() => (
                        receiptDetails.length > 0 &&
                        <Table.Summary.Row style={{ background: '#fafafa' }}>
                            <Table.Summary.Cell index={0} colSpan={4} align="right"><Text strong>Tổng cộng:</Text></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>{formatCurrency(totalAmount)} đ</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
             </Card>
            <Form.Item>
                 <Button type="primary" htmlType="submit" loading={loading} icon={<CheckCircleOutlined />}>
                     {form.getFieldValue('status') === 'COMPLETED' ? `Tạo Phiếu (${STATUS_LABELS.COMPLETED}) & Nhập Kho` : `Tạo Phiếu (${STATUS_LABELS.PENDING})`}
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={() => navigate('/admin/list-receipt')}>
                    Hủy
                </Button>
            </Form.Item>
        </Form>
    </>
);
};
export default CreateImportReceipt;
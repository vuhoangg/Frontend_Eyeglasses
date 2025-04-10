import React, { useState, useEffect, useRef } from "react";
import {
    Form, Input, Button, Row, Col, notification, Typography, Breadcrumb, Select, DatePicker,
    InputNumber, Table, Popconfirm, message, Divider, Card
} from "antd";
import { createImportReceiptAPI } from '../../../services/api.importReceipt';
import { fetchAllVendorAPI } from '../../../services/api.vendor';
import { fetchAllProductAPI } from '../../../services/api.product'; // Import API sản phẩm
import { Link, useNavigate } from "react-router-dom";
import { PlusOutlined, DeleteOutlined, CalendarOutlined, ShopOutlined, UserOutlined, FileTextOutlined, BarcodeOutlined, DollarOutlined, DatabaseOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from 'moment'; // Dùng moment để xử lý DatePicker

const { Title, Text } = Typography;
const { Option } = Select;

// Hàm format tiền tệ
const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString('vi-VN'); // Bỏ 'đ' để InputNumber dễ parse
};
const parseCurrency = (value) => {
     if (!value) return 0;
     // Remove non-digit characters except decimal point if needed
     return value.replace(/[^0-9.-]+/g,"");
};


const CreateImportReceipt = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [receiptDetails, setReceiptDetails] = useState([]); // Mảng chứa các chi tiết phiếu nhập
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const [currentImportPrice, setCurrentImportPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const detailKey = useRef(0); // Dùng để tạo key duy nhất cho mỗi dòng detail

    // Load vendors và products khi component mount
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [vendorRes, productRes] = await Promise.all([
                    fetchAllVendorAPI(1, 1000, "", "", true), // Lấy NCC hoạt động
                    fetchAllProductAPI(1, 1000, "", null, null) // Lấy SP hoạt động (bỏ filter category/brand)
                ]);
                if (vendorRes.data) setVendors(vendorRes.data.data);
                if (productRes.data) setProducts(productRes.data.data);
            } catch (error) {
                notification.error({ message: "Lỗi tải dữ liệu", description: "Không thể tải danh sách NCC hoặc Sản phẩm." });
            }
        };
        loadInitialData();
    }, []);

    // Tính lại tổng tiền mỗi khi details thay đổi
    useEffect(() => {
        const newTotal = receiptDetails.reduce((sum, item) => sum + (item.quantity * item.importPrice), 0);
        setTotalAmount(newTotal);
    }, [receiptDetails]);

    // Xử lý thêm sản phẩm vào bảng details
    const handleAddDetail = () => {
        if (!currentProduct || currentQuantity <= 0 || currentImportPrice < 0) {
            message.warning("Vui lòng chọn sản phẩm, nhập số lượng và giá nhập hợp lệ.");
            return;
        }

        // Kiểm tra sản phẩm đã tồn tại trong bảng chưa
        const existingIndex = receiptDetails.findIndex(item => item.productId === currentProduct.id);

        if (existingIndex > -1) {
             // Cập nhật số lượng nếu đã tồn tại
            // const updatedDetails = [...receiptDetails];
            // updatedDetails[existingIndex].quantity += currentQuantity;
            // updatedDetails[existingIndex].importPrice = currentImportPrice; // Có thể cập nhật giá nếu muốn
            // setReceiptDetails(updatedDetails);
            message.warning(`Sản phẩm "${currentProduct.name}" đã có trong phiếu. Bạn có thể xóa và thêm lại với số lượng/giá mới.`);

        } else {
            // Thêm mới vào bảng
            detailKey.current += 1;
            const newDetail = {
                key: detailKey.current, // Key cho Table antd
                productId: currentProduct.id,
                productName: currentProduct.name, // Lưu tên để hiển thị
                sku: currentProduct.sku,          // Lưu SKU để hiển thị
                quantity: currentQuantity,
                importPrice: currentImportPrice,
            };
            setReceiptDetails([...receiptDetails, newDetail]);
        }

        // Reset form thêm chi tiết
        setCurrentProduct(null);
        setCurrentQuantity(1);
        setCurrentImportPrice(0);
         // Có thể cần reset Select sản phẩm nếu Select không tự reset
         form.setFieldsValue({ productId: null, quantity: 1, importPrice: 0 });
    };

     // Xóa sản phẩm khỏi bảng details
    const handleRemoveDetail = (keyToRemove) => {
        setReceiptDetails(receiptDetails.filter(item => item.key !== keyToRemove));
    };


    // Xử lý submit form chính
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
            receiptCode: values.receiptCode || null, // Backend cho phép null
            notes: values.notes || null,
            importDate: values.importDate ? values.importDate.toISOString() : new Date().toISOString(), // Lấy ngày hiện tại nếu không chọn
            status: values.status, // Trạng thái từ form
            details: finalDetails,
        };

        console.log("Data to Submit:", payload);
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
                    description: `Tạo phiếu nhập ${payload.status === 'COMPLETED' ? 'và cập nhật kho' : ''} thành công!`,
                });
                form.resetFields();
                setReceiptDetails([]); // Xóa bảng chi tiết
                navigate('/admin/list-receipt');
            } else {
                notification.error({
                    message: "Tạo Phiếu Nhập",
                    description: res.message || "Tạo phiếu nhập thất bại.",
                });
            }
        } catch (error) {
             console.error("Create receipt error:", error.response || error);
             notification.error({
                message: "Tạo Phiếu Nhập",
                description: error?.response?.data?.message || "Đã xảy ra lỗi khi tạo phiếu nhập.",
            });
        } finally {
            setLoading(false);
        }
    };

     // Cấu hình cột cho bảng chi tiết
     const detailColumns = [
        { title: 'SKU', dataIndex: 'sku', key: 'sku' },
        { title: 'Tên Sản phẩm', dataIndex: 'productName', key: 'productName' },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: 'Giá nhập',
            dataIndex: 'importPrice',
            key: 'importPrice',
            render: (price) => formatCurrency(price) + ' đ',
            align: 'right',
        },
        {
            title: 'Thành tiền',
            key: 'lineTotal',
            render: (_, record) => formatCurrency(record.quantity * record.importPrice) + ' đ',
            align: 'right',
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

             <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'PENDING', quantity: 1, importPrice: 0 }}>
                 {/* Phần thông tin chung */}
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
                            <Form.Item label="Ngày nhập" name="importDate" initialValue={moment()}>
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
                                tooltip="Chọn 'COMPLETED' sẽ cập nhật số lượng tồn kho ngay khi tạo phiếu."
                            >
                                <Select>
                                    <Option value="PENDING"><ClockCircleOutlined /> PENDING (Chưa cập nhật kho)</Option>
                                    <Option value="COMPLETED"><CheckCircleOutlined /> COMPLETED (Cập nhật kho ngay)</Option>
                                </Select>
                            </Form.Item>
                         </Col>

                    </Row>
                 </Card>

                 {/* Phần thêm sản phẩm */}
                 <Card title="Thêm sản phẩm vào phiếu" style={{ marginBottom: 24 }}>
                     <Row gutter={24} align="bottom">
                        <Col xs={24} md={10}>
                             <Form.Item label="Sản phẩm" name="productId">
                                 {/* Lưu ý: Cần xử lý khi sản phẩm rất nhiều */}
                                <Select
                                    placeholder="Tìm và chọn sản phẩm"
                                    showSearch
                                    allowClear
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onChange={(value, option) => setCurrentProduct(option?.data)} // Lưu cả object product khi chọn
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
                              <Form.Item label=" "> {/* Label trống để căn chỉnh */}
                                <Button type="dashed" onClick={handleAddDetail} icon={<PlusOutlined />} block>
                                    Thêm vào phiếu
                                </Button>
                            </Form.Item>
                         </Col>
                     </Row>
                 </Card>

                 {/* Bảng chi tiết sản phẩm đã thêm */}
                 <Card title="Chi tiết sản phẩm trong phiếu" style={{ marginBottom: 24 }}>
                      <Table
                        columns={detailColumns}
                        dataSource={receiptDetails}
                        pagination={false}
                        rowKey="key"
                        bordered
                        summary={() => (
                            <Table.Summary.Row>
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
                         {form.getFieldValue('status') === 'COMPLETED' ? 'Tạo Phiếu & Nhập Kho' : 'Tạo Phiếu Nhập (Pending)'}
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
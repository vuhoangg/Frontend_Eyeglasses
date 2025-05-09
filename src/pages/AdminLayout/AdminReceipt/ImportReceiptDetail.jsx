//src/pages/AdminLayout/AdminReceipt/ImportReceptDetail.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Drawer, Button, Table, Descriptions, Statistic, Typography, Tag, Divider, Row, Col, Spin, Tooltip, message, Space } from 'antd'; // Thêm message
import { fetchImportReceiptByIdAPI } from '../../../services/api.importReceipt';
import { ShoppingOutlined, DownloadOutlined, CloseOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js';

const { Title, Text } = Typography;

const PRINTED_RECEIPTS_STORAGE_KEY = 'printedImportReceipts';

// Helper function to manage localStorage
const getPrintedReceipts = () => {
    const stored = localStorage.getItem(PRINTED_RECEIPTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const addPrintedReceipt = (receiptId) => {
    const printedIds = getPrintedReceipts();
    if (!printedIds.includes(receiptId)) {
        printedIds.push(receiptId);
        localStorage.setItem(PRINTED_RECEIPTS_STORAGE_KEY, JSON.stringify(printedIds));
    }
};

const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const getStatusTag = (status) => {
    switch (status) {
        case 'PENDING': return <Tag icon={<ClockCircleOutlined />} color="orange">PENDING</Tag>;
        case 'COMPLETED': return <Tag icon={<CheckCircleOutlined />} color="success">COMPLETED</Tag>;
        case 'CANCELLED': return <Tag icon={<CloseCircleOutlined />} color="error">CANCELLED</Tag>;
        default: return <Tag color="default">{status || 'N/A'}</Tag>;
    }
};

const ImportReceiptDetail = ({ isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, onReceiptPrinted }) => { // Thêm onReceiptPrinted prop
    const [receiptDetails, setReceiptDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef();

    const handlePrint = () => {
        const element = componentRef.current;
        if (element && receiptDetails && receiptDetails.status === 'COMPLETED') {
            html2pdf()
                .from(element)
                .set({
                    margin: [10, 5, 10, 5],
                    filename: `PhieuNhapHang_${receiptDetails?.receiptCode || receiptDetails?.id}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, logging: true, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                })
                .save()
                .then(() => {
                    message.success(`Đã tải PDF cho phiếu ${receiptDetails.receiptCode || receiptDetails.id}.`);
                    addPrintedReceipt(receiptDetails.id); // Lưu vào localStorage
                    if (onReceiptPrinted) {
                        onReceiptPrinted(receiptDetails.id); // Gọi callback để ManageImportReceipt có thể cập nhật state nếu cần
                    }
                })
                .catch(err => {
                    message.error("Lỗi khi tạo PDF: " + err.message);
                    console.error("PDF generation error:", err);
                });
        } else {
            message.warn("Không thể tạo PDF: Component rỗng hoặc trạng thái phiếu không hợp lệ.");
            console.error("Không thể tạo PDF: Component rỗng hoặc trạng thái phiếu không hợp lệ.");
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (dataDetail?.id && isDetailOpen) {
                setLoading(true);
                try {
                    const res = await fetchImportReceiptByIdAPI(dataDetail.id);
                    if (res.data) {
                        setReceiptDetails(res.data);
                    } else {
                        message.error("Không thể tải chi tiết phiếu nhập.");
                        setReceiptDetails(null);
                    }
                } catch (error) {
                    message.error("Lỗi khi tải chi tiết phiếu nhập.");
                    console.error("Fetch receipt detail error:", error.response || error);
                    setReceiptDetails(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setReceiptDetails(null); // Reset khi không có dataDetail hoặc drawer đóng
            }
        };
        fetchDetails();
    }, [dataDetail, isDetailOpen]);

    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null); // Reset dataDetail khi đóng
        // setReceiptDetails(null); // Đã được xử lý trong useEffect
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
        } catch (e) {
            return 'Ngày không hợp lệ';
        }
    };

    const itemColumns = [
        // ... (giữ nguyên columns)
        {
            title: 'SKU',
            dataIndex: ['product', 'sku'],
            key: 'sku',
            render: (sku) => sku || 'N/A',
        },
        {
            title: 'Tên Sản phẩm',
            dataIndex: ['product', 'name'],
            key: 'productName',
            render: (name) => name || 'Sản phẩm không tồn tại',
        },
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
            render: (price) => formatCurrency(price),
            align: 'right',
        },
        {
            title: 'Thành tiền',
            key: 'lineTotal',
            render: (_, record) => formatCurrency(record.quantity * record.importPrice),
            align: 'right',
        },
    ];

    const canPrint = receiptDetails && receiptDetails.status === 'COMPLETED';
    const printButtonTooltip = canPrint ? "Tải phiếu nhập dưới dạng PDF" : "Chỉ có thể in phiếu nhập đã HOÀN THÀNH (COMPLETED).";

    return (
        <Drawer
            width={"80vw"}
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Chi Tiết Phiếu Nhập Hàng #{dataDetail?.id}</Title>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={isDetailOpen}
            destroyOnClose // Quan trọng: reset state của Drawer khi đóng hẳn
            extra={
                <Space>
                    <Tooltip title={printButtonTooltip}>
                        <span>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handlePrint}
                                disabled={!canPrint}
                            >
                                Tải PDF
                            </Button>
                        </span>
                    </Tooltip>
                    <Button icon={<CloseOutlined />} onClick={onClose}>
                        Đóng
                    </Button>
                </Space>
            }
        >
            {loading && <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>}

            {!loading && !receiptDetails && isDetailOpen && ( // Chỉ hiển thị nếu drawer mở và không có data
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Text type="secondary">Không có dữ liệu chi tiết để hiển thị hoặc phiếu không tồn tại.</Text>
                </div>
            )}

            {!loading && receiptDetails && (
                 <div ref={componentRef} style={{ padding: '20px' }}>
                    {/* ... (giữ nguyên cấu trúc HTML bên trong) ... */}
                     <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
                        <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
                            <Typography.Title level={3} style={{ margin: 0 }}>Kính mắt HUNO</Typography.Title>
                            <Typography.Paragraph style={{ margin: 0 }}>Địa chỉ: 28 Đông Các - Đống Đa - Hà Nội</Typography.Paragraph>
                            <Typography.Paragraph style={{ margin: 0 }}>Điện thoại: 0825-855-002 | Email: HunoEyeglasses@gmail.com</Typography.Paragraph>
                        </div>

                        <Row style={{ marginBottom: '15px' }}>
                            <Col span={12}>
                                <Typography.Title level={4} style={{ margin: 0 }}>PHIẾU NHẬP HÀNG</Typography.Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Mã phiếu: <Text strong>{receiptDetails.receiptCode || 'N/A'}</Text></Text><br />
                                <Text>Ngày nhập: <Text strong>{formatDate(receiptDetails.importDate)}</Text></Text>
                            </Col>
                        </Row>

                        <div style={{ border: '1px solid #e8e8e8', padding: '15px', marginBottom: '20px', borderRadius: '4px' }}>
                            <Typography.Title level={5} style={{ marginTop: 0, marginBottom: '10px', borderBottom: '1px dashed #ccc', paddingBottom: '5px' }}>Thông tin nhà cung cấp</Typography.Title>
                            <Descriptions layout="vertical" column={2} size="small" bordered={false}>
                                <Descriptions.Item labelStyle={{fontWeight: 'bold'}} label="Tên NCC">{receiptDetails.vendor?.name || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{fontWeight: 'bold'}} label="Điện thoại">{receiptDetails.vendor?.phoneNumber || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{fontWeight: 'bold'}} label="Địa chỉ" span={2}>{receiptDetails.vendor?.address || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{fontWeight: 'bold'}} label="Email">{receiptDetails.vendor?.email || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item labelStyle={{fontWeight: 'bold'}} label="Website">{receiptDetails.vendor?.websiteUrl || 'N/A'}</Descriptions.Item>
                            </Descriptions>
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <Typography.Title level={5} style={{ marginBottom: '10px' }}>Chi tiết sản phẩm</Typography.Title>
                            <Table
                                columns={itemColumns}
                                dataSource={receiptDetails.importReceiptDetails || []}
                                rowKey="id"
                                pagination={false}
                                bordered
                                size="small"
                                summary={() => (
                                    <Table.Summary.Row style={{ background: '#fafafa' }}>
                                        <Table.Summary.Cell index={0} colSpan={4} align="right"><Text strong>TỔNG CỘNG:</Text></Table.Summary.Cell>
                                        <Table.Summary.Cell index={4} align="right">
                                            <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>{formatCurrency(receiptDetails.totalAmount)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )}
                            />
                        </div>

                        <Row gutter={32} style={{ marginBottom: '20px' }}>
                            <Col span={16}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Ghi chú">{receiptDetails.notes || 'Không có ghi chú'}</Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái phiếu">{getStatusTag(receiptDetails.status)}</Descriptions.Item>
                                    <Descriptions.Item label="Ngày tạo phiếu">{formatDate(receiptDetails.creationDate)}</Descriptions.Item>
                                </Descriptions>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Statistic title={<Text strong>TỔNG TIỀN THANH TOÁN</Text>} value={receiptDetails.totalAmount} formatter={formatCurrency} valueStyle={{ fontSize: '24px', color: '#000', fontWeight: 'bold' }} />
                            </Col>
                        </Row>
                        
                        <Divider/>
                        <Row justify="space-around" style={{ marginTop: '30px', marginBottom: '30px' }}>
                            <Col style={{ textAlign: 'center' }}>
                                <Text strong>Người lập phiếu</Text><br/>
                                <Text>(Ký, họ tên)</Text>
                            </Col>
                            <Col style={{ textAlign: 'center' }}>
                                <Text strong>Thủ kho</Text><br/>
                                <Text>(Ký, họ tên)</Text>
                            </Col>
                             <Col style={{ textAlign: 'center' }}>
                                <Text strong>Nhà cung cấp</Text><br/>
                                <Text>(Ký, họ tên, đóng dấu)</Text>
                            </Col>
                        </Row>


                        <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', textAlign: 'center', fontSize: '12px', color: '#777' }}>
                            <Typography.Paragraph style={{ margin: '5px 0' }}>Cảm ơn quý Nhà Cung Cấp đã hợp tác!</Typography.Paragraph>
                            <Typography.Paragraph style={{ margin: '5px 0' }}>Website: HunoEyeglasses.com | Hotline: 1900-8252</Typography.Paragraph>
                        </div>
                    </div>
                </div>
            )}
            {/* ... (giữ nguyên style media print) ... */}
            <style type="text/css" media="print">
                {`
                    @page {
                        size: A4 portrait;
                        margin: 15mm; /* Reduce margin for more content space */
                    }
                    body {
                        -webkit-print-color-adjust: exact !important; /* For Chrome, Safari */
                        color-adjust: exact !important; /* Standard */
                         font-size: 10pt !important; /* Smaller base font for print */
                    }
                    .ant-drawer-header, .ant-drawer-extra, .ant-drawer-close {
                        display: none !important;
                    }
                    .ant-drawer-body {
                        padding: 0 !important;
                    }
                    table { page-break-inside:auto }
                    tr    { page-break-inside:avoid; page-break-after:auto }
                    thead { display:table-header-group }
                    tfoot { display:table-footer-group }

                    /* Custom styles for printed table */
                    table, th, td {
                        border: 1px solid #ddd !important; /* Ensure borders are visible */
                    }
                    th {
                        background-color: #f2f2f2 !important; /* Light grey background for table headers */
                    }
                    .ant-tag {
                        border: 1px solid #ccc !important;
                        background-color: transparent !important;
                        color: black !important;
                    }
                    .ant-tag > .anticon {
                        display: none; /* Hide icons in tags for cleaner print */
                    }
                `}
            </style>
        </Drawer>
    );
};

export default ImportReceiptDetail;
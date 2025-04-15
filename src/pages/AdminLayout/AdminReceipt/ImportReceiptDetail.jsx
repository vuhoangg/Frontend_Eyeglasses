//src/pages/AdminLayout/AdminReceipt/ImportReceptDetail.jsx
import React, { useEffect, useState, useRef } from 'react'; // Import useRef
import { Drawer, Button, Table, Card, Descriptions,Statistic, Typography, Tag, Divider, Row, Col, Spin } from 'antd';
import { fetchImportReceiptByIdAPI } from '../../../services/api.importReceipt';
import { ShoppingOutlined, ShopOutlined, CalendarOutlined, DollarOutlined, FileTextOutlined, BarcodeOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js'; // Import html2pdf

const { Title, Text } = Typography;

// Hàm format tiền tệ
const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Hàm lấy màu và icon Tag trạng thái
const getStatusTag = (status) => {
    switch (status) {
        case 'PENDING': return <Tag icon={<ClockCircleOutlined />} color="orange">PENDING</Tag>;
        case 'COMPLETED': return <Tag icon={<CheckCircleOutlined />} color="success">COMPLETED</Tag>;
        case 'CANCELLED': return <Tag icon={<CloseCircleOutlined />} color="error">CANCELLED</Tag>;
        default: return <Tag color="default">{status || 'N/A'}</Tag>;
    }
};

const ImportReceiptDetail = ({ isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail }) => {
    const [receiptDetails, setReceiptDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const componentRef = useRef(); // Create ref for print area

    const handlePrint = () => {
        const element = componentRef.current;

        if (element) {
            html2pdf()
                .from(element)
                .save(`PhieuNhapHang_${receiptDetails?.receiptCode}.pdf`); // Use receiptCode for filename
        } else {
            console.error("componentRef.current is null. Cannot generate PDF.");
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
                        console.error("Không thể tải chi tiết phiếu nhập.");
                        setReceiptDetails(null);
                    }
                } catch (error) {
                    console.error("Fetch receipt detail error:", error.response || error);
                    setReceiptDetails(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setReceiptDetails(null);
            }
        };
        fetchDetails();
    }, [dataDetail, isDetailOpen]);


    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null);
        setReceiptDetails(null);
    };

     const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    };

     const itemColumns = [
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
            extra={
                <>
                    <Button type="primary" onClick={handlePrint} style={{ marginRight: 8 }}>
                        Tải Phiếu Nhập PDF
                    </Button>
                    <Button type="primary" onClick={onClose}>
                        Đóng
                    </Button>
                </>
            }
        >
            {loading && <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>}

            {!loading && !receiptDetails && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Text type="secondary">Không có dữ liệu chi tiết để hiển thị.</Text>
                </div>
            )}

            {!loading && receiptDetails && (
                <div ref={componentRef} style={{ padding: '20px' }}> {/* Ref for print, padding for layout */}
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
                        {/* Header Section */}
                        <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
                            <Typography.Title level={3} style={{ margin: 0 }}>Kinh mắt HUNO</Typography.Title> {/* Replace with your company name */}
                            <Typography.Paragraph style={{ margin: 0 }}>Địa chỉ 28 Đông Các - Đống Đa - Hà Nội </Typography.Paragraph> {/* Replace with your company address */}
                            <Typography.Paragraph style={{ margin: 0 }}>Điện thoại: 0825-855-002 | Email: hunoEyegalassese.com</Typography.Paragraph> {/* Replace with your contact info */}
                        </div>

                        {/* Receipt Information */}
                        <Row style={{ marginBottom: '15px' }}>
                            <Col span={12}>
                                <Typography.Title level={4} style={{ margin: 0 }}>PHIẾU NHẬP HÀNG</Typography.Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Mã phiếu nhập: {receiptDetails.receiptCode || 'N/A'}</Text><br />
                                <Text>Ngày nhập: {formatDate(receiptDetails.importDate)}</Text>
                            </Col>
                        </Row>

                        {/* Vendor Information */}
                        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                            <Typography.Title level={5} style={{ marginTop: 0 }}>Thông tin nhà cung cấp:</Typography.Title>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Tên nhà cung cấp">{receiptDetails.vendor?.name || 'N/A'}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">{receiptDetails.vendor?.address || 'N/A'}</Descriptions.Item> {/* Assuming vendor has address */}
                                <Descriptions.Item label="Điện thoại">{receiptDetails.vendor?.phone || 'N/A'}</Descriptions.Item> {/* Assuming vendor has phone */}
                                {/* Thêm các thông tin nhà cung cấp khác nếu cần */}
                            </Descriptions>
                        </div>

                        {/* Product Items Table */}
                        <div style={{ marginBottom: '20px' }}>
                            <Typography.Title level={5}>Chi tiết sản phẩm nhập:</Typography.Title>
                            <Table
                                columns={itemColumns}
                                dataSource={receiptDetails.importReceiptDetails || []}
                                rowKey="id"
                                pagination={false}
                                bordered
                                size="small"
                                summary={() => (
                                    <Table.Summary.Row style={{ background: '#fafafa' }}>
                                        <Table.Summary.Cell index={0} colSpan={4} align="right"><Text strong>Tổng cộng:</Text></Table.Summary.Cell>
                                        <Table.Summary.Cell index={4} align="right">
                                            <Text strong style={{ color: '#f5222d', fontSize: '14px' }}>{formatCurrency(receiptDetails.totalAmount)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )}
                            />
                        </div>

                        {/* Totals and Notes */}
                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <Statistic title="Tổng tiền nhập" value={formatCurrency(receiptDetails.totalAmount)} valueStyle={{ fontSize: '20px', color: '#000' }} />
                            <Divider style={{ borderStyle: 'dashed' }} />
                            {/* <Text>Trạng thái phiếu nhập: {getStatusTag(receiptDetails.status)}</Text><br /> */}
                             <Text>Ngày tạo phiếu: {formatDate(receiptDetails.creationDate)}</Text>
                        </div>

                        {/* Footer Section */}
                        <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', textAlign: 'center', fontSize: '12px', color: '#777' }}>
                            <Typography.Paragraph style={{ margin: '5px 0' }}>Xin cảm ơn quý nhà cung cấp!</Typography.Paragraph> {/* Customize thank you message */}
                            <Typography.Paragraph style={{ margin: '5px 0' }}>Website: hunoEyegalassese.com| Hotline: 1900-8252</Typography.Paragraph> {/* Replace with your website and hotline */}
                        </div>
                    </div>
                </div>
            )}

            {/* Print Styles */}
            <style type="text/css" media="print">
                {`
                    @page {
                        size: A4;
                        margin: 20mm;
                    }

                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    .ant-drawer-extra {
                        display: none;
                    }

                    .ant-card {
                        border: 1px solid #ccc !important;
                        box-shadow: none !important;
                    }
                `}
            </style>
        </Drawer>
    );
};

export default ImportReceiptDetail;
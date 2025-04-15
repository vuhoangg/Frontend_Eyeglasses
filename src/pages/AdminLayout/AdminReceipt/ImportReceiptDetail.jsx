//src/pages/AdminLayout/AdminReceipt/ImportReceptDetail.jsx
import React, { useEffect, useState } from 'react';
import { Drawer, Button, Table, Card, Descriptions, Typography, Tag, Divider, Row, Col, Spin } from 'antd';
import { fetchImportReceiptByIdAPI } from '../../../services/api.importReceipt'; // API để lấy chi tiết
import { ShoppingOutlined, ShopOutlined, CalendarOutlined, DollarOutlined, FileTextOutlined, BarcodeOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns'; // Để format ngày

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

    useEffect(() => {
        const fetchDetails = async () => {
            if (dataDetail?.id && isDetailOpen) {
                setLoading(true);
                try {
                    // Dùng API fetchById để đảm bảo lấy dữ liệu mới nhất và đầy đủ relations
                    const res = await fetchImportReceiptByIdAPI(dataDetail.id);
                    if (res.data) {
                        setReceiptDetails(res.data);
                    } else {
                        notification.error({ message: "Lỗi", description: "Không thể tải chi tiết phiếu nhập." });
                         setReceiptDetails(null);
                    }
                } catch (error) {
                     console.error("Fetch receipt detail error:", error.response || error);
                    notification.error({ message: "Lỗi", description: "Không thể tải chi tiết phiếu nhập." });
                    setReceiptDetails(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setReceiptDetails(null); // Reset khi đóng hoặc không có ID
            }
        };
        fetchDetails();
    }, [dataDetail, isDetailOpen]);


    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null); // Reset data trigger khi đóng
        setReceiptDetails(null); // Reset data chi tiết
    };

     const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    };

     // Cấu hình cột cho bảng chi tiết sản phẩm trong Drawer
     const itemColumns = [
        {
            title: 'SKU',
            dataIndex: ['product', 'sku'], // Truy cập nested data
            key: 'sku',
            render: (sku) => sku || 'N/A',
        },
        {
            title: 'Tên Sản phẩm',
            dataIndex: ['product', 'name'], // Truy cập nested data
            key: 'productName',
             render: (name) => name || 'Sản phẩm không tồn tại', // Handle nếu product bị null
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
            width={"70vw"} // Rộng hơn để chứa bảng
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
                <Button type="primary" onClick={onClose}>
                    Đóng
                </Button>
            }
        >
            {loading && <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>}

            {!loading && !receiptDetails && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Text type="secondary">Không có dữ liệu chi tiết để hiển thị.</Text>
                </div>
            )}

            {!loading && receiptDetails && (
                <>
                    <Card bordered={false} style={{ marginBottom: 24 }}>
                        <Descriptions title="Thông tin chung" bordered column={2}>
                             <Descriptions.Item label={<><BarcodeOutlined /> Mã Phiếu</>}>{receiptDetails.receiptCode || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label={<><ShopOutlined /> Nhà cung cấp</>}>{receiptDetails.vendor?.name || 'N/A'}</Descriptions.Item>
                             <Descriptions.Item label={<><CalendarOutlined /> Ngày nhập</>}>{formatDate(receiptDetails.importDate)}</Descriptions.Item>
                             <Descriptions.Item label={<><DollarOutlined /> Tổng tiền</>}><Text strong style={{color: '#f5222d'}}>{formatCurrency(receiptDetails.totalAmount)}</Text></Descriptions.Item>
                             <Descriptions.Item label={<><CheckCircleOutlined /> Trạng thái</>}>{getStatusTag(receiptDetails.status)}</Descriptions.Item>
                             <Descriptions.Item label={<><FileTextOutlined /> Ghi chú</>} span={2}>{receiptDetails.notes || 'Không có ghi chú'}</Descriptions.Item>
                             <Descriptions.Item label="Hoạt động">
                                <Tag color={receiptDetails.isActive ? 'success' : 'error'}>
                                    {receiptDetails.isActive ? 'Active' : 'Inactive'}
                                </Tag>
                             </Descriptions.Item>
                              <Descriptions.Item label={<><CalendarOutlined /> Ngày tạo</>}>{formatDate(receiptDetails.creationDate)}</Descriptions.Item>

                        </Descriptions>
                    </Card>

                    <Divider orientation="left">Chi tiết sản phẩm</Divider>

                    <Card bordered={false}>
                        <Table
                            columns={itemColumns}
                            dataSource={receiptDetails.importReceiptDetails || []} // Lấy từ data fetch được
                            rowKey="id" // Dùng ID của detail làm key
                            pagination={false}
                            bordered
                            size="small"
                             summary={() => (
                                <Table.Summary.Row style={{ background: '#fafafa' }}>
                                    <Table.Summary.Cell index={0} colSpan={4} align="right"><Text strong>Tổng cộng:</Text></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right">
                                        <Text strong style={{ color: '#f5222d', fontSize: '14px' }}>{formatCurrency(receiptDetails.totalAmount)}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </Card>
                </>
            )}
        </Drawer>
    );
};

export default ImportReceiptDetail;
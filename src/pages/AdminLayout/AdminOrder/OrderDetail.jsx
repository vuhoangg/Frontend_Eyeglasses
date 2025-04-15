//src/pages/AdminLayout/AdminOrder/OrderDetail.jsx
import { Drawer, Button, Table, Card, Descriptions, Typography, Tag, Divider, Row, Col, Statistic } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { fetchOrderByIdAPI } from '../../../services/api.order';
import { fetchOrderItemsByOrderIdAPI } from '../../../services/api.orderItem';
import { formatNumber } from '../../../utils/format';
import { ShoppingOutlined, UserOutlined, CalendarOutlined, DollarOutlined, HomeOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import html2pdf from 'html2pdf.js'; // Import html2pdf.js

const { Title, Text } = Typography;

const OrderDetail = (props) => {
    const { isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadOrders } = props;
    const [orderDetailData, setOrderDetailData] = useState(null);
    const [orderItemsData, setOrderItemsData] = useState([]);
    const componentRef = useRef();

    const handlePrint = () => {
        const element = componentRef.current;

        if (element) {
            html2pdf()
                .from(element)
                .save(`HoaDon_Order_${dataDetail?.id}.pdf`);
        } else {
            console.error("componentRef.current is null. Cannot generate PDF.");
        }
    };

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (dataDetail && dataDetail.id) {
                try {
                    const orderRes = await fetchOrderByIdAPI(dataDetail.id);
                    if (orderRes.data) {
                        setOrderDetailData(orderRes.data);
                    }

                    const orderItemsRes = await fetchOrderItemsByOrderIdAPI(dataDetail.id);
                    if (orderItemsRes.data) {
                        setOrderItemsData(orderItemsRes.data);
                    }
                } catch (error) {
                    console.error("Error fetching order details or items:", error);
                }
            }
        };

        fetchOrderDetail();
    }, [dataDetail]);

    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null);
        setOrderDetailData(null);
        setOrderItemsData([]);
    };

    const getStatusTagColor = (status) => {
        const statusMap = {
            'Pending': 'orange',
            'Processing': 'blue',
            'Shipped': 'purple',
            'Delivered': 'green',
            'Cancelled': 'red',
            'Completed': 'green'
        };
        return statusMap[status] || 'default';
    };

    const orderItemColumns = [
        { title: 'STT', key: 'index', render: (text, record, index) => index + 1 },
        { title: 'Tên sản phẩm', dataIndex: ['product', 'name'], key: 'productName' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Đơn Giá', dataIndex: 'price', key: 'price', render: (price) => formatNumber(price) + ' đ' },
        { title: 'Thành tiền', key: 'total', render: (_, record) => formatNumber(record.quantity * record.price) + ' đ' },
    ];

    const calculateTotal = () => {
        return orderItemsData.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    return (
        <Drawer
            width={"80vw"}
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Chi tiết đơn hàng #{dataDetail?.id}</Title>
                </div>
            }
            onClose={onClose}
            open={isDetailOpen}
            maskClosable={false}
            extra={
                <>
                    <Button type="primary" onClick={handlePrint} style={{ marginRight: 8 }}>
                        Tải hóa đơn PDF
                    </Button>
                    <Button type="primary" onClick={onClose}>
                        Đóng
                    </Button>
                </>
            }
        >
            <div ref={componentRef} style={{ padding: '20px' }}>
                {orderDetailData ? (
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
                        {/* Phần đầu trang (Header) */}
                        <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
                            {/* Thêm Logo công ty ở đây nếu có */}
                            <Typography.Title level={3} style={{ margin: 0 }}>Kinh mắt HUNO </Typography.Title>
                            <Typography.Paragraph style={{ margin: 0 }}>Địa chỉ 28 Đông Các - Đống Đa - Hà Nội </Typography.Paragraph>
                            <Typography.Paragraph style={{ margin: 0 }}>Điện thoại: 0825-855-002 | Email: hunoEyegalassese.com</Typography.Paragraph>
                        </div>

                        {/* Thông tin hóa đơn */}
                        <Row style={{ marginBottom: '15px' }}>
                            <Col span={12}>
                                <Typography.Title level={4} style={{ margin: 0 }}>HÓA ĐƠN BÁN HÀNG</Typography.Title>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text>Số hóa đơn: #{dataDetail?.id}</Text><br />
                                <Text>Ngày lập: {new Date(orderDetailData.creationDate).toLocaleDateString('vi-VN')}</Text>
                            </Col>
                        </Row>

                        {/* Thông tin khách hàng */}
                        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                            <Typography.Title level={5} style={{ marginTop: 0 }}>Thông tin khách hàng:</Typography.Title>
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Tên khách hàng">{orderDetailData.user?.username}</Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">{orderDetailData.shippingAddress}</Descriptions.Item>
                                <Descriptions.Item label="Điện thoại">{orderDetailData.user?.phone}</Descriptions.Item>
                                <Descriptions.Item label="Email">{orderDetailData.user?.email}</Descriptions.Item>
                            </Descriptions>
                        </div>

                        {/* Bảng chi tiết sản phẩm */}
                        <div style={{ marginBottom: '20px' }}>
                            <Typography.Title level={5}>Chi tiết đơn hàng:</Typography.Title>
                            <Table
                                columns={orderItemColumns}
                                dataSource={orderItemsData}
                                rowKey="id"
                                pagination={false}
                                bordered
                                size="small"
                                summary={() => (
                                    <Table.Summary>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={4} align="right">
                                                <Text strong>Tổng cộng:</Text>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={4}>
                                                <Text type="danger" strong style={{ fontSize: '16px' }}>
                                                    {formatNumber(calculateTotal())} đ
                                                </Text>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}
                            />
                        </div>

                        {/* Tổng cộng và thanh toán */}
                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <Statistic title="Tổng tiền thanh toán" value={formatNumber(orderDetailData.totalAmount)} suffix=" đ" valueStyle={{ fontSize: '20px', color: '#000' }} />
                            <Text>Phương thức thanh toán: {orderDetailData.paymentMethod}</Text><br />
                            {/* <Text>Trạng thái đơn hàng: {orderDetailData.orderStatus?.name}</Text> */}
                        </div>

                        {/* Phần cuối trang (Footer) */}
                        <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', textAlign: 'center', fontSize: '12px', color: '#777' }}>
                            <Typography.Paragraph style={{ margin: '5px 0' }}>Cảm ơn quý khách đã mua hàng!</Typography.Paragraph>
                            <Typography.Paragraph style={{ margin: '5px 0' }}>Website: www.hunoeyeglasses.com | Hotline: 1900-8252</Typography.Paragraph>
                        </div>
                    </div>
                ) : (
                    <Card>
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Text type="secondary">Không có thông tin đơn hàng</Text>
                        </div>
                    </Card>
                )}
            </div>

            {/* CSS cho in ấn */}
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

export default OrderDetail;
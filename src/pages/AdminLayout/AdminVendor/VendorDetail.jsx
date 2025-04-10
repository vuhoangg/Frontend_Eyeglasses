import React, { useEffect } from 'react';
import { Drawer, Button, Descriptions, Typography, Tag, Divider, Image, Spin } from 'antd';
import { ShopOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LinkOutlined, InfoCircleOutlined, CalendarOutlined } from '@ant-design/icons';
// Có thể import fetchVendorByIdAPI nếu cần fetch lại chi tiết
// import { fetchVendorByIdAPI } from '../../../services/api.vendor';

const { Title, Text } = Typography;

const VendorDetail = ({ isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail }) => {

    // Nếu cần fetch lại dữ liệu chi tiết hơn khi mở Drawer:
    /*
    const [loading, setLoading] = useState(false);
    const [detailedVendorData, setDetailedVendorData] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (dataDetail?.id && isDetailOpen) {
                setLoading(true);
                try {
                    // const res = await fetchVendorByIdAPI(dataDetail.id);
                    // if (res.data) {
                    //     setDetailedVendorData(res.data);
                    // } else {
                    //     // Handle error
                    // }
                    setDetailedVendorData(dataDetail); // Tạm thời dùng dataDetail trực tiếp
                } catch (error) {
                    // Handle error
                } finally {
                    setLoading(false);
                }
            } else {
                setDetailedVendorData(null); // Reset khi đóng hoặc không có ID
            }
        };
        fetchDetails();
    }, [dataDetail, isDetailOpen]);
    */

    // Sử dụng trực tiếp dataDetail nếu đủ thông tin
    const vendor = dataDetail;

    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null); // Reset data khi đóng
        // setDetailedVendorData(null); // Reset nếu dùng state riêng
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Drawer
            width={"50vw"} // Kích thước có thể điều chỉnh
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShopOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Chi Tiết Nhà Cung Cấp</Title>
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
            {/* {loading && <Spin />} */}
            {/* {!loading && !detailedVendorData && <Text>Không có dữ liệu</Text>} */}
            {vendor ? (
                <Descriptions bordered layout="vertical" column={1}>
                    <Descriptions.Item label="ID">{vendor.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên Nhà cung cấp">{vendor.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">
                        <MailOutlined style={{ marginRight: 5 }} />{vendor.email || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        <PhoneOutlined style={{ marginRight: 5 }} />{vendor.phoneNumber || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                        <HomeOutlined style={{ marginRight: 5 }} />{vendor.address || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Website">
                        <LinkOutlined style={{ marginRight: 5 }} />
                        {vendor.websiteUrl ? (
                            <a href={vendor.websiteUrl} target="_blank" rel="noopener noreferrer">
                                {vendor.websiteUrl}
                            </a>
                        ) : 'N/A'}
                    </Descriptions.Item>
                     <Descriptions.Item label="Mô tả">
                        <InfoCircleOutlined style={{ marginRight: 5 }} />{vendor.description || 'N/A'}
                    </Descriptions.Item>
                     <Descriptions.Item label="Trạng thái">
                        <Tag color={vendor.isActive ? 'success' : 'error'}>
                            {vendor.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        <CalendarOutlined style={{ marginRight: 5 }} />{formatDate(vendor.creationDate)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật cuối">
                         <CalendarOutlined style={{ marginRight: 5 }} />{formatDate(vendor.modifiedDate)}
                    </Descriptions.Item>
                    {/* Có thể thêm phần hiển thị Logo nếu có */}
                    {/* <Descriptions.Item label="Logo">
                        {vendor.logo ? (
                            <Image width={100} src={`http://localhost:8082/images/vendor/${vendor.logo}`} />
                        ) : 'Chưa có logo'}
                    </Descriptions.Item> */}
                    {/* Có thể thêm bảng nhỏ hiển thị các phiếu nhập liên quan */}
                    {/* <Descriptions.Item label="Các phiếu nhập gần đây"> ... </Descriptions.Item> */}
                </Descriptions>
            ) : (
                 <div style={{ textAlign: 'center', padding: '20px' }}>
                     <Text type="secondary">Không có dữ liệu để hiển thị.</Text>
                 </div>
            )}
        </Drawer>
    );
};

export default VendorDetail;
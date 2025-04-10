import React, { useState, useEffect } from "react";
import { Space, Table, Popconfirm, notification, message, Row, Col, Tag, Button, Input, Select, DatePicker } from 'antd';
import { fetchAllImportReceiptAPI, deleteImportReceiptAPI } from '../../../services/api.importReceipt'; // API Phiếu nhập
import { fetchAllVendorAPI } from '../../../services/api.vendor'; // API Nhà cung cấp để lọc
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import UpdateImportReceipt from './UpdateImportReceipt'; // Tạo file này
import ImportReceiptDetail from './ImportReceiptDetail'; // Tạo file này
// import FormSearch from '../../../component/SearchForm'; // Có thể dùng SearchForm hoặc input thường
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'; // Để format ngày

const { RangePicker } = DatePicker;
const { Option } = Select;

// Hàm format tiền tệ
const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// Hàm lấy màu Tag trạng thái
const getStatusTagColor = (status) => {
    switch (status) {
        case 'PENDING': return 'orange';
        case 'COMPLETED': return 'success';
        case 'CANCELLED': return 'error';
        default: return 'default';
    }
};

const ManageImportReceipt = () => {
    const [dataReceipts, setDataReceipts] = useState([]);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        total: 0,
    });
    const [vendors, setVendors] = useState([]); // Danh sách NCC cho bộ lọc
    const [filters, setFilters] = useState({ // State cho các bộ lọc
        receiptCode: "",
        vendorId: null,
        status: "",
        dateRange: [], // [startDate, endDate]
    });
    const navigate = useNavigate();

    // Load danh sách NCC khi component mount
    useEffect(() => {
        const loadVendorsForFilter = async () => {
            try {
                const res = await fetchAllVendorAPI(1, 1000, "", "", true); // Lấy tất cả NCC đang hoạt động
                if (res.data) {
                    setVendors(res.data.data);
                }
            } catch (error) {
                console.error("Failed to load vendors for filter:", error);
            }
        };
        loadVendorsForFilter();
    }, []);


    const loadReceipts = async (page = 1, limit = 6, currentFilters = filters) => {
        try {
            const { receiptCode, vendorId, status, dateRange } = currentFilters;
            const startDate = dateRange && dateRange[0] ? dateRange[0].toISOString() : "";
            const endDate = dateRange && dateRange[1] ? dateRange[1].toISOString() : "";

            const res = await fetchAllImportReceiptAPI(page, limit, vendorId, receiptCode, status, startDate, endDate); // Mặc định lấy active=true
            if (res.data) {
                setDataReceipts(res.data.data);
                setPagination({
                    page: page,
                    limit: limit,
                    total: res.data.total,
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi tải Phiếu nhập",
                description: error?.response?.data?.message || "Không thể tải danh sách phiếu nhập.",
            });
        }
    };

    // Load lần đầu và khi filter thay đổi
    useEffect(() => {
        loadReceipts(1, pagination.limit, filters); // Load trang 1 khi filter thay đổi
    }, [filters]); // Chạy lại khi filters thay đổi

    // Load khi phân trang thay đổi
    const handleTableChange = (paginationInfo) => {
        loadReceipts(paginationInfo.current, paginationInfo.pageSize, filters);
    };

    const handleShowUpdateModal = (record) => {
        setDataUpdate(record);
        setIsModalUpdateOpen(true);
    };

    const handleShowDetailDrawer = (record) => {
        setDataDetail(record);
        setIsDetailOpen(true);
    };

     const confirmDelete = async (id) => {
        try {
            const res = await deleteImportReceiptAPI(id); // API xóa (soft delete)
            // Kiểm tra response từ backend, có thể là res.data, res.status, res.statusCode tùy cách bạn trả về
            if (res.statusCode === 200 || res.status === 200 || (res.data && res.data.success)) {
                notification.success({
                    message: "Xóa Phiếu nhập",
                    description: "Xóa phiếu nhập thành công!",
                });
                await loadReceipts(pagination.page, pagination.limit, filters);
            } else {
                notification.error({
                    message: "Xóa Phiếu nhập",
                    description: res.message || "Xóa phiếu nhập thất bại.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Xóa Phiếu nhập",
                description: error?.response?.data?.message || "Xóa phiếu nhập thất bại.",
            });
        }
    };

    const cancelDelete = () => {
        message.error('Hủy bỏ thao tác xóa');
    };

    // Cập nhật state bộ lọc
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => (
                <a onClick={() => handleShowDetailDrawer(record)}>{text}</a>
            ),
        },
        { title: 'Mã Phiếu', dataIndex: 'receiptCode', key: 'receiptCode' },
        {
            title: 'Nhà cung cấp',
            dataIndex: ['vendor', 'name'], // Truy cập nested data
            key: 'vendorName',
            render: (name) => name || 'N/A', // Hiển thị N/A nếu không có vendor
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => formatCurrency(amount),
            align: 'right',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusTagColor(status)}>
                    {status}
                </Tag>
            ),
        },
         {
            title: 'Ngày nhập',
            dataIndex: 'importDate',
            key: 'importDate',
            render: (date) => date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : 'N/A',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            render: (_, record) => (
                 <Space size="middle">
                    <EyeOutlined
                        style={{ cursor: "pointer", color: "#1890ff" }}
                        onClick={() => handleShowDetailDrawer(record)}
                    />
                    {/* Chỉ cho sửa nếu chưa COMPLETED hoặc chưa CANCELLED? (Tùy logic nghiệp vụ) */}
                    <EditOutlined
                        style={{ cursor: "pointer", color: "orange" }}
                         // Tạm thời cho sửa mọi trạng thái, logic trong modal sẽ kiểm tra
                        onClick={() => handleShowUpdateModal(record)}
                    />
                    {/* Chỉ cho xóa nếu chưa COMPLETED? (Tùy logic nghiệp vụ) */}
                     <Popconfirm
                        title="Xác nhận xóa"
                        description={`Bạn có chắc muốn xóa phiếu nhập "${record.receiptCode || record.id}"?`}
                        onConfirm={() => confirmDelete(record.id)}
                        onCancel={cancelDelete}
                        okText="Xóa"
                        cancelText="Hủy"
                         // Điều kiện disable xóa (ví dụ: không cho xóa phiếu đã hoàn thành)
                        // disabled={record.status === 'COMPLETED'}
                    >
                        <DeleteOutlined
                            style={{ cursor: "pointer" , color: "red" }}
                            // style={{
                            //     cursor: record.status !== 'COMPLETED' ? "pointer" : "not-allowed",
                            //     color: record.status !== 'COMPLETED' ? "red" : "grey"
                            // }}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
             {/* Filter Section */}
             <Row gutter={[16, 16]} style={{ marginBottom: '20px', padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                <Col xs={24} sm={12} md={6}>
                     <Input
                        placeholder="Tìm theo mã phiếu..."
                        value={filters.receiptCode}
                        onChange={(e) => handleFilterChange('receiptCode', e.target.value)}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Chọn nhà cung cấp"
                        style={{ width: '100%' }}
                        value={filters.vendorId}
                        onChange={(value) => handleFilterChange('vendorId', value)}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                    >
                        {vendors.map(vendor => (
                            <Option key={vendor.id} value={vendor.id}>{vendor.name}</Option>
                        ))}
                    </Select>
                </Col>
                 <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Chọn trạng thái"
                        style={{ width: '100%' }}
                        value={filters.status}
                        onChange={(value) => handleFilterChange('status', value)}
                        allowClear
                    >
                        <Option value="PENDING">PENDING</Option>
                        <Option value="COMPLETED">COMPLETED</Option>
                        <Option value="CANCELLED">CANCELLED</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                     <RangePicker
                        style={{ width: '100%' }}
                        value={filters.dateRange}
                        onChange={(dates) => handleFilterChange('dateRange', dates)}
                        format="DD/MM/YYYY"
                    />
                </Col>
                 {/* Nút Lọc có thể không cần nếu useEffect tự động lọc */}
                 {/* <Col>
                    <Button type="primary" icon={<FilterOutlined />} onClick={() => loadReceipts(1, pagination.limit, filters)}>
                        Lọc
                    </Button>
                 </Col> */}
             </Row>

            <Row justify="space-between" style={{ marginBottom: "20px" }}>
                {/* Search bar có thể gộp vào Filter */}
                <Col>
                    {/* Optional: Title */}
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/add-receipt')} // Điều hướng đến trang tạo mới
                    >
                        Thêm Phiếu nhập
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={dataReceipts}
                rowKey="id"
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['6', '10', '20', '50'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                onChange={handleTableChange}
                bordered
            />

            <UpdateImportReceipt
                isModalOpen={isModalUpdateOpen}
                setIsModalOpen={setIsModalUpdateOpen}
                receiptData={dataUpdate} // Truyền receiptData thay vì orderData
                reloadReceipts={() => loadReceipts(pagination.page, pagination.limit, filters)} // Đổi tên hàm reload
            />

            <ImportReceiptDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                 // Không cần reload ở đây trừ khi detail có action sửa đổi
            />
        </>
    );
};

export default ManageImportReceipt;
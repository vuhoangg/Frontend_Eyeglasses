//src/pages/AdminLayout/AdminReceipt/ManageImportReceipt.jsx
import React, { useState, useEffect, useCallback } from "react"; // Thêm useCallback
import { Space, Table, Popconfirm, notification, message, Row, Col, Tag, Button, Input, Select, DatePicker, Tooltip } from 'antd';
import { fetchAllImportReceiptAPI, deleteImportReceiptAPI } from '../../../services/api.importReceipt';
import { fetchAllVendorAPI } from '../../../services/api.vendor';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import UpdateImportReceipt from './UpdateImportReceipt';
import ImportReceiptDetail from './ImportReceiptDetail';
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PRINTED_RECEIPTS_STORAGE_KEY = 'printedImportReceipts';

const getPrintedReceiptsFromStorage = () => {
    const stored = localStorage.getItem(PRINTED_RECEIPTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const getStatusTagColor = (status) => {
    // ... (giữ nguyên)
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
    const [vendors, setVendors] = useState([]);
    const [filters, setFilters] = useState({
        receiptCode: "",
        vendorId: null,
        status: "",
        dateRange: [],
    });
    const navigate = useNavigate();
    const [printedReceiptIds, setPrintedReceiptIds] = useState(getPrintedReceiptsFromStorage()); // State để lưu ID các phiếu đã in

    // Callback khi một phiếu được in thành công từ ImportReceiptDetail
    const handleReceiptPrinted = useCallback((receiptId) => {
        setPrintedReceiptIds(prevIds => {
            if (!prevIds.includes(receiptId)) {
                return [...prevIds, receiptId];
            }
            return prevIds;
        });
    }, []);


    useEffect(() => {
        const loadVendorsForFilter = async () => {
            // ... (giữ nguyên)
            try {
                const res = await fetchAllVendorAPI(1, 1000, "", "", true);
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
        // ... (giữ nguyên)
        try {
            const { receiptCode, vendorId, status, dateRange } = currentFilters;
            const startDate = dateRange && dateRange[0] ? dateRange[0].toISOString() : "";
            const endDate = dateRange && dateRange[1] ? dateRange[1].toISOString() : "";

            const res = await fetchAllImportReceiptAPI(page, limit, vendorId, receiptCode, status, startDate, endDate);
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

    useEffect(() => {
        loadReceipts(1, pagination.limit, filters);
    }, [filters, pagination.limit]); // Thêm pagination.limit để load lại khi thay đổi limit

    const handleTableChange = (paginationInfo) => {
        // setPagination(prev => ({...prev, page: paginationInfo.current, limit: paginationInfo.pageSize})); // Cập nhật state trước
        loadReceipts(paginationInfo.current, paginationInfo.pageSize, filters);
    };

    const handleShowUpdateModal = (record) => {
        const isPrintedClientSide = printedReceiptIds.includes(record.id);
        setDataUpdate({ ...record, isPrintedClientSide }); // Truyền cờ đã in
        setIsModalUpdateOpen(true);
    };

    const handleShowDetailDrawer = (record) => {
        setDataDetail(record);
        setIsDetailOpen(true);
    };

    const confirmDelete = async (id) => {
        // ... (giữ nguyên)
        try {
            const res = await deleteImportReceiptAPI(id);
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

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const columns = [
        // ... (ID, Mã Phiếu, Nhà cung cấp, Tổng tiền, Trạng thái, Ngày nhập, Ngày tạo giữ nguyên)
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => (
                <a onClick={() => handleShowDetailDrawer(record)}>{text}</a>
            ),
        },
        { title: 'Mã Phiếu', dataIndex: 'receiptCode', key: 'receiptCode', ellipsis: true },
        {
            title: 'Nhà cung cấp',
            dataIndex: ['vendor', 'name'],
            key: 'vendorName',
            render: (name) => name || 'N/A',
            ellipsis: true,
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
            title: 'Ngày tạo',
            dataIndex: 'creationDate',
            key: 'creationDate',
            render: (date) => date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : 'N/A',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            fixed: 'right', // Giữ cột hành động cố định khi cuộn ngang
            render: (_, record) => {
                let canEdit = true;
                let editTooltipMessage = "Sửa phiếu nhập";
                if (record.creationDate) {
                    const creationMoment = moment(record.creationDate);
                    const now = moment();
                    if (now.diff(creationMoment, 'days') > 7) {
                        canEdit = false;
                        editTooltipMessage = "Không thể sửa phiếu đã tạo quá 7 ngày.";
                    }
                }

                // Nếu phiếu đã COMPLETED VÀ đã được in (theo client-side), thì cũng không cho sửa các thông tin quan trọng
                // Hoặc nếu phiếu là CANCELLED
                const isPrintedClientSide = printedReceiptIds.includes(record.id);
                if ((record.status === 'COMPLETED' && isPrintedClientSide) || record.status === 'CANCELLED') {
                    canEdit = false; // Khóa sửa nếu đã COMPLETED và đã in, hoặc đã CANCELLED
                    if (record.status === 'CANCELLED') {
                        editTooltipMessage = "Không thể sửa phiếu đã hủy.";
                    } else {
                        editTooltipMessage = "Không thể sửa phiếu đã hoàn thành và đã được in.";
                    }
                }


                return (
                    <Space size="middle">
                        <Tooltip title="Xem chi tiết">
                            <EyeOutlined
                                style={{ cursor: "pointer", color: "#1890ff" }}
                                onClick={() => handleShowDetailDrawer(record)}
                            />
                        </Tooltip>
                        <Tooltip title={editTooltipMessage}>
                            <span>
                                <EditOutlined
                                    style={{
                                        cursor: canEdit ? "pointer" : "not-allowed",
                                        color: canEdit ? "orange" : "grey"
                                    }}
                                    onClick={() => canEdit && handleShowUpdateModal(record)}
                                    disabled={!canEdit}
                                />
                            </span>
                        </Tooltip>
                         <Tooltip title={record.status === 'COMPLETED' || record.status === 'CANCELLED' ? "Không thể xóa phiếu đã hoàn thành hoặc đã hủy" : "Xóa phiếu nhập"}>
                             <span>
                                <Popconfirm
                                    title="Xác nhận xóa"
                                    description={`Bạn có chắc muốn xóa phiếu nhập "${record.receiptCode || record.id}"? Hành động này không thể hoàn tác.`}
                                    onConfirm={() => confirmDelete(record.id)}
                                    onCancel={cancelDelete}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    disabled={record.status === 'COMPLETED' || record.status === 'CANCELLED'}
                                >
                                    <DeleteOutlined
                                        style={{
                                            cursor: (record.status !== 'COMPLETED' && record.status !== 'CANCELLED') ? "pointer" : "not-allowed",
                                            color: (record.status !== 'COMPLETED' && record.status !== 'CANCELLED') ? "red" : "grey"
                                        }}
                                        disabled={record.status === 'COMPLETED' || record.status === 'CANCELLED'}
                                    />
                                </Popconfirm>
                            </span>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            {/* ... (Filter Section giữ nguyên) ... */}
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
            </Row>

            <Row justify="space-between" style={{ marginBottom: "20px" }}>
                <Col />
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/add-receipt')}
                    >
                        Thêm Phiếu nhập
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={dataReceipts}
                rowKey="id"
                scroll={{ x: 1000 }} // Cho phép cuộn ngang nếu cần
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['6', '10', '20', '50'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
                }}
                onChange={handleTableChange}
                bordered
            />

            <UpdateImportReceipt
                isModalOpen={isModalUpdateOpen}
                setIsModalOpen={setIsModalUpdateOpen}
                receiptData={dataUpdate} // dataUpdate đã chứa isPrintedClientSide
                reloadReceipts={() => loadReceipts(pagination.page, pagination.limit, filters)}
            />

            <ImportReceiptDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                onReceiptPrinted={handleReceiptPrinted} // Truyền callback
            />
        </>
    );
};

export default ManageImportReceipt;
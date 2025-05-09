import React, { useState, useEffect, useCallback } from "react";
import { Space, Table, Popconfirm, notification, message, Row, Col, Tag, Button, Input, Select, DatePicker, Tooltip } from 'antd';
import { fetchAllImportReceiptAPI, deleteImportReceiptAPI } from '../../../services/api.importReceipt';
import { fetchAllVendorAPI } from '../../../services/api.vendor';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
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

const STATUS_LABELS = {
    PENDING: 'Chờ xử lý',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
};

const formatCurrency = (value) => {
if (value === null || value === undefined) return 'N/A';
return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

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
const [vendors, setVendors] = useState([]);
const [filters, setFilters] = useState({
    receiptCode: "",
    vendorId: null,
    status: "",
    dateRange: [],
});
const navigate = useNavigate();
const [printedReceiptIds, setPrintedReceiptIds] = useState(getPrintedReceiptsFromStorage());
const [sortOrder, setSortOrder] = useState('DESC'); // Default: newest first

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
        try {
            const res = await fetchAllVendorAPI(1, 1000, "", "", true); // Fetch active vendors
            if (res.data) {
                setVendors(res.data.data);
            }
        } catch (error) {
            console.error("Failed to load vendors for filter:", error);
        }
    };
    loadVendorsForFilter();
}, []);

const loadReceipts = useCallback(async (page = 1, limit = pagination.limit, currentFilters = filters, currentSortOrder = sortOrder) => {
    try {
        const { receiptCode, vendorId, status, dateRange } = currentFilters;
        const startDate = dateRange && dateRange[0] ? moment(dateRange[0]).startOf('day').toISOString() : "";
        const endDate = dateRange && dateRange[1] ? moment(dateRange[1]).endOf('day').toISOString() : "";

        // Always sort by creationDate, order by currentSortOrder
        const res = await fetchAllImportReceiptAPI(page, limit, vendorId, receiptCode, status, startDate, endDate, 'creationDate', currentSortOrder);
        if (res.data) {
            setDataReceipts(res.data.data);
            setPagination(prev => ({
                ...prev,
                page: page,
                limit: limit,
                total: res.data.total,
            }));
        } else {
             setDataReceipts([]);
             setPagination(prev => ({...prev, page:1, total:0}));
        }
    } catch (error) {
        notification.error({
            message: "Lỗi tải Phiếu nhập",
            description: error?.response?.data?.message || "Không thể tải danh sách phiếu nhập.",
        });
    }
}, [pagination.limit, sortOrder]); // Include dependencies for useCallback

useEffect(() => {
    // Load receipts on initial mount and when filters or sortOrder change
    // Page 1 is fetched by default due to loadReceipts signature
    loadReceipts(1, pagination.limit, filters, sortOrder);
}, [filters, sortOrder, pagination.limit, loadReceipts]); // Add loadReceipts to dependency array

const handleTableChange = (paginationInfo, tableFilters, sorter) => {
    // Ant Design's Table onChange sorter can be used if you want to sort by other columns
    // For now, we only sort by creationDate via our button
    loadReceipts(paginationInfo.current, paginationInfo.pageSize, filters, sortOrder);
};

const handleShowUpdateModal = (record) => {
    const isPrintedClientSide = printedReceiptIds.includes(record.id);
    setDataUpdate({ ...record, isPrintedClientSide });
    setIsModalUpdateOpen(true);
};

const handleShowDetailDrawer = (record) => {
    setDataDetail(record);
    setIsDetailOpen(true);
};

const confirmDelete = async (id) => {
    try {
        const res = await deleteImportReceiptAPI(id);
        if (res.statusCode === 200 || res.status === 200 || (res.data && res.data.success)) {
            notification.success({
                message: "Xóa Phiếu nhập",
                description: "Xóa phiếu nhập thành công!",
            });
            // Reload current page after delete or go to page 1 if current page becomes empty
            const newTotal = pagination.total -1;
            const newTotalPages = Math.ceil(newTotal / pagination.limit);
            let currentPageToLoad = pagination.page;
            if(pagination.page > newTotalPages && newTotalPages > 0) {
                currentPageToLoad = newTotalPages;
            } else if (newTotalPages === 0) {
                currentPageToLoad = 1;
            }
            await loadReceipts(currentPageToLoad, pagination.limit, filters, sortOrder);

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
    // No need to set page to 1 here, useEffect will handle it if filters change
};

const handleChangeSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'DESC' ? 'ASC' : 'DESC'));
};

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 70,
        render: (text, record) => (
            <a onClick={() => handleShowDetailDrawer(record)}>{text}</a>
        ),
    },
    { title: 'Mã Phiếu', dataIndex: 'receiptCode', key: 'receiptCode', ellipsis: true, width: 150 },
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
        width: 150,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (status) => (
            <Tag color={getStatusTagColor(status)}>
                {STATUS_LABELS[status] || status}
            </Tag>
        ),
    },
    {
        title: 'Ngày nhập',
        dataIndex: 'importDate',
        key: 'importDate',
        render: (date) => date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : 'N/A',
        width: 150,
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'creationDate',
        key: 'creationDate',
        render: (date) => date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : 'N/A',
        width: 150,
    },
    {
        title: 'Hành động',
        key: 'action',
        width: 120,
        fixed: 'right',
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
            const isPrintedClientSide = printedReceiptIds.includes(record.id);
            if ((record.status === 'COMPLETED' && isPrintedClientSide) || record.status === 'CANCELLED') {
                canEdit = false;
                if (record.status === 'CANCELLED') {
                    editTooltipMessage = `Không thể sửa phiếu đã ${STATUS_LABELS.CANCELLED}.`;
                } else {
                    editTooltipMessage = `Không thể sửa phiếu đã ${STATUS_LABELS.COMPLETED} và đã được in.`;
                }
            }
            return (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <EyeOutlined style={{ cursor: "pointer", color: "#1890ff" }} onClick={() => handleShowDetailDrawer(record)} />
                    </Tooltip>
                    <Tooltip title={editTooltipMessage}>
                        <span>
                            <EditOutlined
                                style={{ cursor: canEdit ? "pointer" : "not-allowed", color: canEdit ? "orange" : "grey" }}
                                onClick={() => canEdit && handleShowUpdateModal(record)}
                                disabled={!canEdit}
                            />
                        </span>
                    </Tooltip>
                     <Tooltip title={record.status === 'COMPLETED' || record.status === 'CANCELLED' ? `Không thể xóa phiếu đã ${STATUS_LABELS[record.status] || record.status}` : "Xóa phiếu nhập"}>
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
                    <Option value="">Tất cả trạng thái</Option>
                    <Option value="PENDING">{STATUS_LABELS.PENDING}</Option>
                    <Option value="COMPLETED">{STATUS_LABELS.COMPLETED}</Option>
                    <Option value="CANCELLED">{STATUS_LABELS.CANCELLED}</Option>
                </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <RangePicker
                    style={{ width: '100%' }}
                    value={filters.dateRange?.map(date => date ? moment(date) : null)}
                    onChange={(dates) => handleFilterChange('dateRange', dates ? dates.map(date => date ? date.toDate() : null) : [])}
                    format="DD/MM/YYYY"
                />
            </Col>
        </Row>

        <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
            <Col>
                <Button
                    onClick={handleChangeSortOrder}
                    icon={sortOrder === 'DESC' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
                >
                    Ngày tạo: {sortOrder === 'DESC' ? 'Mới nhất' : 'Cũ nhất'}
                </Button>
            </Col>
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
            scroll={{ x: 1000 }}
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
            receiptData={dataUpdate}
            reloadReceipts={() => loadReceipts(pagination.page, pagination.limit, filters, sortOrder)}
        />

        <ImportReceiptDetail
            isDetailOpen={isDetailOpen}
            setIsDetailOpen={setIsDetailOpen}
            dataDetail={dataDetail}
            setDataDetail={setDataDetail}
            onReceiptPrinted={handleReceiptPrinted}
        />
    </>
);
};
export default ManageImportReceipt;
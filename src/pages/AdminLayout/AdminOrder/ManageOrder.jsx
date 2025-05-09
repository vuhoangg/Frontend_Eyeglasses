// src/pages/AdminLayout/AdminOrder/ManageOrder.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Space, Table, Popconfirm, notification, message, Row, Col, Tag, Button, Input, Select, Tooltip, Modal } from 'antd';
import { fetchAllOrdersAPI, deleteOrderAPI, updateOrderAPI } from '../../../services/api.order';
import { fetchAllOrderStatusAPI } from '../../../services/api.orderStatus';
import {
    DeleteOutlined, EditOutlined, EyeOutlined,
    SortAscendingOutlined, SortDescendingOutlined,
    SearchOutlined, ClearOutlined,
    ClockCircleOutlined, CheckCircleOutlined, SendOutlined, CloseCircleOutlined, RollbackOutlined, SolutionOutlined // Đã import SolutionOutlined
} from '@ant-design/icons';
import UpdateOrder from './UpdateOrder';
import OrderDetail from './OrderDetail';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';

const { Option } = Select;

// ID Trạng thái từ API của bạn để tham chiếu:
// 1: "Chờ xử lý"
// 2: "Xác nhận đơn"
// 3: "Đang Giao"
// 4: "Giao thành công"
// 5: "Huỷ Đơn"
// 6: "Hoàn Hàng"
// 8: "Đang chuẩn bị"

const ManageOrder = () => {
    const [dataOrders, setDataOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '12', '20', '50'],
    });

    const [orderStatuses, setOrderStatuses] = useState([]);
    const [filters, setFilters] = useState({
        customerName: "",
        statusId: null,
    });
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'creationDate',
        sortOrder: 'DESC',
    });

    const searchInputRef = useRef(null);

    useEffect(() => {
        const loadOrderStatuses = async () => {
            try {
                const res = await fetchAllOrderStatusAPI();
                if (res.data && res.data.data) {
                    setOrderStatuses(res.data.data.filter(status => status.isActive));
                } else {
                    setOrderStatuses([]);
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi tải trạng thái đơn hàng",
                    description: error.message || "Không thể tải danh sách trạng thái.",
                });
            }
        };
        loadOrderStatuses();
    }, []);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchAllOrdersAPI(
                pagination.current,
                pagination.pageSize,
                filters.customerName,
                filters.statusId,
                sortConfig.sortBy,
                sortConfig.sortOrder
            );

            if (res.data && res.data.data) {
                setDataOrders(res.data.data);
                setPagination(prev => ({
                    ...prev,
                    current: res.data.currentPage,
                    pageSize: res.data.limit,
                    total: res.data.total,
                }));
            } else {
                setDataOrders([]);
                setPagination(prev => ({ ...prev, current: 1, total: 0 }));
            }
        } catch (error) {
            notification.error({
                message: "Lỗi tải đơn hàng",
                description: error.response?.data?.message || error.message || "Không thể tải danh sách đơn hàng.",
            });
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, filters, sortConfig]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleDeleteOrder = async (orderId) => {
        try {
            const res = await deleteOrderAPI(orderId);
            if (res.statusCode === 200 || (res.data && res.data.message === 'Order deleted successfully (soft delete)')) {
                notification.success({
                    message: "Xóa đơn hàng",
                    description: "Xóa đơn hàng thành công!",
                });
                const newTotal = pagination.total - 1;
                const newTotalPages = Math.ceil(newTotal / pagination.pageSize);
                let pageToLoad = pagination.current;

                if (pagination.current > newTotalPages && newTotalPages > 0) {
                    pageToLoad = newTotalPages;
                } else if (newTotalPages === 0 && dataOrders.length === 1 && pagination.current > 1) {
                    pageToLoad = pagination.current - 1;
                } else if (newTotalPages === 0) {
                    pageToLoad = 1;
                }
                if (pageToLoad !== pagination.current) {
                    setPagination(prev => ({ ...prev, current: pageToLoad }));
                } else {
                    loadOrders();
                }
            } else {
                notification.error({
                    message: "Xóa đơn hàng",
                    description: res.message || "Xóa đơn hàng thất bại.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Xóa đơn hàng",
                description: error.response?.data?.message || error.message || "Xóa đơn hàng thất bại.",
            });
        }
    };

    const handleShowUpdateModal = (record) => {
        setDataUpdate(record);
        setIsModalUpdateOpen(true);
    };

    const handleShowDetailDrawer = (record) => {
        setDataDetail(record);
        setIsDetailOpen(true);
    };

    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilters(prev => ({ ...prev, customerName: value }));
            setPagination(prev => ({ ...prev, current: 1 }));
        }, 500),
        []
    );

    const handleCustomerNameChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleStatusFilterChange = (value) => {
        setFilters(prev => ({ ...prev, statusId: value }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({ customerName: "", statusId: null });
        if (searchInputRef.current) {
            searchInputRef.current.input.value = "";
        }
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleSortToggle = () => {
        setSortConfig(prev => ({
            ...prev,
            sortOrder: prev.sortOrder === 'DESC' ? 'ASC' : 'DESC',
        }));
    };

    const handleTableChange = (newPagination) => {
        setPagination(prev => ({
            ...prev,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        }));
    };

    const handleQuickStatusChange = async (orderId, newStatusId, actionName) => {
        const orderToUpdate = dataOrders.find(order => order.id === orderId);
        if (!orderToUpdate) {
            notification.error({ message: "Lỗi", description: "Không tìm thấy đơn hàng." });
            return;
        }

        Modal.confirm({
            title: `Xác nhận ${actionName}`,
            content: `Bạn có chắc muốn '${actionName.toLowerCase()}' cho đơn hàng #${orderId}?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                try {
                    setLoading(true);
                    const response = await updateOrderAPI(
                        orderId,
                        orderToUpdate.user?.id,
                        newStatusId,
                        orderToUpdate.totalAmount,
                        orderToUpdate.shippingAddress,
                        orderToUpdate.paymentMethod,
                        orderToUpdate.promotion?.id || null,
                        orderToUpdate.isActive
                    );

                    if (response.data) {
                        notification.success({
                            message: "Thành công",
                            description: `Đơn hàng #${orderId} đã được ${actionName.toLowerCase()}.`,
                        });
                        loadOrders();
                    } else {
                        notification.error({
                            message: "Thất bại",
                            description: response.message || `Không thể ${actionName.toLowerCase()} đơn hàng.`,
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: error.response?.data?.message || `Có lỗi xảy ra khi ${actionName.toLowerCase()} đơn hàng.`,
                    });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const columns = [
        {
            title: 'ID', dataIndex: 'id', key: 'id', width: 60,
            render: (text, record) => (<a onClick={() => handleShowDetailDrawer(record)}>{text}</a>),
        },
        {
            title: 'Khách hàng', dataIndex: ['user', 'username'], width: 130, key: 'customerName',
            ellipsis: true,
        },
        { title: 'SĐT', dataIndex: ['user', 'phone'], key: 'phone', ellipsis: true, width: 100 },
        {
            title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', align: 'right', width: 130,
            render: (amount) => Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Trạng thái', dataIndex: ['orderStatus', 'name'], key: 'statusName', width: 150, // Tăng width một chút
            render: (statusName, record) => {
                const statusId = record.orderStatus?.id;
                // ID Trạng thái từ API của bạn khớp với key của statusMap
                const statusMap = {
                    1: { color: 'orange', name: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
                    2: { color: 'blue', name: 'Xác nhận đơn', icon: <CheckCircleOutlined /> },
                    8: { color: 'cyan', name: 'Đang chuẩn bị', icon: <SolutionOutlined /> },
                    3: { color: 'purple', name: 'Đang giao', icon: <SendOutlined /> },
                    4: { color: 'success', name: 'Giao thành công', icon: <CheckCircleOutlined /> },
                    5: { color: 'error', name: 'Huỷ Đơn', icon: <CloseCircleOutlined /> }, // Đã sửa name
                    6: { color: 'gold', name: 'Hoàn Hàng', icon: <RollbackOutlined /> },   // Đã sửa name
                };
                const statusInfo = statusMap[statusId] || { color: 'default', name: statusName || 'N/A', icon: null };
                return <Tag icon={statusInfo.icon} color={statusInfo.color}>{statusInfo.name}</Tag>;
            },
        },
        {
            title: 'Ngày tạo', dataIndex: 'creationDate', key: 'creationDate', width: 150,
            render: (text) => text ? format(new Date(text), 'dd/MM/yyyy HH:mm') : 'N/A',
        },
        {
            title: 'Hành động', key: 'action', width: 190, fixed: 'right', // Tăng width một chút
            render: (_, record) => {
                const currentStatusId = record.orderStatus?.id;
                const actions = [];

                actions.push(
                    <Tooltip title="Xem chi tiết" key="view">
                        <Button type="text" shape="circle" icon={<EyeOutlined />} onClick={() => handleShowDetailDrawer(record)} />
                    </Tooltip>
                );

                // Các ID trạng thái cuối cùng từ API: 4 (Giao thành công), 5 (Huỷ Đơn), 6 (Hoàn Hàng)
                const finalStatusIds = [4, 5, 6];

                if (!finalStatusIds.includes(currentStatusId)) {
                    actions.push(
                        <Tooltip title="Sửa đơn hàng (chi tiết)" key="edit">
                            <Button type="text" shape="circle" icon={<EditOutlined style={{ color: "orange" }} />} onClick={() => handleShowUpdateModal(record)} />
                        </Tooltip>
                    );
                }

                // Logic hiển thị nút dựa trên currentStatusId và ID từ API
                if (currentStatusId === 1) { // 1: "Chờ xử lý"
                    actions.push(
                        <Tooltip title="Xác nhận đơn" key="confirm_order">
                            <Button type="primary" size="small" onClick={() => handleQuickStatusChange(record.id, 2, "Xác Nhận Đơn")}>
                                Xác nhận
                            </Button>
                        </Tooltip>
                    );
                    actions.push(
                        <Tooltip title="Hủy đơn hàng này" key="cancel_pending_order">
                            <Button danger size="small" onClick={() => handleQuickStatusChange(record.id, 5, "Hủy Đơn")}> {/* ID 5: Huỷ Đơn */}
                                Hủy
                            </Button>
                        </Tooltip>
                    );
                } else if (currentStatusId === 2) { // 2: "Xác nhận đơn"
                    actions.push(
                        <Tooltip title="Chuẩn bị hàng" key="prepare_order">
                            <Button style={{backgroundColor: '#08979c', color: 'white', borderColor: '#08979c'}} size="small" onClick={() => handleQuickStatusChange(record.id, 8, "Chuẩn Bị Hàng")}> {/* ID 8: Đang chuẩn bị */}
                                Chuẩn bị
                            </Button>
                        </Tooltip>
                    );
                    // Nếu bạn muốn cho phép từ "Xác nhận đơn" -> "Đang giao" luôn thì bỏ comment dòng dưới và comment nút "Chuẩn bị"
                    // actions.push(
                    //     <Tooltip title="Bắt đầu giao hàng" key="ship_order_direct">
                    //         <Button type="primary" size="small" onClick={() => handleQuickStatusChange(record.id, 3, "Giao Hàng")}> {/* ID 3: Đang Giao */}
                    //             Giao hàng
                    //         </Button>
                    //     </Tooltip>
                    // );
                    actions.push(
                        <Tooltip title="Hủy đơn hàng này" key="cancel_confirmed_order">
                            <Button danger size="small" onClick={() => handleQuickStatusChange(record.id, 5, "Hủy Đơn")}> {/* ID 5: Huỷ Đơn */}
                                Hủy
                            </Button>
                        </Tooltip>
                    );
                } else if (currentStatusId === 8) { // 8: "Đang chuẩn bị"
                     actions.push(
                        <Tooltip title="Bắt đầu giao hàng" key="ship_from_processing_order">
                            <Button type="primary" size="small" onClick={() => handleQuickStatusChange(record.id, 3, "Giao Hàng")}> {/* ID 3: Đang Giao */}
                                Giao hàng
                            </Button>
                        </Tooltip>
                    );
                    actions.push(
                        <Tooltip title="Hủy đơn hàng này" key="cancel_processing_order">
                            <Button danger size="small" onClick={() => handleQuickStatusChange(record.id, 5, "Hủy Đơn")}> {/* ID 5: Huỷ Đơn */}
                                Hủy
                            </Button>
                        </Tooltip>
                    );
                } else if (currentStatusId === 3) { // 3: "Đang Giao"
                    actions.push(
                        <Tooltip title="Đánh dấu đã giao thành công" key="delivered_order">
                            <Button type="default" size="small" onClick={() => handleQuickStatusChange(record.id, 4, "Đã Giao Thành Công")} icon={<CheckCircleOutlined />} style={{ color: '#52c41a', borderColor: '#52c41a' }}> {/* ID 4: Giao thành công */}
                                Đã giao
                            </Button>
                        </Tooltip>
                    );
                    actions.push(
                        <Tooltip title="Đánh dấu hoàn hàng (COD thất bại)" key="return_order">
                            <Button danger size="small" onClick={() => handleQuickStatusChange(record.id, 6, "Hoàn Hàng")}> {/* ID 6: Hoàn Hàng */}
                                Hoàn hàng
                            </Button>
                        </Tooltip>
                    );
                    // Hủy khi đang giao (hiếm, nếu cần)
                    // actions.push(
                    //     <Tooltip title="Hủy đơn hàng này" key="cancel_shipping_order">
                    //         <Button danger size="small" onClick={() => handleQuickStatusChange(record.id, 5, "Hủy Đơn")}>
                    //             Hủy
                    //         </Button>
                    //     </Tooltip>
                    // );
                }

                // Nút Xóa (chỉ cho phép xóa đơn chưa ở các trạng thái cuối)
                if (!finalStatusIds.includes(currentStatusId)) {
                    actions.push(
                        <Tooltip title="Xóa đơn hàng" key="delete_order">
                            <Popconfirm
                                title="Xác nhận xóa đơn hàng?"
                                description={`Bạn có chắc muốn xóa đơn hàng #${record.id}?`}
                                onConfirm={() => handleDeleteOrder(record.id)}
                                okText="Xóa"
                                cancelText="Hủy"
                            >
                                <Button type="text" shape="circle" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                        </Tooltip>
                    );
                }

                return <Space size="small">{actions}</Space>;
            }
        },
    ];

    return (
        <>
            <Row gutter={[16, 16]} style={{ marginBottom: 20, padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                <Col xs={24} sm={24} md={8}>
                    <Input
                        ref={searchInputRef}
                        placeholder="Tìm theo tên khách hàng, SĐT..."
                        prefix={<SearchOutlined />}
                        onChange={handleCustomerNameChange}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={7}>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        style={{ width: '100%' }}
                        value={filters.statusId}
                        onChange={handleStatusFilterChange}
                        allowClear
                    >
                        <Option value={null}>Tất cả trạng thái</Option>
                        {orderStatuses.map(status => (
                            <Option key={status.id} value={status.id}>{status.name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={5}>
                    <Button
                        onClick={handleSortToggle}
                        icon={sortConfig.sortOrder === 'DESC' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}
                        style={{ width: '100%' }}
                    >
                        Ngày tạo: {sortConfig.sortOrder === 'DESC' ? 'Mới nhất' : 'Cũ nhất'}
                    </Button>
                </Col>
                <Col xs={24} sm={24} md={4}>
                    <Button
                        onClick={handleClearFilters}
                        icon={<ClearOutlined />}
                        style={{ width: '100%' }}
                    >
                        Xóa bộ lọc
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={dataOrders}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 1200 }}
                bordered
                size="middle"
            />

            {dataUpdate && (
                <UpdateOrder
                    isModalOpen={isModalUpdateOpen}
                    setIsModalOpen={setIsModalUpdateOpen}
                    orderData={dataUpdate}
                    reloadOrders={loadOrders}
                    allOrderStatuses={orderStatuses}
                />
            )}
            {dataDetail && (
                <OrderDetail
                    isDetailOpen={isDetailOpen}
                    setIsDetailOpen={setIsDetailOpen}
                    dataDetail={dataDetail}
                    setDataDetail={setDataDetail}
                />
            )}
        </>
    );
};

export default ManageOrder;
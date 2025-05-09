import React, { useState, useEffect, useCallback } from "react";
import { Space, Table, Popconfirm, notification, message, Row, Col, Tag, Button, Input, Select, Tooltip } from 'antd';
import { fetchAllOrdersAPI, deleteOrderAPI } from '../../../services/api.order'; // Đảm bảo đường dẫn đúng
import { fetchAllOrderStatusAPI } from '../../../services/api.orderStatus'; // API lấy trạng thái
import {
    DeleteOutlined, EditOutlined, EyeOutlined,
    SortAscendingOutlined, SortDescendingOutlined,
    SearchOutlined, ClearOutlined
} from '@ant-design/icons';
import UpdateOrder from './UpdateOrder'; // Component cập nhật đơn hàng
import OrderDetail from './OrderDetail';   // Component chi tiết đơn hàng
import { format } from 'date-fns';
import debounce from 'lodash/debounce'; // Để tối ưu tìm kiếm khi gõ

const { Option } = Select;

const ManageOrder = () => {
    const [dataOrders, setDataOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 6, // Giá trị mặc định cho limit
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['6', '10', '20', '50'],
    });

    const [orderStatuses, setOrderStatuses] = useState([]); // Danh sách trạng thái để lọc
    const [filters, setFilters] = useState({
        customerName: "",
        statusId: null, // null hoặc "" hoặc undefined đều có nghĩa là không lọc
    });
    const [sortConfig, setSortConfig] = useState({
        sortBy: 'creationDate', // Sắp xếp mặc định theo ngày tạo
        sortOrder: 'DESC',      // Mới nhất trước
    });

    // Ref cho input tìm kiếm để có thể clear thủ công nếu cần
    const searchInputRef = React.useRef(null);

    // 1. Load danh sách trạng thái đơn hàng cho ComboBox lọc
    useEffect(() => {
        const loadOrderStatuses = async () => {
            try {
                const res = await fetchAllOrderStatusAPI();
                // API của bạn trả về: {statusCode, message, data: {total, totalPage, page, limit, data:[...]}}
                if (res.data && res.data.data) {
                    // Chỉ lấy các trạng thái active để hiển thị trong bộ lọc
                    setOrderStatuses(res.data.data.filter(status => status.isActive));
                } else {
                    console.error("API fetchAllOrderStatusAPI không trả về cấu trúc data.data mong đợi:", res);
                    setOrderStatuses([]); // Đặt thành mảng rỗng nếu có lỗi
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

    // 2. Hàm chính để load danh sách đơn hàng
    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            // Lấy giá trị từ state pagination, filters, sortConfig
            const res = await fetchAllOrdersAPI(
                pagination.current,
                pagination.pageSize,
                filters.customerName,
                filters.statusId,
                sortConfig.sortBy,
                sortConfig.sortOrder
                // isActive có thể thêm nếu bạn muốn có filter isActive trên UI
            );

            if (res.data && res.data.data) { // API của bạn trả về {statusCode, message, data: {total, totalPage, currentPage, limit, data:[...]}}
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
                 if (res.message) {
                    // Hiển thị thông báo từ backend nếu có, ví dụ "Không tìm thấy đơn hàng nào"
                    // message.info(res.message);
                 }
            }
        } catch (error) {
            notification.error({
                message: "Lỗi tải đơn hàng",
                description: error.response?.data?.message || error.message || "Không thể tải danh sách đơn hàng.",
            });
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, filters, sortConfig]); // Dependencies

    // 3. useEffect để gọi loadOrders khi các dependencies thay đổi
    useEffect(() => {
        loadOrders();
    }, [loadOrders]); // loadOrders đã chứa các dependencies cần thiết

    // 4. Handler cho việc xóa đơn hàng
    const handleDeleteOrder = async (orderId) => {
        try {
            const res = await deleteOrderAPI(orderId);
            // Kiểm tra response từ backend của bạn
            if (res.statusCode === 200 || (res.data && res.data.message === 'Order deleted successfully (soft delete)')) {
                notification.success({
                    message: "Xóa đơn hàng",
                    description: "Xóa đơn hàng thành công!",
                });
                // Tải lại trang hiện tại hoặc trang đầu nếu trang hiện tại trống
                const newTotal = pagination.total - 1;
                const newTotalPages = Math.ceil(newTotal / pagination.pageSize);
                let pageToLoad = pagination.current;

                if (pagination.current > newTotalPages && newTotalPages > 0) {
                    pageToLoad = newTotalPages;
                } else if (newTotalPages === 0 && dataOrders.length === 1 && pagination.current > 1) {
                    pageToLoad = pagination.current - 1; // Nếu xóa item cuối cùng của trang > 1
                } else if (newTotalPages === 0) {
                    pageToLoad = 1;
                }
                 // Cập nhật pagination trước khi gọi loadOrders để useEffect tự trigger
                if (pageToLoad !== pagination.current) {
                    setPagination(prev => ({...prev, current: pageToLoad}));
                } else {
                    loadOrders(); // Nếu vẫn ở trang hiện tại, gọi loadOrders trực tiếp
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

    // 5. Handlers cho việc mở modal/drawer
    const handleShowUpdateModal = (record) => {
        setDataUpdate(record);
        setIsModalUpdateOpen(true);
    };

    const handleShowDetailDrawer = (record) => {
        setDataDetail(record);
        setIsDetailOpen(true);
    };

    // 6. Handlers cho việc thay đổi filter và sort
    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilters(prev => ({ ...prev, customerName: value }));
            setPagination(prev => ({ ...prev, current: 1 })); // Reset về trang 1 khi tìm kiếm
        }, 500), // Delay 500ms
        []
    );

    const handleCustomerNameChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleStatusFilterChange = (value) => {
        // value sẽ là ID của trạng thái, hoặc undefined/null nếu "Tất cả" được chọn
        setFilters(prev => ({ ...prev, statusId: value }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({ customerName: "", statusId: null });
        if (searchInputRef.current) {
            searchInputRef.current.input.value = ""; // Clear input thủ công
        }
        setPagination(prev => ({ ...prev, current: 1 }));
        // loadOrders() sẽ được trigger bởi useEffect do filters thay đổi
    };

    const handleSortToggle = () => {
        setSortConfig(prev => ({
            ...prev, // Giữ nguyên sortBy nếu có
            sortOrder: prev.sortOrder === 'DESC' ? 'ASC' : 'DESC',
        }));
        // loadOrders() sẽ được trigger bởi useEffect do sortConfig thay đổi
    };

    // 7. Handler cho sự kiện thay đổi của Ant Table (pagination, filter của table, sort của table)
    const handleTableChange = (newPagination, tableFiltersAnt, sorterAnt) => {
        // Cập nhật pagination từ Ant Table
        setPagination(prev => ({
            ...prev,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        }));

        // Nếu bạn muốn sử dụng sorter của Ant Table:
        // if (sorterAnt && sorterAnt.field) {
        //     setSortConfig({
        //         sortBy: sorterAnt.field, // Cần map field của antd với field backend
        //         sortOrder: sorterAnt.order === 'ascend' ? 'ASC' : 'DESC',
        //     });
        // } else if (!sorterAnt.order) { // Nếu người dùng bỏ sort từ table
        //     setSortConfig({ sortBy: 'creationDate', sortOrder: 'DESC' }); // Reset về mặc định
        // }
        // Hiện tại, chúng ta đang dùng button sort riêng nên không cần xử lý sorterAnt ở đây.
        // loadOrders() sẽ được trigger bởi useEffect do pagination thay đổi.
    };

    // 8. Định nghĩa columns cho Table
    const columns = [
        {
            title: 'ID', dataIndex: 'id', key: 'id', width: 40,
            render: (text, record) => (<a onClick={() => handleShowDetailDrawer(record)}>{text}</a>),
        },
        {
            title: 'Khách hàng', dataIndex: ['user', 'username'],  width: 120, key: 'customerName', // Sửa key thành customerName để khớp sortBy nếu dùng sorter của table
            ellipsis: true,
            // sorter: true, // Bật sorter của AntD nếu muốn (cần map key với sortBy)
        },
        { title: 'SĐT', dataIndex: ['user', 'phone'], key: 'phone', ellipsis: true, width: 120 },
        {
            title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', align: 'right', width: 150,
            render: (amount) => Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            // sorter: true,
        },
        { title: 'Địa chỉ GH', dataIndex: 'shippingAddress', key: 'shippingAddress', ellipsis: true, width: 200 },
        { title: 'PTTT', dataIndex: 'paymentMethod', key: 'paymentMethod', width: 120 },
        {
            title: 'Trạng thái', dataIndex: ['orderStatus', 'name'], key: 'statusName', width: 150, // Sửa key thành statusName
            render: (statusName) => {
                const statusMap = { // Map tên trạng thái với màu sắc
                    'Chờ xử lý': { color: 'orange', name: 'Chờ xử lý' },
                    'Xác nhận đơn': { color: 'blue', name: 'Xác nhận đơn' },
                    'Đang Giao': { color: 'purple', name: 'Đang Giao' },
                    'Giao thành công': { color: 'success', name: 'Giao thành công' },
                    'Huỷ Đơn': { color: 'error', name: 'Huỷ Đơn' },
                    'Hoàn Hàng': { color: 'gold', name: 'Hoàn Hàng' }
                    // Thêm các trạng thái khác của bạn
                };
                const statusInfo = statusMap[statusName] || { color: 'default', name: statusName || 'N/A' };
                return <Tag color={statusInfo.color}>{statusInfo.name}</Tag>;
            },
        },
        {
            title: 'Ngày tạo', dataIndex: 'creationDate', key: 'creationDate', width: 160,
            render: (text) => text ? format(new Date(text), 'dd/MM/yyyy HH:mm') : 'N/A',
            // sorter: true, // Mặc định sort theo nút riêng
        },
        {
            title: 'Hành động', key: 'action', width: 100, fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="link" icon={<EyeOutlined />} onClick={() => handleShowDetailDrawer(record)} />
                    </Tooltip>
                    <Tooltip title="Sửa đơn hàng">
                        <Button type="link" icon={<EditOutlined style={{ color: "orange" }} />} onClick={() => handleShowUpdateModal(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa đơn hàng">
                        <Popconfirm
                            title="Xác nhận xóa đơn hàng?"
                            description={`Bạn có chắc muốn xóa đơn hàng #${record.id}?`}
                            onConfirm={() => handleDeleteOrder(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button type="link" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        },
    ];

    // 9. Render UI
    return (
        <>
            <Row gutter={[16, 16]} style={{ marginBottom: 20, padding: '16px', background: '#f0f2f5', borderRadius: '8px' }}>
                <Col xs={24} sm={24} md={8}>
                    <Input
                        ref={searchInputRef}
                        placeholder="Tìm theo tên khách hàng, SĐT..."
                        prefix={<SearchOutlined />}
                        onChange={handleCustomerNameChange} // Sử dụng debounced handler
                        allowClear
                        // defaultValue={filters.customerName} // Nếu muốn giữ giá trị khi component re-render
                    />
                </Col>
                <Col xs={24} sm={12} md={7}>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        style={{ width: '100%' }}
                        value={filters.statusId} // Control component
                        onChange={handleStatusFilterChange}
                        allowClear
                    >
                        <Option value={null}>Tất cả trạng thái</Option> {/* Hoặc value="" */}
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
                pagination={pagination} // Truyền state pagination
                loading={loading}
                onChange={handleTableChange} // Handler cho table
                scroll={{ x: 1300 }} // Cho phép cuộn ngang nếu table quá rộng
                bordered
                size="middle" // hoặc "small"
            />

            {/* Modals và Drawers */}
            {dataUpdate && ( // Chỉ render khi có dataUpdate để tránh lỗi form
                <UpdateOrder
                    isModalOpen={isModalUpdateOpen}
                    setIsModalOpen={setIsModalUpdateOpen}
                    orderData={dataUpdate}
                    reloadOrders={loadOrders} // Truyền hàm loadOrders để component con gọi lại
                />
            )}
            {dataDetail && (
                <OrderDetail
                    isDetailOpen={isDetailOpen}
                    setIsDetailOpen={setIsDetailOpen}
                    dataDetail={dataDetail}
                    setDataDetail={setDataDetail} // Thêm để có thể clear dataDetail khi đóng drawer
                    // reloadOrders={loadOrders} // Không cần thiết nếu Detail chỉ xem
                />
            )}
        </>
    );
};

export default ManageOrder;
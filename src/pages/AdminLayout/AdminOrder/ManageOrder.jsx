//src/pages/AdminLayout/AdminOrder/ManagerOrder.jsx
import { Space, Table, Popconfirm, notification, message, Row, Col, Tag } from 'antd';
import { fetchAllOrdersAPI, deleteOrderAPI } from '../../../services/api.order';
import React, { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UpdateOrder from './UpdateOrder';
import FormSearch from '../../../component/SearchForm';
import OrderDetail from './OrderDetail';
import { format } from 'date-fns'; // Import date-fns format

const ManageOrder = () => {
    const [dataOrders, setDataOrders] = useState([]);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        total: 0,
    });
    const [keyword, setKeyword] = useState("");

    const [dataDetail, setDataDetail] = useState({})
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const confirm = () => {
        handleDeleteOrder();
    };

    const cancel = () => {
        message.error('Cancelled delete');
    };

    const handleDeleteOrder = async () => {
        try {
            const res = await deleteOrderAPI(dataUpdate.id);
            if (res.data) {
                notification.success({
                    message: "Delete Order",
                    description: "Order deleted successfully!",
                });
                await loadOrders(pagination.page, pagination.limit);
            } else {
                notification.error({
                    message: "Delete Order",
                    description: "Failed to delete order.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Delete Order",
                description: error.response?.data?.message || "Failed to delete order.",
            });
        }
    };

    const handleShowUpdateModal = (record) => {
        setDataUpdate(record);
        setIsModalUpdateOpen(true);
    };

    const loadOrders = async (page = 1, limit = 6, keyword = "") => {
        try {
            const res = await fetchAllOrdersAPI(page, limit, keyword);
            if (res.data) {
                setDataOrders(res.data.data);
                setPagination({
                    page: page,
                    limit: limit,
                    total: res.data.total,
                });
            }
        } catch (error) {
            notification.error({
                message: "Load Orders",
                description: error.response?.data?.message || "Failed to load orders.",
            });
        }
    };

    const handleSearch = (value) => {
        setKeyword(value);
        loadOrders(1, pagination.limit, value);
    };

    const handleTableChange = (paginationInfo) => {
        loadOrders(paginationInfo.current, paginationInfo.pageSize, keyword);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (_, record) => {
                return (<a href='#'
                  onClick={()=>{
                    setDataDetail(record);
                    setIsDetailOpen(true);
                  }}>
                  {record.id}</a>);
              }
        },
        { title: 'Họ và tên ', dataIndex: ['user', 'username'], key: 'username' },
        { title: 'SĐT', dataIndex: ['user', 'phone'], key: 'phone' },
        { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount' },
        { title: 'Địa chỉ giao hàng', dataIndex: 'shippingAddress', key: 'shippingAddress' },
        { title: 'Phương thực thành toán', dataIndex: 'paymentMethod', key: 'paymentMethod' },
        {
            title: 'Tráng thái tạo',
            dataIndex: ['orderStatus', 'name'],
            key: 'orderStatus',
            render: (status) => ( // Render function for status column
                <Tag color={getStatusTagColorForTable(status)}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo đơn',
            dataIndex: 'creationDate',
            key: 'creationDate',
            render: (text) => text ? format(new Date(text), 'yyyy-MM-dd HH:mm:ss') : '' // Format date
        },
        {
            title: 'Cập nhật',
            width: 90,
            render: (_, record) => (
                <EditOutlined
                    onClick={() => handleShowUpdateModal(record)}
                    style={{ cursor: "pointer", color: "orange" }}
                />
            )
        },
        {
            title: 'Xoá',
            fixed: 'right',
            width: 90,
            render: (_, record) => (
                <Popconfirm
                    title="Delete Order"
                    description="Are you sure you want to delete this order?"
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => {setDataUpdate(record)}}
                    />
                </Popconfirm>
            )
        },
    ];

    // Get status tag color for table column
    const getStatusTagColorForTable = (status) => {
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


    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <>
            <Row justify="space-between" style={{ marginBottom: "30px" }}>

                <Col span={10}>
                    <FormSearch
                        keyword={keyword}
                        setKeyword={setKeyword}
                        placeholder="Tìm kiếm đơn hàng"
                        onSearch={handleSearch}
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={dataOrders}
                rowKey="id"
                pagination={{
                    current: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '6', '10', '20', '50'],
                }}
                onChange={handleTableChange}
            />

            <UpdateOrder
                isModalOpen={isModalUpdateOpen}
                setIsModalOpen={setIsModalUpdateOpen}
                orderData={dataUpdate}
                reloadOrders={() => loadOrders(pagination.page, pagination.limit)}
            />
            <OrderDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                reloadOrders={() => loadOrders(pagination.page, pagination.limit)}
            />
        </>
    );
};

export default ManageOrder;
//src/pages/AdminLayout/AdminVendor/ManagerVendor.jsx
import React, { useState, useEffect } from "react";
import { Space, Table, Popconfirm, notification, message, Row, Col, Tag, Button, Input } from 'antd';
import { fetchAllVendorAPI, deleteVendorAPI } from '../../../services/api.vendor'; // Import API vendor
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import UpdateVendor from './UpdateVendor'; // Tạo file này
import VendorDetail from './VendorDetail'; // Tạo file này
import FormSearch from '../../../component/SearchForm'; // Sử dụng lại component Search
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ManageVendor = () => {
    const [dataVendors, setDataVendors] = useState([]);
    const [dataUpdate, setDataUpdate] = useState(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        total: 0,
    });
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const loadVendors = async (page = 1, limit = 6, searchKeyword = "") => {
        try {
            // API fetchAllVendorAPI cần hỗ trợ tìm kiếm theo tên hoặc email
            const res = await fetchAllVendorAPI(page, limit, searchKeyword, ""); // Mặc định lấy active=true
            console.log(res.data )
            if (res.data) {
                setDataVendors(res.data.data);
                setPagination({
                    page: page,
                    limit: limit,
                    total: res.data.total,
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi tải Nhà cung cấp",
                description: error?.response?.data?.message || "Không thể tải danh sách nhà cung cấp.",
            });
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

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
            const res = await deleteVendorAPI(id); // API xóa (soft delete)
            if (res.statusCode === 200 || res.status === 200) { // Check status code or status property depending on API response
                notification.success({
                    message: "Xóa Nhà cung cấp",
                    description: "Xóa nhà cung cấp thành công!",
                });
                await loadVendors(pagination.page, pagination.limit, keyword);
            } else {
                notification.error({
                    message: "Xóa Nhà cung cấp",
                    description: res.message || "Xóa nhà cung cấp thất bại.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Xóa Nhà cung cấp",
                description: error?.response?.data?.message || "Xóa nhà cung cấp thất bại.",
            });
        }
    };

    const cancelDelete = () => {
        message.error('Hủy bỏ thao tác xóa');
    };

    const handleSearch = (value) => {
        setKeyword(value);
        loadVendors(1, pagination.limit, value);
    };

    const handleTableChange = (paginationInfo) => {
        loadVendors(paginationInfo.current, paginationInfo.pageSize, keyword);
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
        { title: 'Tên NCC', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'success' : 'error'}>
                    {isActive ? 'Hoạt động' : 'Ngừng'}
                </Tag>
            ),
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
                    <EditOutlined
                        style={{ cursor: "pointer", color: "orange" }}
                        onClick={() => handleShowUpdateModal(record)}
                    />
                    <Popconfirm
                        title="Xác nhận xóa"
                        description={`Bạn có chắc muốn xóa nhà cung cấp "${record.name}"? Hành động này sẽ vô hiệu hóa NCC.`}
                        onConfirm={() => confirmDelete(record.id)}
                        onCancel={cancelDelete}
                        okText="Xóa"
                        cancelText="Hủy"
                        disabled={!record.isActive} // Chỉ cho xóa khi đang active
                    >
                        <DeleteOutlined
                            style={{ cursor: record.isActive ? "pointer" : "not-allowed", color: record.isActive ? "red" : "grey" }}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Row justify="space-between" style={{ marginBottom: "20px" }}>
                <Col span={12}>
                    <FormSearch
                        placeholder="Tìm kiếm theo tên hoặc email NCC..."
                        onSearch={handleSearch}
                    />
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/add-supplier')} // Điều hướng đến trang tạo mới
                    >
                        Thêm Nhà cung cấp
                    </Button>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={dataVendors}
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

            <UpdateVendor
                isModalOpen={isModalUpdateOpen}
                setIsModalOpen={setIsModalUpdateOpen}
                vendorData={dataUpdate}
                reloadVendors={() => loadVendors(pagination.page, pagination.limit, keyword)}
            />

            <VendorDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                // Không cần reload ở đây trừ khi detail có action sửa đổi
            />
        </>
    );
};

export default ManageVendor;
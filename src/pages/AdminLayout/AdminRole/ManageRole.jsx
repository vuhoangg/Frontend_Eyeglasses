// src/pages/AdminLayout/AdminRole/ManageRole.jsx
import React, { useState, useEffect } from "react";
import { Table, Popconfirm, notification, message, Row, Col, Button, Tag, Switch } from 'antd';
import { fetchAllRolesAPI, deleteRoleAPI, updateRoleAPI } from '../../../services/api.role'; // Import API role
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import FormSearch from '../../../component/SearchForm'; // Reuse search component
import UpdateRole from './UpdateRole'; // Import component UpdateRole (sẽ tạo ở bước 7)
import RoleDetail from './RoleDetail'; // Import component RoleDetail (sẽ tạo ở bước 8)
import { Link } from "react-router-dom"; // Import Link

const ManageRole = () => {
  const [dataRoles, setDataRoles] = useState([]);
  const [dataUpdate, setDataUpdate] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '6', '10', '20', '50'],
  });
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state loading

  // Load Roles Function
  const loadRoles = async (page = pagination.page, limit = pagination.limit, searchKeyword = keyword) => {
    setLoading(true);
    try {
      const res = await fetchAllRolesAPI(page, limit, searchKeyword, undefined); // Lấy cả active và inactive
      if (res.data && res.data.data) {
        setDataRoles(res.data.data);
        setPagination(prev => ({
          ...prev,
          page: page,
          limit: limit,
          total: res.data.total,
        }));
      } else {
         notification.error({ message: "Lỗi", description: "Không thể tải danh sách vai trò." });
      }
    } catch (error) {
        notification.error({ message: "Lỗi", description: error.message || "Lỗi khi tải vai trò." });
    } finally {
      setLoading(false);
    }
  };

  // Handle Search
  const handleSearch = (value) => {
    setKeyword(value);
    loadRoles(1, pagination.limit, value); // Reset về trang 1 khi search
  };

  // Handle Table Change (Pagination)
  const handleTableChange = (paginationInfo) => {
    loadRoles(paginationInfo.current, paginationInfo.pageSize, keyword);
  };

   // Handle Toggle Active Status
   const handleToggleActive = async (roleId, currentStatus) => {
     const newStatus = !currentStatus;
     try {
       // Chỉ gửi trường `isActive` để cập nhật
       const res = await updateRoleAPI(roleId, undefined, undefined, undefined, newStatus);
       if (res.statusCode === 200 || res.data) {
         notification.success({ message: "Thành công", description: `Cập nhật trạng thái vai trò thành ${newStatus ? 'Hoạt động' : 'Không hoạt động'}` });
         // Tải lại dữ liệu để cập nhật bảng
         loadRoles(pagination.page, pagination.limit, keyword);
       } else {
         notification.error({ message: "Lỗi", description: res.message || "Không thể cập nhật trạng thái vai trò." });
       }
     } catch (error) {
       notification.error({ message: "Lỗi", description: error.message || "Lỗi hệ thống." });
     }
   };

  // Handle Delete Role (Popconfirm)
  const handleDeleteRole = async (roleId) => {
    try {
      const res = await deleteRoleAPI(roleId);
      // Backend trả về 204 No Content khi thành công
      if (res && (res.status === 204 || res.statusCode === 204 || !res.data)) { // Kiểm tra nhiều kiểu response thành công
        notification.success({
          message: "Xóa thành công",
          description: "Đã xóa (ẩn) vai trò thành công."
        });
        // Tải lại trang hiện tại sau khi xóa
        loadRoles(pagination.page, pagination.limit, keyword);
      } else {
         // Trường hợp backend có trả về lỗi cụ thể
         const errorMessage = res?.message || JSON.stringify(res) || "Xóa vai trò thất bại.";
         notification.error({
           message: "Lỗi xóa vai trò",
           description: errorMessage
         });
      }
    } catch (error) {
      console.error("Delete Role Error:", error);
      notification.error({
        message: "Lỗi xóa vai trò",
        description: error.response?.data?.message || error.message || "Đã xảy ra lỗi khi xóa vai trò."
      });
    }
  };


  // Handle Show Update Modal
  const handleShowUpdateModal = (record) => {
    setDataUpdate(record);
    setIsModalUpdateOpen(true);
  };

   // Handle Show Detail Drawer
   const handleShowDetailDrawer = (record) => {
    setDataDetail(record);
    setIsDetailOpen(true);
  };

  // useEffect to load initial data
  useEffect(() => {
    loadRoles();
  }, []); // Chạy 1 lần khi mount

  // Columns Definition
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true, // Rút gọn nếu quá dài
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <>
          {permissions && permissions.length > 0 ? (
            permissions.slice(0, 2).map(perm => ( // Chỉ hiện tối đa 2 quyền
              <Tag color="blue" key={perm.id} style={{ marginBottom: '2px' }}>{perm.name || `ID: ${perm.id}`}</Tag>
            ))
          ) : (
            <Tag>Không có</Tag>
          )}
           {permissions && permissions.length > 2 && <Tag>...</Tag>}
        </>
      ),
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleActive(record.id, isActive)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 130,
      render: (_, record) => (
        <Row gutter={8} justify="center">
         <Col span={8}>
             <EyeOutlined
               style={{ cursor: "pointer", color: "#1890ff" }}
               onClick={() => handleShowDetailDrawer(record)}
             />
           </Col>
          <Col span={8}>
            <EditOutlined
              onClick={() => handleShowUpdateModal(record)}
              style={{ cursor: "pointer", color: "orange" }}
            />
          </Col>
          <Col span={8}>
            <Popconfirm
              title="Xác nhận xóa vai trò?"
              description={`Bạn có chắc muốn xóa vai trò "${record.name}" không? Hành động này chỉ ẩn vai trò.`}
              onConfirm={() => handleDeleteRole(record.id)} // Truyền ID vào hàm xóa
              okText="Xóa"
              cancelText="Hủy"
              placement="left"
            >
              <DeleteOutlined
                style={{ cursor: "pointer", color: "red" }}
              />
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: "20px" }}>
        <Col span={10}>
          <FormSearch
            keyword={keyword}
            setKeyword={setKeyword} // Truyền setKeyword xuống
            placeholder="Tìm kiếm theo tên vai trò..."
            onSearch={handleSearch}
          />
        </Col>
        <Col>
           <Button type="primary">
              <Link to="/admin/add-role">Thêm vai trò mới</Link> {/* Link đến trang tạo mới */}
           </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataRoles}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading} // Thêm trạng thái loading cho table
        scroll={{ x: 800 }} // Cho phép scroll ngang nếu cần
        bordered // Thêm đường viền cho dễ nhìn
      />

      {/* Update Role Modal */}
      <UpdateRole
        isModalOpen={isModalUpdateOpen}
        setIsModalOpen={setIsModalUpdateOpen}
        roleData={dataUpdate} // Truyền roleData thay vì userData
        reloadRoles={() => loadRoles(pagination.page, pagination.limit, keyword)} // Callback để load lại
      />

      {/* Role Detail Drawer */}
       <RoleDetail
         isDetailOpen={isDetailOpen}
         setIsDetailOpen={setIsDetailOpen}
         dataDetail={dataDetail} // Truyền dataDetail
         setDataDetail={setDataDetail} // Truyền setDataDetail nếu cần cập nhật trong Drawer
         reloadRoles={() => loadRoles(pagination.page, pagination.limit, keyword)} // Callback load lại
       />
    </>
  );
};

export default ManageRole;
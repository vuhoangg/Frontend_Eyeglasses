import { Space, Table, Popconfirm, notification, message , Row,
  Col, } from 'antd'; 
import { fetchAllUserAPI, deleteUserAPI } from '../../../services/api.service'; 
import React, { useState, useEffect } from "react"; 
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'; 
import UpdateUser from './UpdateUser';  // Import the UpdateUser component
import FormSearch from '../../../component/SearchForm';

const ManageUser = () => {
  // 1. UseState  
  const [dataUsers, setDataUsers] = useState([]); 
  const [dataUpdate, setDataUpdate] = useState(null); 
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false); 
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0, 
  });
  const [keyword, setKeyword] = useState("");

  // 2. Handle Service
  // Popconfirm
  const confirm = (e) => {
    handleDeleteUser();
    console.log(e);
  };
  
  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  };
  
  const handleDeleteUser = async () => {
    console.log("check dataUpdate id ", dataUpdate.id);
    const res = await deleteUserAPI(dataUpdate.id);
    console.log("Check api xoá ", res);
    
    if (res.data) {
      notification.success({
        message: "Xóa thành công",
        description: "Xóa user thành công"
      });
      await loadUser(pagination.page, pagination.limit);
    } else {
      notification.error({
        message: "Error delete user",
        description: JSON.stringify(res.message)
      });
    }
  };



  
  // Handle Show Update Modal  
  const handleShowUpdateModal = (record) => {
    setDataUpdate(record);
    setIsModalUpdateOpen(true); 
  };
  
  const loadUser = async (page = 1, limit = 6,  keyword = "") => {
    const res = await fetchAllUserAPI(page, limit, keyword);
    
    if (res.data) {
      setDataUsers(res.data.data);
      setPagination({
        page: page,
        limit: limit,
        total: res.data.total,
      });
    }
  };

  const handleSearch = (value) => {
    // Khi người dùng search, cập nhật keyword và gọi loadUser
    setKeyword(value);
    loadUser(1, pagination.limit, value); // Reset về trang 1 khi search
  };
  
  const handleTableChange = (paginationInfo) => {
    // Antd table passes pagination object with current and pageSize
    loadUser(paginationInfo.current, paginationInfo.pageSize, keyword);
  };
  
  // 3. Const Array  
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      render: (_, record) => {
        return (<a href='#'>{record.id}</a>);
      }
    },
    {title: 'Name', dataIndex: 'username', key: 'name', render: (text) => <a>{text}</a>},
    {title: 'Email', dataIndex: 'email', key: 'email'},
    {title: 'firstName', dataIndex: 'firstName', key: 'firstName'},
    {title: 'lastName', dataIndex: 'lastName', key: 'lastName'},
    {title: 'Address', dataIndex: 'address'},
    {
      title: 'Action 1',
      width: 90,
      render: (_, record) => (
        <EditOutlined
          onClick={() => handleShowUpdateModal(record)}
          style={{ cursor: "pointer", color: "orange" }}
        />
      )
    },
    {
      title: 'Action 2',
      fixed: 'right',
      width: 90,
      render: (_, record) => (
        <Popconfirm
          title="Delete the task"
          placement="left"
          description="Are you sure to delete this task?"
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
  
  // useEffect để gọi API khi component mount
  useEffect(() => {
    loadUser();
  }, []);
  
  return (
    <>

<Row justify="space-between" style={{ marginBottom: "30px" }}>
        
        <Col span={10}>
          <FormSearch
            keyword={keyword}
            setKeyword={setKeyword}
            placeholder="Tìm kiếm băng rôn"
            onSearch={handleSearch} // Thêm prop onSearch
          />
        </Col>

      
      </Row>

      <Table
        columns={columns}
        dataSource={dataUsers}
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
      
      {/* Update User Modal */}
      <UpdateUser
        isModalOpen={isModalUpdateOpen}
        setIsModalOpen={setIsModalUpdateOpen}
        userData={dataUpdate}
        reloadUsers={() => loadUser(pagination.page, pagination.limit)}
      />
    </>
  );
};

export default ManageUser;
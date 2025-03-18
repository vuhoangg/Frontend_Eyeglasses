import { Space, Table, Popconfirm, notification, message, Row, Col } from 'antd';
import { fetchAllProductAPI, deleteProductAPI } from '../../../services/api.product';
import React, { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UpdateProduct from './UpdateProduct';
import FormSearch from '../../../component/SearchForm';
import ProductDetail from './ProductDetail';

const ManageProduct = () => {
  const [dataProducts, setDataProducts] = useState([]);
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
    handleDeleteProduct();
  };

  const cancel = () => {
    message.error('Cancelled delete');
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await deleteProductAPI(dataUpdate.id);
      if (res.data) {
        notification.success({
          message: "Delete Product",
          description: "Product deleted successfully!",
        });
        await loadProducts(pagination.page, pagination.limit);
      } else {
        notification.error({
          message: "Delete Product",
          description: "Failed to delete product.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Delete Product",
        description: error.response?.data?.message || "Failed to delete product.",
      });
    }
  };

  const handleShowUpdateModal = (record) => {
    setDataUpdate(record);
    setIsModalUpdateOpen(true);
  };

  const loadProducts = async (page = 1, limit = 6, keyword = "") => {
    try {
      const res = await fetchAllProductAPI(page, limit, keyword);
      if (res.data) {
        setDataProducts(res.data.data);
        setPagination({
          page: page,
          limit: limit,
          total: res.data.total,
        });
      }
    } catch (error) {
      notification.error({
        message: "Load Products",
        description: error.response?.data?.message || "Failed to load products.",
      });
    }
  };

  const handleSearch = (value) => {
    setKeyword(value);
    loadProducts(1, pagination.limit, value);
  };

  const handleTableChange = (paginationInfo) => {
    loadProducts(paginationInfo.current, paginationInfo.pageSize, keyword);
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
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Stock Quantity', dataIndex: 'stock_quantity', key: 'stock_quantity' },
    { title: 'Category ID', dataIndex: 'category_id', key: 'category_id' },
    { title: 'Brand ID', dataIndex: 'brand_id', key: 'brand_id' },
    { title: 'Image Product', dataIndex: 'imageProduct', key: 'imageProduct' },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
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
          title="Delete Product"
          description="Are you sure you want to delete this product?"
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

  useEffect(() => {
    loadProducts();
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
        dataSource={dataProducts}
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

      <UpdateProduct
        isModalOpen={isModalUpdateOpen}
        setIsModalOpen={setIsModalUpdateOpen}
        productData={dataUpdate}
        reloadProducts={() => loadProducts(pagination.page, pagination.limit)}
      />

      <ProductDetail
          isDetailOpen={isDetailOpen} 
          setIsDetailOpen={setIsDetailOpen}
          dataDetail={dataDetail}
          setDataDetail={setDataDetail}
          reloadProducts={() => loadProducts(pagination.page, pagination.limit)}
         
          />
    </>
  );
};

export default ManageProduct;
import { Space, Table, Popconfirm, notification, message, Row, Col , Tag} from 'antd';
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
                    onClick={() => {
                        setDataDetail(record);
                        setIsDetailOpen(true);
                    }}>
                    {record.id}</a>);
            }
        },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', color: 'orange' }, // Added color style
        { title: 'Mô tả', dataIndex: 'description', key: 'description', color: 'green' }, // Added color style
        { title: 'Đơn Giá', dataIndex: 'price', key: 'price', color: 'blue' }, // Added color style
        { title: 'Số lượng kho', dataIndex: 'stock_quantity', key: 'stock_quantity', color: 'purple' }, // Added color style
        {
          title: 'Danh mục',
          dataIndex: 'category',
          key: 'category',
          render: (category) => (
              <Tag color="green">
                  {category ? category.name : 'N/A'}
              </Tag>
          ),
      },
      {
          title: 'Thương hiệu',
          dataIndex: 'brand',
          key: 'brand',
          render: (brand) => (
              <Tag color="blue">
                  {brand ? brand.name : 'N/A'}
              </Tag>
          ),
      },
        // { title: 'Image Product', dataIndex: 'imageProduct', key: 'imageProduct' },
        { title: 'SKU', dataIndex: 'sku', key: 'sku', color: 'gray' }, // Added color style
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
                    title="Delete Product"
                    description="Are you sure you want to delete this product?"
                    onConfirm={confirm}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => { setDataUpdate(record) }}
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
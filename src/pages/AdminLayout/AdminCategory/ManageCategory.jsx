import { Space, Table, Popconfirm, notification, message, Row, Col } from 'antd';
import { fetchAllCategoryAPI, deleteCategoryAPI } from '../../../services/api.category';
import React, { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UpdateCategory from './UpdateCategory';
import FormSearch from '../../../component/SearchForm';
import CategoryDetail from './CategoryDetail';

const ManageCategory = () => {
    const [dataCategories, setDataCategories] = useState([]);
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
        handleDeleteCategory();
    };

    const cancel = () => {
        message.error('Cancelled delete');
    };

    const handleDeleteCategory = async () => {
        try {
            const res = await deleteCategoryAPI(dataUpdate.id);
            if (res.data) {
                notification.success({
                    message: "Delete Category",
                    description: "Category deleted successfully!",
                });
                await loadCategories(pagination.page, pagination.limit);
            } else {
                notification.error({
                    message: "Delete Category",
                    description: "Failed to delete category.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Delete Category",
                description: error.response?.data?.message || "Failed to delete category.",
            });
        }
    };

    const handleShowUpdateModal = (record) => {
        setDataUpdate(record);
        setIsModalUpdateOpen(true);
    };

    const loadCategories = async (page = 1, limit = 6, keyword = "") => {
        try {
            const res = await fetchAllCategoryAPI(page, limit, keyword);
            if (res.data) {
                setDataCategories(res.data.data);
                setPagination({
                    page: page,
                    limit: limit,
                    total: res.data.total,
                });
            }
        } catch (error) {
            notification.error({
                message: "Load Categories",
                description: error.response?.data?.message || "Failed to load categories.",
            });
        }
    };

    const handleSearch = (value) => {
        setKeyword(value);
        loadCategories(1, pagination.limit, value);
    };

    const handleTableChange = (paginationInfo) => {
        loadCategories(paginationInfo.current, paginationInfo.pageSize, keyword);
    };

    const columns = [
        {
            title: 'Mã danh mục',
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
        { title: 'Tên Danh mục', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        // { title: 'Parent ID', dataIndex: 'parent_id', key: 'parent_id' },
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
                    title="Delete Category"
                    description="Are you sure you want to delete this category?"
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
        loadCategories();
    }, []);

    return (
        <>
             <Row justify="space-between" style={{ marginBottom: "30px" }}>

                <Col span={10}>
                    <FormSearch
                        keyword={keyword}
                        setKeyword={setKeyword}
                        placeholder="Tìm kiếm danh mục"
                        onSearch={handleSearch}
                    />
                </Col>


            </Row>

            <Table
                columns={columns}
                dataSource={dataCategories}
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

            <UpdateCategory
                isModalOpen={isModalUpdateOpen}
                setIsModalOpen={setIsModalUpdateOpen}
                categoryData={dataUpdate}
                reloadCategories={() => loadCategories(pagination.page, pagination.limit)}
            />

            <CategoryDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                reloadCategories={() => loadCategories(pagination.page, pagination.limit)}

                />
        </>
    );
};

export default ManageCategory;
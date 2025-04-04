import { Space, Table, Popconfirm, notification, message, Row, Col } from 'antd';
import { fetchAllBrandAPI, deleteBrandAPI } from '../../../services/api.brand';
import React, { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import UpdateBrand from './UpdateBrand';
import FormSearch from '../../../component/SearchForm';
import BrandDetail from './BrandDetail';

const ManageBrand = () => {
    const [dataBrands, setDataBrands] = useState([]);
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
        handleDeleteBrand();
    };

    const cancel = () => {
        message.error('Cancelled delete');
    };

    const handleDeleteBrand = async () => {
        try {
            const res = await deleteBrandAPI(dataUpdate.id);
            if (res.data) {
                notification.success({
                    message: "Delete Brand",
                    description: "Brand deleted successfully!",
                });
                await loadBrands(pagination.page, pagination.limit);
            } else {
                notification.error({
                    message: "Delete Brand",
                    description: "Failed to delete brand.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Delete Brand",
                description: error.response?.data?.message || "Failed to delete brand.",
            });
        }
    };

    const handleShowUpdateModal = (record) => {
        setDataUpdate(record);
        setIsModalUpdateOpen(true);
    };

    const loadBrands = async (page = 1, limit = 6, keyword = "") => {
        try {
            const res = await fetchAllBrandAPI(page, limit, keyword);
            if (res.data) {
                setDataBrands(res.data.data);
                setPagination({
                    page: page,
                    limit: limit,
                    total: res.data.total,
                });
            }
        } catch (error) {
            notification.error({
                message: "Load Brands",
                description: error.response?.data?.message || "Failed to load brands.",
            });
        }
    };

    const handleSearch = (value) => {
        setKeyword(value);
        loadBrands(1, pagination.limit, value);
    };

    const handleTableChange = (paginationInfo) => {
        loadBrands(paginationInfo.current, paginationInfo.pageSize, keyword);
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
        { title: 'Tên thương hiệu', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Logo thương hiệu', dataIndex: 'logo', key: 'logo', render: (logo) => logo ? <img src={`http://localhost:8082/images/brand/${logo}`} alt="Brand Logo" style={{ width: '50px', height: 'auto' }} /> : 'No Logo' },
        {
            title: 'Cập nhật ',
            width: 120,
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
                    title="Delete Brand"
                    description="Are you sure you want to delete this brand?"
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
        loadBrands();
    }, []);

    return (
        <>
             <Row justify="space-between" style={{ marginBottom: "30px" }}>

                <Col span={10}>
                    <FormSearch
                        keyword={keyword}
                        setKeyword={setKeyword}
                        placeholder="Tìm kiếm nhãn hàng"
                        onSearch={handleSearch}
                    />
                </Col>


            </Row>

            <Table
                columns={columns}
                dataSource={dataBrands}
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

            <UpdateBrand
                isModalOpen={isModalUpdateOpen}
                setIsModalOpen={setIsModalUpdateOpen}
                brandData={dataUpdate}
                reloadBrands={() => loadBrands(pagination.page, pagination.limit)}
            />

            <BrandDetail
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                reloadBrands={() => loadBrands(pagination.page, pagination.limit)}

                />
        </>
    );
};

export default ManageBrand;
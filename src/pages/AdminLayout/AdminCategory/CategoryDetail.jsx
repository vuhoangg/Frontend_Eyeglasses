import { Drawer } from  'antd';
import React from 'react';

const CategoryDetail = (props) =>{
    const {isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadCategories } = props;

    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null);
    };

    return (
        <>
            <Drawer width={"40vw"} title="Chi tiết danh mục" onClose={onClose} open={isDetailOpen} maskClosable={false} >
                {dataDetail ? <>
                    <p>Mã thương hiệu: {dataDetail?.id}</p><br/>
                    <p>Tên Thương hiệu: {dataDetail.name}</p><br/>
                    <p>Mô Tả: {dataDetail.description}</p><br/>
                    {/* <p>Parent ID: {dataDetail.parent_id || 'N/A'}</p><br/> */}

                </>:
                    <> <p> No data available </p>
                    </>}
            </Drawer>
        </>
    );
};

export default CategoryDetail;
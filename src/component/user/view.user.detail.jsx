import { Drawer  } from  'antd';
// import { useEffect, useState } from 'react';


const ViewUserDetail = (props) =>{


const {isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail} = props;


// console.log("check data ", dataDetail);
// console.log("check dataUpdate id ", dataDetail?._id)

  const showDrawer = () => {
    setIsDetailOpen(false);
  };
  const onClose = () => {
    setIsDetailOpen(false);
    setDataDetail(null);
  };

  return (
    <>
      <Drawer title="Basic Drawer" onClose={onClose} open={isDetailOpen} maskClosable={false} >
        {dataDetail ? <>
            <p>{dataDetail?._id}</p><br/>
            <p>{dataDetail.email}</p><br/>
            <p>{dataDetail.name}</p><br/>
            <p>{dataDetail.address}</p><br/>
        </>: 
        <> <p> không có dữ liệu nào </p>
        </>}
      </Drawer>
    </>
  );
};



export default ViewUserDetail;

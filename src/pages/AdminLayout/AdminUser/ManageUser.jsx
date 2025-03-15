

import { Space, Table , Popconfirm, notification  } from 'antd';
import { fetchAllUserAPI, deleteUserAPI  } from '../../../services/api.service';
import React, { useState, useEffect } from "react";
import { DeleteOutlined , EditOutlined } from '@ant-design/icons';
import UpdateUser from './UpdateUser';  // Import the UpdateUser component




const ManageUser = () =>{


// 1. UseState 
const [dataUsers, setDataUsers ]= useState([]);
const [dataUpdate, setDataUpdate] = useState(null)
const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);


//-------
// 2. Handle Service 

  // Popconfirm 
  const confirm = (e) => {
    handleDeleteUser()
    console.log(e);
    // message.success('Click on Yes');
  };
  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  };
  const handleDeleteUser= async () => {
 
    console.log("check dataUpdate id ", dataUpdate.id  )
    const res = await deleteUserAPI(dataUpdate.id )
    console.log("Check api xoá ", res )
   if(res.data){ 
    notification.success({
        message: " Xoa thành công  ",
        description : " xoá  user thành công "
    })
    await loadUser();
   }else{
    {
        // setIsModalUpdate(true);
        notification.error({
            message: "Error delete user ",
            description:JSON.stringify(res.message)
        })
    } 
   }
}

 // Handle Show Update Modal
 const handleShowUpdateModal = (record) => {
  setDataUpdate(record);
  setIsModalUpdateOpen(true);
};









// ---
// 3. Const Array 
const columns = [
  {title: 'Id',dataIndex: 'id',
    render: (_, record) => {
      return (<a href='#'>{record.id} </a>);
    }
  },
  {title: 'Name',dataIndex: 'username',key: 'name',render: (text) => <a>{text}</a>,},
  {title: 'Email',dataIndex: 'email',key: 'email',},
  {title: 'firstName',dataIndex: 'firstName',key: 'email',},
  {title: 'lastName',dataIndex: 'lastName',key: 'email',},
  {title: 'Address',dataIndex: 'address',},

  {title: 'Action 1', width: 90,
    render: (_, record ) =>( <EditOutlined 
      onClick={() => handleShowUpdateModal(record)}
     
    style={{ cursor : "pointer", color: "orange"}} />
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
      cancelText="No"><DeleteOutlined style={{ cursor : "pointer", color: "red"}}
      onClick={ () => {setDataUpdate(record)}} /> 
    </Popconfirm>
  )
  },
 ];

// gọi api 
const loadUser = async ()=>{
    console.log(">> run loadUser Start ")
    const res = await fetchAllUserAPI()
    console.log(">> run loadUser End ", res.data.data )
    setDataUsers(res.data.data)

}

  // useEffect để gọi API khi component mount
  useEffect(() => {
    loadUser();
  }, []); // if second prams is [] programging run the one 


    return(
     <>
     <Table columns={columns} dataSource={dataUsers} />

      {/* Update User Modal */}
      <UpdateUser
        isModalOpen={isModalUpdateOpen}
        setIsModalOpen={setIsModalUpdateOpen}
        userData={dataUpdate}
        reloadUsers={loadUser}
      />
     </>
    
    );
}; 



export default ManageUser;

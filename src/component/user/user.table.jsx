import { Space, Table, Tag,  notification } from 'antd';
import React from 'react';
import { deleteUserAPI, fetchAllUserAPI } from '../../services/api.service';
import  {  Button, Modal, message, Popconfirm  } from 'antd';
import {useState } from 'react';
import { DeleteOutlined , EditOutlined } from '@ant-design/icons';
import UpdateUserModal from './user.update';
import ViewUserDetail from './view.user.detail';
const UserTable =(props)=> {

  
  const {dataUsers, loadUser } = props ;
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null)
  const [dataDetail, setDataDetail] = useState({})
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  console.log("check isDetailOpen ", isDetailOpen);

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
 
    console.log("check dataUpdate id ", dataUpdate._id  )
    const res = await deleteUserAPI(dataUpdate._id )
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

    const columns = [
      {
        title: 'Id',
        dataIndex: '_id',
        render: (_, record) => {
          return (<a href='#' onClick={()=>{
            setDataDetail(record);
            setIsDetailOpen(true);
          }}>
            {record._id} </a>);
        }
      },

        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          // render: (text) => <a>{text}</a>,
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },

        {
          title: 'Action 1',
          width: 90,
         
          render: (_, record ) =>( <EditOutlined 
            onClick={ () => {
              setDataUpdate(record);
              setIsModalUpdate(true)
              }
            } 
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
            cancelText="No">

          <DeleteOutlined style={{ cursor : "pointer", color: "red"}}
          onClick={ () => {
            setDataUpdate(record)
            }
          } 
            /> 
          </Popconfirm>
        )
        },
       
       
      ];
      
    
      // console.log(">> check data update   ",dataUpdate )
      return (
          <>
          
          <Table 
          columns={columns} 
          dataSource={dataUsers}
          rowKey= {dataUsers.id} />

          <UpdateUserModal
            isModalUpdate= {isModalUpdate}
            setIsModalUpdate = {setIsModalUpdate}
            dataUpdate={dataUpdate}
            setDataUpdate={setDataUpdate}
            loadUser={loadUser}
          />

          <ViewUserDetail
          isDetailOpen={isDetailOpen} 
          setIsDetailOpen={setIsDetailOpen}
          dataDetail={dataDetail}
          setDataDetail={setDataDetail}
         
          />
          </>
          
      );
      
    }

export default UserTable;

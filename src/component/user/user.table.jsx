import { Space, Table, Tag } from 'antd';
import React from 'react';
import { fetchAllUserAPI } from '../../services/api.service';
import  {  Button, Modal  } from 'antd';
import {useState } from 'react';
import { DeleteOutlined , EditOutlined } from '@ant-design/icons';
import UpdateUserModal from './user.update';
const UserTable =(props)=> {

  
  const {dataUsers, loadUser } = props ;
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null)


   


    const columns = [
      {
        title: 'Id',
        dataIndex: '_id',
        render: (_, record) => {
          return (<a href='#'>{record._id} </a>);
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
          render: () => (<DeleteOutlined style={{ cursor : "pointer", color: "red"}}  /> )
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
          </>
          
      );
      
    }

export default UserTable;

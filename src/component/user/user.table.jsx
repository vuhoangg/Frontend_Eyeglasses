import { Space, Table, Tag } from 'antd';
import React from 'react';
import { fetchAllUserAPI } from '../../services/api.service';
import { useState, useEffect} from 'react';
import  {  Button, Modal  } from 'antd';
import { DeleteOutlined , EditOutlined } from '@ant-design/icons';
import UpdateUserModal from './user.update';
const UserTable =(props)=> {

  const {dataUsers} = props ;

   


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
          title: 'Action 2',
          width: 90,
         
          render: () =>( <EditOutlined style={{ cursor : "pointer", color: "orange"}} />
            )
        },
        {
          title: 'Action 3',
          fixed: 'right',
          width: 90,
          render: () => (<DeleteOutlined style={{ cursor : "pointer", color: "red"}}  /> )
        },
       
       
      ];
      
    

      return (
          <>
          
          <Table 
          columns={columns} 
          dataSource={dataUsers}
          rowKey= {dataUsers.id} />

          <UpdateUserModal/>
          </>
          
      );
      
    }

export default UserTable;

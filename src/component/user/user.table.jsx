import { Space, Table, Tag } from 'antd';
import React from 'react';
import { fetchAllUserAPI } from '../../services/api.service';
import { useState, useEffect} from 'react';
import  {  Button, Modal  } from 'antd';

const UserTable =(props)=> {

  const {dataUsers} = props ;

   


    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
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
       
       
      ];
      
    

      return (
          <>
          
          <Table 
          columns={columns} 
          dataSource={dataUsers}
          rowKey= {dataUsers.id} />
          </>
      );
      
    }

export default UserTable;

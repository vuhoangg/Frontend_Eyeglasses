import { Space, Table, Tag } from 'antd';
import React from 'react';
import { fetchAllUserAPI } from '../../services/api.service';
import { useState } from 'react';

const UserTable =()=> {

    const [dataUsers , setDataUser ] = useState([
      {
            id: '1',
            name: 'John Brown',
            email : 'email',
            address: 'New York No. 1 Lake Park',
           
          },
    ]);

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
      
      const loadUser = async () =>{
        console.log( " Start ");
        const res = await fetchAllUserAPI();
        setDataUser( res.data.data);
        // console.log ("check data ", res.data.data )
        console.log( " End  ");
      }

      loadUser();

      return (

          <Table columns={columns} dataSource={dataUsers} />
      );
      
    }

export default UserTable;

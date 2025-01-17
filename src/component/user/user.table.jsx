import { Space, Table, Tag } from 'antd';
import React from 'react';
import { fetchAllUserAPI } from '../../services/api.service';
import { useState, useEffect} from 'react';
import  {  Button, Modal  } from 'antd';
const UserTable =()=> {

    const [dataUsers , setDataUser ] = useState([]);
    // empty array => run once 
     useEffect(() => {
      console.log('Effect is running 111 ');
      loadUser();
    }, []
    );


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
        // console.log( " Start ");
        const res = await fetchAllUserAPI();
        setDataUser( res.data.data);
        // console.log ("check data ", res.data.data )
        // console.log( " End  ");
      }

      // loadUser();
      console.log(">> run render 000");

 

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

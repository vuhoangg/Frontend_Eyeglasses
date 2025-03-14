

import { Space, Table, Tag } from 'antd';
import { fetchAllUserAPI } from '../../../services/api.service';
import React, { useState, useEffect } from "react";



const ManageUser = () =>{
const [dataUsers, setDataUsers ]= useState([]);
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    render: (_, record) => {
      return (<a href='#'>
        {record.id} </a>);
    }
  },
  {
    title: 'Name',
    dataIndex: 'username',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'firstName',
    dataIndex: 'firstName',
    key: 'email',
  },
  {
    title: 'lastName',
    dataIndex: 'lastName',
    key: 'email',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    // key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Update {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },


];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
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
     </>
    
    );
}; 



export default ManageUser;

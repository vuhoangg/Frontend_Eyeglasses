// import './header.css'
import { Link, NavLink} from 'react-router-dom';
import {Menu} from 'antd';
import { useState } from 'react';
import { UserOutlined, BookOutlined, HomeOutlined } from '@ant-design/icons';

const items = [
    {
      label: <Link to="/">Home</Link>,
      key: 'Home',
      icon :<HomeOutlined />
    },
    {
        label: <Link to="/user">User</Link>,
        key: 'users',
        icon: <UserOutlined />
    //   icon: <AppstoreOutlined />,
    //   disabled: true,
    },
    {
      label: <Link to="/product">Product</Link>,
      key: 'products',
      icon : <BookOutlined />
    //   icon: <SettingOutlined />,
    }
  
  ];

const HeaderLayout= ()=>{

    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };
  
    return(
         <>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        </>
    );
}

export default HeaderLayout;
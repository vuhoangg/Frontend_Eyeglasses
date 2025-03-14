import './headerClient.css';
import { Link, NavLink} from 'react-router-dom';
import {Menu} from 'antd';
import { useState } from 'react';
import { UserOutlined, BookOutlined, HomeOutlined } from '@ant-design/icons';
const items = [
    {
      label: <Link to="/">Home</Link>,
      key: 'Home',
    //   icon :<HomeOutlined />
    },
    {
        label: <Link to="/user">User</Link>,
        key: 'users',
        // icon: <UserOutlined />
    //   icon: <AppstoreOutlined />,
    //   disabled: true,
    },
    {
      label: <Link to="/product">Product</Link>,
      key: 'products',
    //   icon : <BookOutlined />
    //   icon: <SettingOutlined />,
    },
    {
      label: <Link to="/login">About</Link>,
      key: 'logins',
    //   icon : <BookOutlined />
    //   icon: <SettingOutlined />,
    }
  
  ];

const HeaderClientLayout =()=>{
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };
    return(
        <>
       <header class="header">
        <div class="title">
            <p>ANNA-LYLI</p>
        </div>
        <div class="giohang">
            <button class="gh" >
                <a href="" ><img class="img-gh" src=""/></a>
            </button>
        </div>
        <div class="taikhoan">
            <button class="account" >
                <a href=" "><img class="img-acc" src=""/></a>
            </button>   
        </div>
    </header>

    
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    


        </>
    );
}

export default HeaderClientLayout;
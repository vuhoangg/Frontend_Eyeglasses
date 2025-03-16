import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Col, Menu, Row } from "antd";
import {
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
// import { useSelector } from "react-redux";

// You would need to create this component separately
const TopMenu = ({ user }) => {
  return (
    <div className="top_menu">
      <div className="welcome">
        {user ? `Xin chào, ${user.name}` : 'CHÀO MÙNG ĐẾN VỚI HUNO EYEWEAR'}
      </div>
      <div className="contact">
        Hotline: 0909.534.036 | Email: care@kinhmathuno.com
      </div>
    </div>
  );
};

const Header = () => {
//   const dataCart = useSelector((state) => state.shopcart?.listCartItem) || [];
  const [user, setUser] = useState({});
  const [current, setCurrent] = useState("");
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
  }, []);

  const items = [
    {
      label: <Link to={"/"}>TRANG CHỦ</Link>,
      key: "home",
    },
    {
      label: <Link to={"/product"}>CỬA HÀNG</Link>,
      key: "shop",
    },
    {
      label: <Link to={"/blog"}>TIN TỨC</Link>,
      key: "blog",
    },
    {
      label: <Link to={"/voucher"}>GIẢM GIÁ</Link>,
      key: "voucher",
    },
    {
      label: <Link to={"/about_us_page"}>GIỚI THIỆU</Link>,
      key: "about",
    },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <TopMenu user={user} />
      <Row className="main_menu">
        <Col span={10}>
          <Link to="/">
            <img 
              src="src/resources/imagelayout/Logo_HUNO.webp" 
              alt="HUNO Eyewear" 
              style={{ width: "220px" }} 
            />
          </Link>
        </Col>
        <Col span={10}>
          <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            style={{ borderBottom: "none" }}
          />
        </Col>
        <Col span={4}>
          <Link to="/" type="text" onClick={() => console.log("Nhắn tin")}>
            <MessageOutlined className="style_icon" />
          </Link>

          {/* <Link to="./shopcart">
            <Badge count={dataCart.length} size="small">
              <ShoppingCartOutlined className="style_icon" />
            </Badge>
          </Link> */}

          <Link to="/login">
            <UserOutlined className="style_icon" />
          </Link>
        </Col>
      </Row>

      <style jsx>{`
        .main_menu {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .main_menu img {
          width: 100%;
          max-width: 300px;
          height: auto;
          margin: 0 auto;
        }
        
        .main_menu a {
          font-size: 15px;
          text-decoration: none;
        }
        
        .main_menu a:before {
          display: none;
        }
        
        .style_icon {
          font-size: 20px;
          color: rgb(59, 55, 55);
          margin: 0 10px;
        }
        
        .style_icon:hover {
          color: #1677ff;
        }
        
        .top_menu {
          display: flex;
          justify-content: space-between;
          padding: 5px 20px;
          background-color: #f5f5f5;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default Header;
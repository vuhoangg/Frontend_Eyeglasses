//src/pages/AdminLayout/AdminLayout.jsx
import {
  AppstoreOutlined,
  CaretDownOutlined,
  FormOutlined,
  GiftOutlined,
  InboxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  SkinOutlined,
  SolutionOutlined,
  TagsOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Menu, message, theme, Avatar } from "antd";
import Layout, { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { fetchUserByIdAPI } from '../../services/api.service';

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  // Lấy dữ liệu người dùng từ localStorage như ban đầu
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;

  // Sử dụng useState để quản lý state cho userRole, username, userAvatar
  const [userRole, setUserRole] = useState(user?.role);
  const [username, setUsername] = useState(user?.username);
  const [userAvatar, setUserAvatar] = useState(user?.avartar);

  const userId = user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const res = await fetchUserByIdAPI(userId);
          if (res && res.data) {
            // Inspect res.data.roles here - CHECK YOUR CONSOLE FOR THE STRUCTURE
            console.log("res.data.roles:", res.data.roles);

            // setUserRole(res.data.roles); // Keep this line - adjust JSX based on console log
            setUsername(res.data.username);
            setUserAvatar(res.data.avartar);
            console.log("avatar", userAvatar);
          } else {
            console.error("Failed to fetch user details or data is empty:", res);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleAdminLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("access_token");
    localStorage.removeItem("cartItems");
    message.success("Admin đăng xuất thành công");
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Trang chủ
        </Link>
      </Menu.Item>
      <Menu.Item key="2" >Đổi mật khẩu</Menu.Item>
      <Menu.Item key="3" onClick={handleAdminLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    userRole !== "staff" &&  {
      key: "0",
      icon: <UserOutlined />,
      label: (
        <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
          DashBoard
        </Link>
      ),
    },
    userRole !== "staff" && {
      key: "g1",
      icon: <UserOutlined />,
      label: " Quản lý người dùng",
      children: [
        {
          key: "1",
          label: (
            <Link
              to="/admin/list-user"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Danh sách người dùng
            </Link>
          ),
        },
        {
          key: "2",
          label: (
            <Link
              to="/admin/add-user"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thêm người dùng
            </Link>
          ),
        },
      ],
    },

    // *** THÊM MENU QUẢN LÝ VAI TRÒ (CHỈ ADMIN) ***
    userRole === "admin" && {
      key: "g_role", // Key mới
      icon: <SafetyCertificateOutlined />, // Icon mới
      label: "Quản lý vai trò",
      children: [
        {
          key: "role_1", // Key con mới
          label: (
            <Link
              to="/admin/list-role" // Link đến trang list role
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Danh sách vai trò
            </Link>
          ),
        },
        {
          key: "role_2", // Key con mới
          label: (
            <Link
              to="/admin/add-role" // Link đến trang add role
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thêm vai trò
            </Link>
          ),
        },
      ],
    },
    {
      key: "g2",
      icon: <MenuUnfoldOutlined />,
      label: "Quản lý danh mục",
      children: [
        {
          key: "3",
          label: (
            <Link
              to="/admin/list-category"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Danh sách danh mục
            </Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link
              to="/admin/add-category"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thêm danh mục
            </Link>
          ),
        },
      ],
    },
    {
      key: "g3",
      icon: <TagsOutlined />,
      label: "Quản lý nhãn hàng",
      children: [
        {
          key: "5",
          label: (
            <Link
              to="/admin/list-brand"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Danh sách nhãn hàng
            </Link>
          ),
        },
        {
          key: "6",
          label: (
            <Link
              to="/admin/add-brand"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thêm nhãn hàng
            </Link>
          ),
        },
      ],
    },
    {
      key: "g4",
      icon: <SkinOutlined />,
      label: "Quản lý sản phẩm",
      children: [
        {
          key: "7",
          label: (
            <Link
              to="/admin/list-product"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Danh sách sản phẩm
            </Link>
          ),
        },
        userRole !== "staff" && {
          key: "8",
          label: (
            <Link
              to="/admin/add-product"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thêm sản phẩm
            </Link>
          ),
        },
      ],
    },
    {
      key: "g11",
      icon: <ShopOutlined />,
      label: "Quản lý NCC",
      children: [
        {
          key: "23",
          label: (
            <Link
              to="/admin/list-supplier"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Danh sách NCC
            </Link>
          ),
        },
        {
          key: "24",
          label: (
            <Link
              to="/admin/add-supplier"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thêm nhà cung cấp
            </Link>
          ),
        },
      ],
    },
    {
      key: "g12",
      icon: <SolutionOutlined />,
      label: "Quản lý nhập hàng",
      children: [
        {
          key: "25",
          label: (
            <Link
              to="/admin/list-receipt"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Danh sách nhập hàng
            </Link>
          ),
        },
        {
          key: "26",
          label: (
            <Link
              to="/admin/add-receipt"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Thêm nhập hàng
            </Link>
          ),
        },
      ],
    },
    {
      key: "g13",
      icon: <InboxOutlined />,
      label: "Quản lý đơn hàng",
      children: [
        {
          key: "27",
          label: (
            <Link
              to="/admin/list-order" // Updated link
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Danh sách đơn hàng
            </Link>
          ),
        },
        // No "add-order" page as orders are created by customers
      ],
    },
  ].filter(Boolean);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={220}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["0"]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown overlay={menu} trigger={["click"]}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                marginRight: "50px",
              }}
            >
              <span style={{ marginRight: 8, fontWeight: 'bold' }}>
                  Vai trò: {userRole === 'admin' ? 'Quản trị viên' : userRole === 'staff' ? 'Nhân viên' : userRole}
              </span>
              <Avatar
                src={userAvatar ? `http://localhost:8082/images/user/${userAvatar}` :'src/resources/avatar/avatar_01.jpg' }
                // icon={<UserOutlined />}
                style={{ marginRight: 5 }}
              />
              <span>{username}</span>
             
              <CaretDownOutlined />
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            flex: 1,
            overflow: "auto",
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

/*
IMPORTANT NEXT STEPS:

1.  **Run this code in your application.**
2.  **Open your browser's developer console (Inspect Element -> Console).**
3.  **Look for the `console.log("res.data.roles:", res.data.roles);` output.**
4.  **Examine the structure of the `res.data.roles` object that is logged.**
    *   Is it an object?
    *   What are the keys (properties) of this object?
    *   Which property contains the user role name string (e.g., 'admin', 'staff')?

5.  **In the JSX code (inside the `<span>` for "Vai trò:"), REPLACE `userRole.name` with the CORRECT property name**
    that you identified in the console log in step 4.

    For example, if your console log shows `res.data.roles: { role_name: 'Admin', ... }`,
    then you should change the JSX to:

    ```jsx
    Vai trò: {typeof userRole === 'object' ?  userRole.role_name : userRole}
    ```

    If you are still unsure, please provide the output of your `console.log("res.data.roles:", res.data.roles);`
    and I can help you identify the correct property to use in your JSX.
*/
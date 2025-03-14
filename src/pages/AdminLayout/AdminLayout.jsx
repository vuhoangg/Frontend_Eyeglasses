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
  import { Button, Dropdown, Menu, theme } from "antd";
  import Layout, { Content, Header } from "antd/es/layout/layout";
  import Sider from "antd/es/layout/Sider";
  import React, { useState } from "react";
  import { Link, NavLink, Outlet } from "react-router-dom";

  
  const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
  
    const menu = (
      <Menu>
        <Menu.Item key="1">Tán thành</Menu.Item>
        <Menu.Item key="2">Đổi mật khẩu</Menu.Item>
        <Menu.Item key="3">Đăng xuất</Menu.Item>
      </Menu>
    );
  
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed} width={220}>
          {/* <div className="demo-logo-vertical">
            <Link to="/">
              <img
                style={{ width: "200px", margin: "20px 0" }}
                src={logo}
                alt=""
              />
            </Link>
          </div> */}
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "g1",
                icon: <UserOutlined />,
                label: " Quản lý người dùng",
                children: [
                  {
                    key: "1",
                    label: (
                      <Link
                        to="/admin/list-user"
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                        }}
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
                  {
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
                key: "g5",
                icon: <NotificationOutlined />,
                label: "Quản lý băng rôn",
                children: [
                  {
                    key: "9",
                    label: (
                      <Link
                        to="/admin/list-banner"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Danh sách băng rôn
                      </Link>
                    ),
                  },
                  {
                    key: "10",
                    label: (
                      <Link
                        to="/admin/add-banner"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Thêm băng rôn
                      </Link>
                    ),
                  },
                ],
              },
              {
                key: "g6",
                icon: <AppstoreOutlined />,
                label: "Quản lý chủ đề",
                children: [
                  {
                    key: "11",
                    label: (
                      <Link
                        to="/admin/list-subject"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Danh sách chủ đề
                      </Link>
                    ),
                  },
                  {
                    key: "12",
                    label: (
                      <Link
                        to="/admin/add-subject"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Thêm chủ đề
                      </Link>
                    ),
                  },
                ],
              },
              // {
              //   key: "g7",
              //   icon: <SafetyCertificateOutlined />,
              //   label: "Quản lý quyền",
              //   children: [
              //     {
              //       key: "13",
              //       label: (
              //         <Link
              //           to="/admin/list-role"
              //           style={{ textDecoration: "none", color: "inherit" }}
              //         >
              //           Danh sách quyền
              //         </Link>
              //       ),
              //     },
              //     {
              //       key: "14",
              //       label: (
              //         <Link
              //           to="/admin/add-role"
              //           style={{ textDecoration: "none", color: "inherit" }}
              //         >
              //           Thêm quyền
              //         </Link>
              //       ),
              //     },
              //   ],
              // },
              {
                key: "g8",
                icon: <FormOutlined />,
                label: "Quản lý bài đăng",
                children: [
                  {
                    key: "15",
                    label: (
                      <Link
                        to="/admin/list-blog"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Danh sách bài đăng
                      </Link>
                    ),
                  },
                  {
                    key: "16",
                    label: (
                      <Link
                        to="/admin/add-blog"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Thêm bài đăng
                      </Link>
                    ),
                  },
                ],
              },
              {
                key: "g9",
                icon: <TruckOutlined />,
                label: "Quản lý loại ship",
                children: [
                  {
                    key: "17",
                    label: (
                      <Link
                        to="/admin/list-typeship"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        DS loại giao hàng
                      </Link>
                    ),
                  },
                  {
                    key: "18",
                    label: (
                      <Link
                        to="/admin/add-typeship"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Thêm loại giao hàng
                      </Link>
                    ),
                  },
                ],
              },
              {
                key: "g10",
                icon: <GiftOutlined />,
                label: "Quản lý voucher",
                children: [
                  {
                    key: "19",
                    label: (
                      <Link
                        to="/admin/list-typevoucher"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        DS loại khuyến mãi
                      </Link>
                    ),
                  },
                  {
                    key: "20",
                    label: (
                      <Link
                        to="/admin/list-voucher"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        DS mã khuyến mãi
                      </Link>
                    ),
                  },
  
                  {
                    key: "21",
                    label: (
                      <Link
                        to="/admin/add-typevoucher"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Thêm loại khuyến mãi
                      </Link>
                    ),
                  },
  
                  {
                    key: "22",
                    label: (
                      <Link
                        to="/admin/add-voucher"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Thêm mã khuyến mãi
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
                        to="/admin/list-banner"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Danh sách băng rôn
                      </Link>
                    ),
                  },
                  {
                    key: "28",
                    label: (
                      <Link
                        to="/admin/add-banner"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        Thêm băng rôn
                      </Link>
                    ),
                  },
                ],
              },
            ]}
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
                <UserOutlined style={{ fontSize: "20px", marginRight: "5px" }} />
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
  
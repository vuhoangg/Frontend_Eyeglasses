// Header.jsx
import React, { useEffect, useState, useCallback } from "react"; // Thêm useCallback
import { Link, useNavigate } from "react-router-dom";
import { Badge, Col, Menu, Row, Popover, Button, Modal, Form, Input, message } from "antd"; // Bỏ Upload vì chưa dùng
import {
    // MessageOutlined, // Tạm ẩn nếu chưa dùng
    ShoppingCartOutlined,
    UserOutlined,
    LogoutOutlined,
    EditOutlined,
    LockOutlined
} from "@ant-design/icons";
import { updateUserAPI } from "../../services/api.service"; // Đảm bảo đường dẫn đúng

// --- Top Menu Component ---
const TopMenu = ({ user }) => {
    return (
        <div className="top_menu">
            <div className="welcome">
                {user ? `Xin chào, ${user.username}` : 'CHÀO MÙNG ĐẾN VỚI HUNO EYEWEAR'}
            </div>
            <div className="contact">
                Hotline: 0909.534.036 | Email: care@kinhmathuno.com
            </div>
        </div>
    );
};

// --- Main Header Component ---
const Header = () => {
    const [user, setUser] = useState(null); // Khởi tạo là null
    const [current, setCurrent] = useState(""); // Key cho menu item active
    const [cartCount, setCartCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate(); // Hook useNavigate phải được gọi bên trong component
    const [loading, setLoading] = useState(false); // State cho nút loading update

    // Hàm cập nhật cart count từ localStorage
    const updateCartCount = useCallback(() => {
        let totalQuantity = 0;
        try {
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                const parsedCart = JSON.parse(storedCart);
                if (Array.isArray(parsedCart)) {
                    // Tính tổng quantity từ dữ liệu DB
                    totalQuantity = parsedCart.reduce((total, item) => {
                        // Kiểm tra và lấy quantity từ cấu trúc dữ liệu DB
                        const quantity = Number(item.quantity) || 0;
                        return total + quantity;
                    }, 0);
                } else {
                    console.warn("Dữ liệu cartItems trong localStorage không phải là một mảng.");
                }
            }
        } catch (error) {
            console.error('Lỗi khi xử lý cartItems để đếm số lượng:', error);
        } finally {
            setCartCount(totalQuantity);
        }
    }, []);

    // Cập nhật cart count khi mount và khi storage thay đổi
    useEffect(() => {
        updateCartCount(); // Cập nhật lần đầu

        // Lắng nghe sự kiện 'storage' từ các tab khác hoặc chính nó
        window.addEventListener('storage', updateCartCount);

        // Cleanup listener khi unmount
        return () => {
            window.removeEventListener('storage', updateCartCount);
        };
    }, [updateCartCount]);

    // Lấy thông tin user từ localStorage khi mount
    useEffect(() => {
        try {
            const userData = localStorage.getItem("userData");
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                setUser(parsedUserData);
                
                // Cập nhật số lượng giỏ hàng khi user đăng nhập
                const cartData = localStorage.getItem("cartItems");
                if (cartData) {
                    try {
                        const parsedCart = JSON.parse(cartData);
                        if (Array.isArray(parsedCart)) {
                            const total = parsedCart.reduce((sum, item) => {
                                return sum + (Number(item.quantity) || 0);
                            }, 0);
                            setCartCount(total);
                        }
                    } catch (error) {
                        console.error('Lỗi khi parse dữ liệu giỏ hàng:', error);
                        setCartCount(0);
                    }
                }
            } else {
                setUser(null);
                setCartCount(0);
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            setUser(null);
            setCartCount(0);
        }
    }, []); // Chỉ chạy 1 lần khi mount

    // Cập nhật cart count khi có thay đổi trong localStorage
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'cartItems') {
                try {
                    const cartData = localStorage.getItem('cartItems');
                    if (cartData) {
                        const parsedCart = JSON.parse(cartData);
                        if (Array.isArray(parsedCart)) {
                            const total = parsedCart.reduce((sum, item) => {
                                return sum + (Number(item.quantity) || 0);
                            }, 0);
                            setCartCount(total);
                        }
                    } else {
                        setCartCount(0);
                    }
                } catch (error) {
                    console.error('Lỗi khi xử lý cartItems:', error);
                    setCartCount(0);
                }
            }
        };

        // Lắng nghe sự kiện storage
        window.addEventListener('storage', handleStorageChange);
        
        // Chạy một lần khi component mount để lấy giá trị ban đầu
        handleStorageChange({ key: 'cartItems' });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // --- Menu Items ---
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

    // --- Event Handlers ---
    const onClickMenu = (e) => {
        setCurrent(e.key);
    };

    const showModal = () => {
        if (user) {
            // Set giá trị form với thông tin user hiện tại trước khi mở modal
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                phone: user.phone,
            });
            setIsModalOpen(true);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("access_token");
        localStorage.removeItem("cartItems"); // Xóa cart local khi logout
        setUser(null); // Cập nhật state user
        setCartCount(0); // Reset cart count
        message.success("Đăng xuất thành công");
        navigate("/login");
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Lấy các giá trị không thay đổi từ state user hiện tại (đảm bảo user không null)
            if (!user || !user.id) {
                 message.error("Không tìm thấy thông tin người dùng để cập nhật.");
                 setLoading(false);
                 return;
            }

            // Gọi API update user với đủ tham số yêu cầu
            const response = await updateUserAPI(
                user.id, // id
                values.username,    // username mới
                values.email,       // email mới
                values.phone,       // phone mới
                user.firstName || '', // giữ nguyên firstName
                user.lastName || '',  // giữ nguyên lastName
                user.address || '',   // giữ nguyên address
                user.avatar || null, // giữ nguyên avatar (API của bạn có 'avartar'?) - Sửa lại nếu cần
                user.role || ['customer'] // giữ nguyên roles (API của bạn có 'roles'?) - Sửa lại nếu cần
            );


            if (response && (response.statusCode === 200 || response.status === 200)) {
                message.success("Cập nhật tài khoản thành công");
                // Cập nhật lại thông tin user trong localStorage và state
                // Chỉ cập nhật các trường đã thay đổi trên form vào object user hiện tại
                const updatedUserData = {
                    ...user, // Giữ lại các trường cũ như id, firstName, lastName, address, avatar, role
                    username: values.username,
                    email: values.email,
                    phone: values.phone
                };
                localStorage.setItem("userData", JSON.stringify(updatedUserData));
                setUser(updatedUserData); // Cập nhật state user
                setIsModalOpen(false);
            } else {
                 const errorMsg = response?.message || response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản';
                message.error(errorMsg);
            }
        } catch (error) {
             if (error.name === 'ValidateError') {
                message.warning('Vui lòng kiểm tra lại thông tin.');
            } else {
                console.error("Lỗi khi cập nhật tài khoản:", error);
                const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại.';
                message.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Popover Content ---
    const content = (
        <div>
            <Button type="text" icon={<EditOutlined />} onClick={showModal}>
                Quản lý tài khoản
            </Button>
            <br />
            {/* Nút đổi mật khẩu chưa có chức năng */}
            <Button type="text" icon={<LockOutlined />} disabled>
                Đổi mật khẩu
            </Button>
            <br />
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Button>
        </div>
    );

    // --- Render JSX ---
    return (
        <>
            <TopMenu user={user} />
            <Row className="main_menu" align="middle" justify="space-between"> {/* Căn chỉnh Row */}
                <Col xs={8} sm={6} md={5} lg={4}> {/* Responsive Logo */}
                    <Link to="/">
                        <img
                            // Đảm bảo đường dẫn này đúng từ thư mục gốc của dự án hoặc thư mục public
                            src="/src/resources/imagelayout/Logo_HUNO.webp"
                            alt="HUNO Eyewear"
                            style={{ width: "100%", maxWidth: "180px", height: "auto" }} // Giới hạn max-width
                        />
                    </Link>
                </Col>
                <Col xs={0} sm={12} md={14} lg={15}> {/* Menu ẩn trên xs */}
                    <Menu
                        onClick={onClickMenu} // Sửa tên hàm để tránh trùng với biến onClick
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={items}
                        style={{ borderBottom: "none", display: 'flex', justifyContent: 'center' }} // Căn giữa Menu items
                    />
                </Col>
                <Col xs={16} sm={6} md={5} lg={5} style={{ textAlign: 'right' }}> {/* Icons căn phải */}
                    {/* Icon Message tạm ẩn
                    <Link to="/" type="text">
                        <MessageOutlined className="style_icon" />
                    </Link>
                    */}

<Link to="/cart_page" style={{ marginRight: '15px' }}>
    <Badge count={cartCount || 0} showZero size="small" overflowCount={99}>
        <ShoppingCartOutlined className="style_icon" />
    </Badge>
</Link>

                    {user ? ( // Hiển thị Popover nếu đã đăng nhập
                         <Popover content={content} trigger="click" placement="bottomRight">
                             <UserOutlined className="style_icon" />
                         </Popover>
                    ) : ( // Hiển thị Link tới Login nếu chưa đăng nhập
                         <Link to="/login">
                              <UserOutlined className="style_icon" />
                         </Link>
                    )}
                </Col>
            </Row>

            {/* Modal Quản lý tài khoản */}
            <Modal
                title="Quản lý tài khoản"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="update" type="primary" loading={loading} onClick={handleUpdate}>
                        Cập nhật
                    </Button>,
                ]}
                destroyOnClose // Xóa state của Form khi đóng Modal
            >
                <Form
                    form={form}
                    layout="vertical"
                    // initialValues không nên đặt ở đây nếu bạn set giá trị trong showModal
                >
                    <Form.Item
                        name="username"
                        label="Tên hiển thị"
                        rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
                    >
                        <Input placeholder="Tên hiển thị" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        // Bỏ rule required nếu số điện thoại không bắt buộc
                    >
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>
                 </Form>
            </Modal>

            {/* Style component */}
            <style jsx>{`
                .main_menu {
                    padding: 5px 20px; /* Giảm padding */
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); /* Shadow nhẹ hơn */
                    background: #fff;
                    position: sticky; /* Làm cho header dính khi cuộn */
                    top: 0;
                    z-index: 1000; /* Đảm bảo header nằm trên các thành phần khác */
                    width: 100%;
                }
                .main_menu .ant-menu-horizontal { /* Căn giữa các menu item */
                    border-bottom: none; /* Bỏ đường viền dưới của menu Antd */
                    line-height: inherit; /* Kế thừa line-height */
                }
                .main_menu .ant-menu-item { /* Style cho menu item */
                    margin: 0 10px; /* Khoảng cách giữa các item */
                }
                 .style_icon {
                    font-size: 22px; /* Tăng kích thước icon */
                    color: #333; /* Màu đậm hơn */
                    margin: 0 8px; /* Giảm margin ngang */
                    vertical-align: middle; /* Căn icon thẳng hàng */
                    cursor: pointer;
                    transition: color 0.3s;
                }
                 .style_icon:hover {
                    color: #1890ff;
                }
                 .top_menu {
                    display: flex;
                    justify-content: space-between;
                    align-items: center; /* Căn giữa theo chiều dọc */
                    padding: 8px 20px; /* Tăng padding */
                    background-color: #f0f2f5; /* Màu nền nhạt hơn */
                    font-size: 13px; /* Giảm font size */
                    color: #555; /* Màu chữ tối hơn */
                    border-bottom: 1px solid #e8e8e8; /* Thêm đường viền dưới */
                }
                 .welcome {
                    font-weight: 500; /* Đậm hơn một chút */
                 }
                 .contact {
                    /* Có thể thêm style nếu cần */
                 }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .main_menu {
                        padding: 5px 10px; /* Giảm padding trên mobile */
                    }
                    .main_menu .ant-col { /* Điều chỉnh cột trên mobile */
                       /* Có thể cần điều chỉnh thêm */
                    }
                     .style_icon {
                        font-size: 20px;
                        margin: 0 5px;
                    }
                }
                 @media (max-width: 576px) {
                    .top_menu {
                        flex-direction: column; /* Chuyển thành cột trên màn hình rất nhỏ */
                        align-items: flex-start;
                        padding: 5px 10px;
                        font-size: 12px;
                    }
                     .welcome {
                        margin-bottom: 3px;
                    }
                 }

            `}</style>
        </>
    );
};

export default Header; // Dòng export phải nằm cuối cùng sau khi định nghĩa component hoàn tất
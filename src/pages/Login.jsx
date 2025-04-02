const onFinish = async (values) => {
    try {
        const response = await loginAPI(values.username, values.password);
        if (response.status === 200 || response.statusCode === 200) {
            // Lưu token và thông tin user
            localStorage.setItem("access_token", response.data.token);
            localStorage.setItem("userData", JSON.stringify(response.data.user));
            
            try {
                // Lấy dữ liệu giỏ hàng từ API sau khi đăng nhập
                const cartResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/cart-items/by-user/${response.data.user.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${response.data.token}`
                        }
                    }
                );
                
                if (cartResponse.data) {
                    // Lưu dữ liệu giỏ hàng vào localStorage
                    localStorage.setItem('cartItems', JSON.stringify(cartResponse.data));
                }
            } catch (cartError) {
                console.error('Lỗi khi lấy dữ liệu giỏ hàng:', cartError);
            }

            // Phát ra sự kiện đăng nhập thành công
            window.dispatchEvent(new Event('userLoggedIn'));
            
            message.success("Đăng nhập thành công!");
            
            // Chuyển hướng về trang chủ và reload trang
            navigate("/");
            window.location.reload();
        }
    } catch (error) {
        // ... xử lý lỗi ...
    }
}; 
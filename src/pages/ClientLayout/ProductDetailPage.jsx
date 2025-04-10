// ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Row,
    Col,
    Card,
    Button,
    Space,
    Divider,
    Rate,
    Badge,
    Tag,
    InputNumber,
    message,
    Descriptions,
    Spin,
    Breadcrumb
} from 'antd';
import {
    ShoppingCartOutlined,
    HeartOutlined,
    ShareAltOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchProductByIdAPI } from '../../services/api.product';
// Import API function để tạo cart item
import { createCartItemAPI, updateCartItemAPI } from '../../services/api.cartItems';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const ProductDetailPage = () => {
    const { id: productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.id) {
            setUserId(userData.id);
        } else {
            setUserId(null);
        }
    }, []);


    useEffect(() => {
        console.log("ProductId:", productId);

        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await fetchProductByIdAPI(productId);

                if (response && response.data) {
                    console.log("Product data:", response.data);
                    setProduct(response.data);
                    // Reset quantity to 1 when product data loads
                    setQuantity(1);
                } else {
                    message.error("Không thể tải thông tin sản phẩm. Dữ liệu không hợp lệ.");
                    setProduct(null);
                }
            } catch (error) {
                message.error("Không thể tải thông tin sản phẩm.");
                console.error(error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetails();
        } else {
            message.error("ProductId không hợp lệ.");
            setLoading(false);
            setProduct(null);
        }
    }, [productId]);

    // --- HÀM MUA NGAY ---
    const handleBuyNow = async () => {
        // --- Initial Checks ---
        if (!product || !product.id) {
            message.error("Sản phẩm không hợp lệ hoặc chưa được tải.");
            return;
        }
        if (!quantity || quantity <= 0) {
             message.warn("Vui lòng chọn số lượng hợp lệ.");
             return;
        }
        // Check if product is active and has stock (redundant with button disable but safer)
        if (!product.isActive || product.stock_quantity === 0) {
             message.error("Sản phẩm này hiện đã hết hàng.");
             return;
        }

        // --- *** STOCK QUANTITY CHECK *** ---
        if (product.stock_quantity !== undefined && quantity > product.stock_quantity) {
            message.error(`Không đủ hàng! Chỉ còn ${product.stock_quantity} sản phẩm "${product.name}" trong kho.`);
            // Optionally reset quantity to max available
            // setQuantity(product.stock_quantity);
            return; // Stop execution
        }
        // --- End Stock Check ---

        // Proceed with adding to cart logic for Buy Now
        message.loading("Đang xử lý...", 0); // Show loading immediately

        // 1. Load existing cart items from local storage
        const storedCart = localStorage.getItem('cartItems');
        let cartItems = [];
         try {
            const parsed = storedCart ? JSON.parse(storedCart) : [];
            if (Array.isArray(parsed)) {
                cartItems = parsed;
            } else {
                 console.warn("Cart data in localStorage was not an array. Resetting.");
                 localStorage.removeItem('cartItems');
            }
        } catch (e) {
            console.error("Error parsing cartItems from localStorage", e);
            localStorage.removeItem('cartItems');
            cartItems = [];
        }

        // 2. Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        let updatedCartItems = [...cartItems];
        let itemWasUpdated = false; // Flag to know if we updated or added

        if (existingItemIndex > -1) {
            // 3a. If the item exists, update the quantity
            const existingQuantity = updatedCartItems[existingItemIndex].quantity;
            const newTotalQuantity = existingQuantity + quantity;

             // --- Check combined quantity against stock ---
             if (product.stock_quantity !== undefined && newTotalQuantity > product.stock_quantity) {
                 message.destroy(); // Remove loading message
                 message.error(`Trong giỏ đã có ${existingQuantity}. Thêm ${quantity} sẽ vượt quá tồn kho (${product.stock_quantity}).`);
                 return; // Stop execution
             }
             // --- End Combined Stock Check ---

            updatedCartItems[existingItemIndex].quantity = newTotalQuantity; // Update quantity
            itemWasUpdated = true;
            console.log(`BuyNow: Product ${product.id} exists, updated quantity to: ${newTotalQuantity}`);
        } else {
            // 3b. If the item doesn't exist, add it
             const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                imageProduct: product.imageProduct,
                quantity: quantity,
                categoryName: product.category?.name,
                brandName: product.brand?.name,
             };
             updatedCartItems.push(newItem);
             console.log(`BuyNow: Product ${product.id} added to cart.`);
        }

        // 4. Save the updated cart items to local storage
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        window.dispatchEvent(new Event('storage')); // Notify header

        // 5. Đồng bộ giỏ hàng với DB nếu user đã đăng nhập
        if (userId) {
            try {
                const itemInUpdatedCart = updatedCartItems.find(item => item.id === product.id); // Get the final item data
                if (itemInUpdatedCart) {
                    const cartItemData = {
                        productId: itemInUpdatedCart.id,
                        quantity: itemInUpdatedCart.quantity,
                        price: itemInUpdatedCart.price,
                    };

                    // Find the original cart item before update to check if it had a cart_item_id from DB
                    const originalCartItem = cartItems[existingItemIndex]; // Might be undefined if new item
                    const dbCartItemId = originalCartItem?.cart_item_id; // Check if it existed in DB

                    if (itemWasUpdated && dbCartItemId) {
                        // Cập nhật item đã có trong DB cart (sử dụng quantity *tổng*)
                        console.log(`BuyNow Sync: Updating item ${dbCartItemId} with total quantity ${itemInUpdatedCart.quantity}`);
                        await updateCartItemAPI(dbCartItemId, itemInUpdatedCart.quantity);
                    } else {
                        // Tạo mới item trong DB cart (sử dụng quantity *đã chọn*)
                         // Cần lấy cart_item_id trả về để lưu lại vào localstorage nếu muốn update sau này
                        console.log(`BuyNow Sync: Creating new item for product ${cartItemData.productId} with quantity ${quantity}`);
                        const createResponse = await createCartItemAPI(cartItemData.productId, quantity, cartItemData.price);

                         // Optional: Update localstorage with the new cart_item_id from DB
                         if (createResponse && createResponse.data && createResponse.data.id) {
                            const newlyAddedItemIndex = updatedCartItems.findIndex(item => item.id === product.id);
                             if (newlyAddedItemIndex > -1) {
                                 updatedCartItems[newlyAddedItemIndex].cart_item_id = createResponse.data.id;
                                 localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Save again with id
                             }
                         }
                    }
                }
                message.destroy(); // Remove loading
                // Message is handled below before navigating
                // message.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng và đồng bộ!`);

            } catch (error) {
                message.destroy(); // Remove loading
                console.error("Lỗi khi đồng bộ giỏ hàng với DB (Buy Now):", error);
                message.error("Lỗi khi cập nhật giỏ hàng. Vui lòng kiểm tra giỏ hàng.");
                // Don't navigate if DB sync failed maybe? Or let user proceed? Depends on requirement.
                 // For now, let's stop navigation on sync error
                return;
            }
        } else {
            message.destroy(); // Remove loading if user not logged in
        }

        // 6. Chuyển hướng đến trang thanh toán ngay lập tức
         message.success(`Đã cập nhật giỏ hàng. Chuyển đến thanh toán...`);
        navigate('/checkout');
    };
    // --- KẾT THÚC HÀM handleBuyNow ---


    // --- HÀM THÊM VÀO GIỎ ---
    const handleAddToCart = async () => { // Made async for potential future DB sync here too
         // --- Initial Checks ---
        if (!product || !product.id) {
            message.error("Sản phẩm không hợp lệ hoặc chưa được tải.");
            return;
        }
        if (!quantity || quantity <= 0) {
             message.warn("Vui lòng chọn số lượng hợp lệ.");
             return;
        }
         // Check if product is active and has stock (redundant with button disable but safer)
         if (!product.isActive || product.stock_quantity === 0) {
             message.error("Sản phẩm này hiện đã hết hàng.");
             return;
         }

        // --- *** STOCK QUANTITY CHECK *** ---
        // Check the quantity being *added* now against available stock
        if (product.stock_quantity !== undefined && quantity > product.stock_quantity) {
            message.error(`Không đủ hàng! Chỉ còn ${product.stock_quantity} sản phẩm "${product.name}" trong kho.`);
             // Optionally reset quantity to max available
            // setQuantity(product.stock_quantity);
            return; // Stop execution
        }
        // --- End Stock Check ---

        console.log(`Adding product ${product.id} (${product.name}) with quantity ${quantity} to cart.`);

        // 1. Load existing cart items from local storage
        const storedCart = localStorage.getItem('cartItems');
        let cartItems = [];
         try {
            const parsed = storedCart ? JSON.parse(storedCart) : [];
            if (Array.isArray(parsed)) {
                cartItems = parsed;
            } else {
                 console.warn("Cart data in localStorage was not an array. Resetting.");
                 localStorage.removeItem('cartItems');
            }
        } catch (e) {
            console.error("Error parsing cartItems from localStorage", e);
            localStorage.removeItem('cartItems');
            cartItems = [];
        }

        // 2. Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        let finalQuantityInCart = quantity; // For the success message

        if (existingItemIndex > -1) {
            // 3a. If the item exists, check combined quantity BEFORE updating
            const existingQuantity = cartItems[existingItemIndex].quantity;
            const newTotalQuantity = existingQuantity + quantity;

             // --- Check combined quantity against stock ---
             if (product.stock_quantity !== undefined && newTotalQuantity > product.stock_quantity) {
                 message.error(`Trong giỏ đã có ${existingQuantity}. Thêm ${quantity} sẽ vượt quá tồn kho (${product.stock_quantity}). Không thể thêm.`);
                 return; // Stop execution
             }
             // --- End Combined Stock Check ---

            // If check passes, update the quantity
            cartItems[existingItemIndex].quantity = newTotalQuantity;
            finalQuantityInCart = newTotalQuantity; // Update for message
            console.log(`Product ${product.id} exists, updated quantity to: ${newTotalQuantity}`);
        } else {
            // 3b. If the item doesn't exist, add it (initial stock check already done)
             const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                imageProduct: product.imageProduct,
                quantity: quantity, // Initial quantity
                categoryName: product.category?.name,
                brandName: product.brand?.name,
             };
             cartItems.push(newItem);
             console.log(`Product ${product.id} added to cart.`);
        }

        // 4. Save the updated cart items to local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // 5. Display success message
        message.success(`Đã cập nhật giỏ hàng! "${product.name}" (Tổng số lượng: ${finalQuantityInCart})`);

        // 6. *** QUAN TRỌNG: Dispatch sự kiện 'storage' để Header cập nhật ***
        window.dispatchEvent(new Event('storage'));

         // 7. Optional: Sync with DB immediately after adding to cart (similar logic to handleBuyNow if needed)
         // if (userId) {
         //    try { ... call createCartItemAPI or updateCartItemAPI ... } catch { ... }
         // }
    };
    // --- KẾT THÚC HÀM handleAddToCart ---


    const formatPrice = value => `${Number(value).toLocaleString('vi-VN')} VNĐ`;

    // --- Loading State ---
    if (loading) {
        return (
            <Layout>
                <Content style={{ padding: '50px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
                </Content>
            </Layout>
        );
    }

    // --- Product Not Found State ---
    if (!product) {
        return (
            <Layout>
                <Content style={{ padding: '50px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <Title level={3}>Không tìm thấy sản phẩm</Title>
                    <Button type="primary">
                        <Link to="/product">Quay lại trang sản phẩm</Link>
                    </Button>
                </Content>
            </Layout>
        );
    }

    // --- Render Product Details ---
    // Determine max value for InputNumber, defaulting safely if stock_quantity is unavailable
    const maxQuantityAllowed = (product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity >= 0)
                               ? product.stock_quantity
                               : 0; // If stock is unknown or invalid, treat as 0 for input max

    return (
        <Layout>
            <Content style={{ padding: '0 50px', maxWidth: 1200, margin: '0 auto' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/product">Sản phẩm</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>

                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            <img
                                src={product.imageProduct ? `http://localhost:8082/images/product/${product.imageProduct}` : 'https://placehold.co/400x400?text=No+Image'}
                                alt={product.name}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', border: '1px solid #f0f0f0' }}
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x400?text=Error" }}
                            />
                        </Col>

                        <Col xs={24} md={12}>
                            <div className="product-info">
                                <Title level={2}>{product.name}</Title>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={3} style={{ color: '#ff4d4f', margin: '0', display: 'inline-block' }}>
                                        {formatPrice(product.price)}
                                    </Title>
                                </div>

                                <Divider />

                                <div style={{ marginBottom: 16 }}>
                                    <Title level={5}>Mô tả:</Title>
                                    <Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'Xem thêm' }}>
                                        {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                                    </Paragraph>
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <Title level={5} style={{ display: 'inline-block', marginRight: 10 }}>Số lượng:</Title>
                                    <InputNumber
                                        min={1}
                                        // Use the calculated maxQuantityAllowed
                                        max={maxQuantityAllowed}
                                        // defaultValue={1} // defaultValue can cause issues with controlled components
                                        value={quantity}
                                        // Update state, ensuring value is at least 1 and not more than stock
                                        onChange={value => {
                                            const newQuantity = Math.max(1, Math.min(value || 1, maxQuantityAllowed));
                                             // Only update if stock allows (prevents typing higher number temporarily)
                                             if (maxQuantityAllowed > 0) {
                                                 setQuantity(newQuantity);
                                             } else if (value !== null) { // Allow clearing the input if stock is 0
                                                 setQuantity(1); // Or keep it 1 if you don't want it clearable
                                             }
                                        }}
                                        // Disable if product inactive or no stock
                                        disabled={!product.isActive || maxQuantityAllowed === 0}
                                        style={{ width: 70 }} // Adjust width as needed
                                    />
                                     {/* Show available stock */}
                                     {(product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity >= 0) && (
                                        <Text type="secondary" style={{ marginLeft: 10 }}>
                                            ({product.stock_quantity} sản phẩm có sẵn)
                                        </Text>
                                    )}
                                     {/* Show out of stock tag */}
                                     {(!product.isActive || maxQuantityAllowed === 0) &&
                                        <Tag color="error" style={{ marginLeft: 10 }}>Hết hàng</Tag>
                                    }
                                </div>

                                <Space wrap size="large">
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        size="large"
                                        onClick={handleAddToCart}
                                        // Disable if product inactive or no stock
                                        disabled={!product.isActive || maxQuantityAllowed === 0}
                                    >
                                        Thêm vào giỏ
                                    </Button>
                                    <Button
                                        type="primary" // Changed to danger for better visual distinction
                                        size="large"
                                        onClick={handleBuyNow}
                                         // Disable if product inactive or no stock
                                        disabled={!product.isActive || maxQuantityAllowed === 0}
                                        style={{
                                            backgroundColor: '#ff4d4f', // Use type="danger" instead
                                            borderColor: '#ff4d4f',
                                            fontWeight: 'bold'
                                        }}
                                        icon={<ThunderboltOutlined />}
                                    >
                                        Mua ngay
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                    </Row>

                     {/* Product Details Section */}
                     <div style={{ marginTop: 48 }}>
                        <Title level={3}>Chi tiết sản phẩm</Title>
                        <Descriptions bordered layout="vertical" column={{ xs: 1, sm: 2, md: 3 }}>
                            <Descriptions.Item label="Tên sản phẩm" span={3}>{product.name}</Descriptions.Item>
                            <Descriptions.Item label="Giá">{formatPrice(product.price)}</Descriptions.Item>
                            <Descriptions.Item label="Thương hiệu">{product.brand?.name || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Danh mục">{product.category?.name || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="SKU">{product.sku || 'N/A'}</Descriptions.Item>
                            <Descriptions.Item label="Tình trạng">
                                {product.isActive && maxQuantityAllowed > 0
                                    ? <Tag color="success">Còn hàng ({product.stock_quantity})</Tag>
                                    : <Tag color="error">Hết hàng</Tag>
                                }
                            </Descriptions.Item>
                             <Descriptions.Item label="Mô tả chi tiết" span={3}>
                                <Paragraph>
                                    {/* Use dangerouslySetInnerHTML if description contains HTML, otherwise render directly */}
                                    {/* Be cautious with dangerouslySetInnerHTML due to XSS risks if HTML is not sanitized */}
                                    {product.longDescription || product.description || 'Không có mô tả chi tiết.'}
                                </Paragraph>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default ProductDetailPage;
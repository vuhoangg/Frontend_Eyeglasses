import { Drawer, Button, Table } from  'antd';
import React, { useEffect, useState } from 'react';
import { fetchOrderByIdAPI } from '../../../services/api.order'; // Keep this import for order details
import { fetchOrderItemsByOrderIdAPI } from '../../../services/api.orderItem'; // Import new API for order items
import { formatNumber } from '../../../utils/format'; // Import utility function for formatting number
const OrderDetail = (props) =>{
    const {isDetailOpen, setIsDetailOpen, dataDetail, setDataDetail, reloadOrders } = props;
    const [orderDetailData, setOrderDetailData] = useState(null);
    const [orderItemsData, setOrderItemsData] = useState([]); // State for order items

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (dataDetail && dataDetail.id) {
                try {
                    const orderRes = await fetchOrderByIdAPI(dataDetail.id);
                    if (orderRes.data) {
                        setOrderDetailData(orderRes.data

                        );
                        console.log ("Order Detail ", orderRes.data);
                    }

                    const orderItemsRes = await fetchOrderItemsByOrderIdAPI(dataDetail.id); // Fetch order items
                    if (orderItemsRes.data) {
                        setOrderItemsData(orderItemsRes.data); // Set order items data
                        console.log("Order Items: ", orderItemsRes.data);
                    }
                } catch (error) {
                    console.error("Error fetching order details or items:", error);
                    // Handle error appropriately, maybe set some error state to display to user
                }
            }
        };

        fetchOrderDetail();
    }, [dataDetail]);


    const onClose = () => {
        setIsDetailOpen(false);
        setDataDetail(null);
        setOrderDetailData(null);
        setOrderItemsData([]); // Clear order items data when closing
    };

    const orderItemColumns = [
        { title: 'Tến sản phẩm', dataIndex: ['product', 'name'], key: 'productName' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Đơn Giá', dataIndex: 'price', key: 'price',
            render: (price) => formatNumber(price) // Format price
           },
          {
              title: 'Tổng cộng',
              key: 'total',
              render: (_, record) => {
                  const totalPrice = record.quantity * record.price;
                  return formatNumber(totalPrice); // Format total price
              },
          },
  
       
    ];


    return (
        <>
            <Drawer width={"80vw"} title={`Đơn hàng - Mã: ${dataDetail?.id}`} onClose={onClose} open={isDetailOpen} maskClosable={false} >
                {orderDetailData ? (
                    <>
                        <p><b>Mã đơn hàng :</b> {orderDetailData?.id}</p>
                        <p><b>Khách Hàng:</b> {orderDetailData.user?.username} ({orderDetailData.user?.email}, {orderDetailData.user?.phone})</p>
                        <p><b>Tông tiền:</b> {orderDetailData.totalAmount}</p>
                        <p><b>Shipping Address:</b> {orderDetailData.shippingAddress}</p>
                        <p><b>Phương thức thành toán: </b> {orderDetailData.paymentMethod}</p>
                        <p><b>Trạng thái đơn hàng: </b> {orderDetailData.orderStatus?.name}</p>
                        <p><b>Ngày Tạo: </b> {orderDetailData.creationDate}</p>
                        {/* <p><b>Modified Date:</b> {orderDetailData.modifiedDate}</p> */}

                        <h3>Chi tiết đơn hàng:</h3>
                        <Table
                            columns={orderItemColumns}
                            dataSource={orderItemsData} // Use orderItemsData for dataSource
                            rowKey="id"
                            pagination={false}
                        />
                    </>
                ) : (
                    <> <p> No order details available </p> </>
                )}
            </Drawer>
        </>
    );
};

export default OrderDetail;
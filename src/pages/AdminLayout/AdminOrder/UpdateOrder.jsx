//src/pages/AdminLayout/AdminOrder/UpdateOrder.jsx
import { Form, Input, Button, Row, Col, notification, Modal, Select, InputNumber } from "antd";
import React, { useState, useEffect } from "react";
import { updateOrderAPI } from "../../../services/api.order";
import { fetchAllOrderStatusAPI } from '../../../services/api.orderStatus';
import { fetchAllUsersAPI } from '../../../services/api.service';

const UpdateOrder = ({ isModalOpen, setIsModalOpen, orderData, reloadOrders }) => {
    const [id, setId] = useState("");
    const [userId, setUserId] = useState(null);
    const [orderStatusId, setOrderStatusId] = useState(null);
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);

    const [orderStatuses, setOrderStatuses] = useState([]);
    const [users, setUsers] = useState([]);

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchStatusesAndUsers = async () => {
            const statusesRes = await fetchAllOrderStatusAPI();
            if (statusesRes.data) {
                setOrderStatuses(statusesRes.data.data);
            }
            const usersRes = await fetchAllUsersAPI();
            if (usersRes.data) {
                setUsers(usersRes.data.data);
            }
        };

        fetchStatusesAndUsers();
    }, []);

    useEffect(() => {
        if (orderData) {
            setId(orderData.id || "");
            setUserId(orderData.userId || null);
            setOrderStatusId(orderData.orderStatus?.id || null);
            setShippingAddress(orderData.shippingAddress || "");
            setPaymentMethod(orderData.paymentMethod || "");
            setTotalAmount(parseFloat(orderData.totalAmount) || 0);

            form.setFieldsValue({
                id: orderData.id || "",
                userId: orderData.userId || null,
                orderStatusId: orderData.orderStatus?.id || null,
                shippingAddress: orderData.shippingAddress || "",
                paymentMethod: orderData.paymentMethod || "",
                totalAmount: parseFloat(orderData.totalAmount) || 0,
            });
        }
    }, [orderData, form]);

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = (values) => {
        handleSubmit(values);
    };

    const handleSubmit = async (values) => {
        try {
            // Use form values if provided, otherwise use state values
            const dataToSubmit = values || {
                userId,
                orderStatusId,
                shippingAddress,
                paymentMethod,
                totalAmount
            };
            
            const response = await updateOrderAPI(
                id,
                dataToSubmit.userId,
                dataToSubmit.orderStatusId,
                dataToSubmit.totalAmount,  // Fixed order - totalAmount comes first
                dataToSubmit.shippingAddress,
                dataToSubmit.paymentMethod,
                null  // promotionId is optional, passing null
            );

            if (response.data) {
                notification.success({
                    message: "Update Order",
                    description: "Order updated successfully!",
                });
                setIsModalOpen(false);
                reloadOrders();
            } else {
                notification.error({
                    message: "Update Order",
                    description: response.message || "Failed to update order.",
                });
            }
        } catch (error) {
            notification.error({
                message: "Update Order",
                description: error.response?.data?.message || "Failed to update order.",
            });
        }
    };

    const { Option } = Select;

    return (
        <Modal
            title="Cập nhật đơn hàng "
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Mã đơn hàng" name="id" >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Tên khách hàng" name="userId" rules={[{ required: true, message: "Please select User" }]}>
                            <Select
                                placeholder="Select a user"
                                onChange={(value) => setUserId(value)}
                            >
                                {users.map(user => (
                                    <Option key={user.id} value={user.id}>{user.username}</Option>
                                ))}
                            </Select >
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Trang thái" name="orderStatusId" rules={[{ required: true, message: "Please select Order Status" }]}>
                            <Select
                                placeholder="Select an order status"
                                onChange={(value) => setOrderStatusId(value)}
                            >
                                {orderStatuses.map(status => (
                                    <Option key={status.id} value={status.id}>{status.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Tổng tiền" name="totalAmount" rules={[{ required: true, message: "Please enter Total Amount" }]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={(value) => value.replace(/(,*)/g, "")}
                                onChange={(value) => setTotalAmount(value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Địa chỉ giao" name="shippingAddress" rules={[{ required: true, message: "Please enter Shipping Address" }]}>
                            <Input.TextArea rows={4} placeholder="Enter Shipping Address" onChange={(e) => setShippingAddress(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Phương thực thành toán " name="paymentMethod" rules={[{ required: true, message: "Please enter Payment Method" }]}>
                            <Input placeholder="Enter Payment Method" onChange={(e) => setPaymentMethod(e.target.value)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end" gutter={16}>
                    <Col>
                        <Button onClick={handleCancel}>Huỷ</Button>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit">
                           Cập nhật đơn hàng 
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateOrder;
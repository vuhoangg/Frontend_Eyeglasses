import React, { useState, useEffect } from 'react';
import {
  UserOutlined,
  SkinOutlined,
  InboxOutlined,
  FormOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";
import {
  Card,
  Statistic,
  Row,
  Col,
  Spin,
  Typography
} from "antd";
import {
  Bar,
  Line
} from '@ant-design/charts';
import {
  fetchUserCountAPI,
  fetchProductCountAPI,
  fetchOrderCountAPI,
  fetchBestSellingProductsAPI,
  fetchMonthlyRevenueAPI
} from '../../services/api.dashboard';
import { formatNumber } from '../../utils/format'; // Import formatNumber utility

const { Title, Text } = Typography;
const { Countdown } = Statistic;

const AdminDashboard = () => {
  // State variables to store fetched data
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

  // State variables for displaying animation of counters
  const [userCountDisplay, setUserCountDisplay] = useState(0);
  const [productCountDisplay, setProductCountDisplay] = useState(0);
  const [orderCountDisplay, setOrderCountDisplay] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Loading states for UI feedback
  const [loadingBasicStats, setLoadingBasicStats] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  useEffect(() => {
    // Function to fetch all dashboard data
    const fetchData = async () => {
      setLoadingBasicStats(true);
      setLoadingCharts(true);

      try {
        // Fetch basic statistics (user, product, order counts)
        const userCountData = await fetchUserCountAPI();
        setUserCount(userCountData.data.total);

        const productCountData = await fetchProductCountAPI();
        setProductCount(productCountData.data.total);

        const orderCountData = await fetchOrderCountAPI();
        setOrderCount(orderCountData.data.total);

        // Fetch chart data (best selling products, monthly revenue) concurrently
        const [bestSellingData, monthlyRevenue] = await Promise.all([
          fetchBestSellingProductsAPI(),
          fetchMonthlyRevenueAPI()
        ]);
        setBestSellingProducts(bestSellingData.data);
        setMonthlyRevenueData(monthlyRevenue.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingBasicStats(false);
        setLoadingCharts(false);
      }
    };

    fetchData();
  }, []);

  // Effect for animating the counter numbers
  useEffect(() => {
    if (loadingBasicStats) return;

    // Reset counters when data changes
    setUserCountDisplay(0);
    setProductCountDisplay(0);
    setOrderCountDisplay(0);
    setAnimationComplete(false);

    // Animation duration in milliseconds
    const animationDuration = 2000;
    // Number of steps in the animation
    const steps = 60;
    // Time between each step in milliseconds
    const stepTime = animationDuration / steps;

    // Calculate increments for each counter
    const userIncrement = userCount / steps;
    const productIncrement = productCount / steps;
    const orderIncrement = orderCount / steps;

    let currentStep = 0;

    const animationInterval = setInterval(() => {
      currentStep++;

      if (currentStep <= steps) {
        // Update display counters
        setUserCountDisplay(Math.floor(userIncrement * currentStep));
        setProductCountDisplay(Math.floor(productIncrement * currentStep));
        setOrderCountDisplay(Math.floor(orderIncrement * currentStep));
      } else {
        // Ensure final values are exact
        setUserCountDisplay(userCount);
        setProductCountDisplay(productCount);
        setOrderCountDisplay(orderCount);
        setAnimationComplete(true);
        clearInterval(animationInterval);
      }
    }, stepTime);

    // Clean up interval on component unmount
    return () => clearInterval(animationInterval);
  }, [loadingBasicStats, userCount, productCount, orderCount]);

  // Enhanced configuration for the Best Selling Products Bar Chart
  const bestSellingProductsConfig = {
    data: bestSellingProducts,
    xField: 'name', // Use 'name' from the full product details now
    yField: 'quantitySold',
    seriesField: 'name', // Use 'name' here as well
    label: {
      position: 'top',
      style: { fill: '#666', fontSize: 12 },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      min: 0,
    },
    // Enhanced styling for better visuals
    color: ['#1890ff', '#13c2c2', '#52c41a', '#faad14', '#eb2f96'],
    // Add animation
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1500,
      },
    },
    interactions: [
      { type: 'element-active' },
      { type: 'legend-highlight' },
    ],
    // Improved tooltip - Display more product info
    tooltip: {
      customContent: (value, items) => {
        if (!items || items.length === 0) return;
        const item = items[0];
        const product = item?.data; // Access full product data
        return `
          <div style="padding: 8px; border-radius: 4px; background: rgba(255,255,255,0.95); box-shadow: 0 2px 8px rgba(0,0,0,0.15)">
            <h4 style="margin-bottom:8px; color: #333; font-size: 14px;">${product?.name}</h4>
            <div style="padding: 4px 0;">
              <span style="display:inline-block; width: 100px; color: #666;">Số lượng đã bán:</span>
              <span style="font-weight: bold; color: #1890ff;">${product?.quantitySold}</span>
            </div>
            <div style="padding: 4px 0;">
              <span style="display:inline-block; width: 100px; color: #666;">Giá:</span>
              <span style="font-weight: bold; color: #52c41a;">${formatNumber(product?.price)} VNĐ</span>
            </div>
            ${product?.category ? `<div style="padding: 4px 0;">
              <span style="display:inline-block; width: 100px; color: #666;">Danh mục:</span>
              <span style="font-weight: bold;">${product.category.name}</span>
            </div>` : ''}
            ${product?.brand ? `<div style="padding: 4px 0;">
              <span style="display:inline-block; width: 100px; color: #666;">Nhãn hiệu:</span>
              <span style="font-weight: bold;">${product.brand.name}</span>
            </div>` : ''}
          </div>`;
      },
    },
  };

  // Enhanced configuration for the Monthly Revenue Line Chart
  const monthlyRevenueConfig = {
    data: monthlyRevenueData,
    xField: 'month',
    yField: 'revenue',
    // Improved style for line
    smooth: true,
    lineStyle: {
      stroke: '#1890ff',
      lineWidth: 3,
      lineDash: [0, 0],
      strokeOpacity: 0.7,
      shadowColor: '#1890ff',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
    // Add shaded area below line
    area: {
      style: {
        fill: 'l(270) 0:#ffffff 0.5:#1890ff 1:#1890ff',
        fillOpacity: 0.2,
      },
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#fff',
        stroke: '#1890ff',
        lineWidth: 2,
      },
    },
    // Add animation
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1500,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fill: '#666',
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#eee',
            lineWidth: 1,
          },
        },
      },
    },
    yAxis: {
      min: 0,
      label: {
        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        style: {
          fill: '#666',
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#eee',
            lineWidth: 1,
            lineDash: [4, 4],
          },
        },
      },
    },
    // Improved tooltip
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          borderRadius: '4px',
          padding: '10px',
        },
      },
      formatter: (datum) => {
        return {
          name: 'Doanh thu',
          value: `${datum.revenue.toLocaleString()} VNĐ`,
        };
      },
    },
  };

  // Loading state for basic statistics cards
  if (loadingBasicStats) {
    return (
      <div style={{
        textAlign: 'center',
        paddingTop: 100,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Đang tải dữ liệu thống kê...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Tổng quan Dashboard</Title>

      {/* Enhanced Statistics Cards with animated counters */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable bordered={false} style={{ borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              </div>
              <Text type="secondary">Người dùng</Text>
            </div>
            <div style={{
              color: '#1890ff',
              fontWeight: 'bold',
              fontSize: '24px',
              transition: 'all 0.3s'
            }}>
              {animationComplete ? userCount.toLocaleString() : userCountDisplay.toLocaleString()}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable bordered={false} style={{ borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{
                backgroundColor: 'rgba(82, 196, 26, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <SkinOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              </div>
              <Text type="secondary">Sản phẩm</Text>
            </div>
            <div style={{
              color: '#52c41a',
              fontWeight: 'bold',
              fontSize: '24px',
              transition: 'all 0.3s'
            }}>
              {animationComplete ? productCount.toLocaleString() : productCountDisplay.toLocaleString()}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable bordered={false} style={{ borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{
                backgroundColor: 'rgba(250, 173, 20, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <InboxOutlined style={{ fontSize: '24px', color: '#faad14' }} />
              </div>
              <Text type="secondary">Đơn hàng</Text>
            </div>
            <div style={{
              color: '#faad14',
              fontWeight: 'bold',
              fontSize: '24px',
              transition: 'all 0.3s'
            }}>
              {animationComplete ? orderCount.toLocaleString() : orderCountDisplay.toLocaleString()}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable bordered={false} style={{ borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <div style={{
                backgroundColor: 'rgba(235, 47, 150, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                <FormOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
              </div>
              <Text type="secondary">Bài viết</Text>
            </div>
            <Statistic
              value={24} // Giá trị cố định (chưa có API)
              valueStyle={{ color: '#eb2f96', fontWeight: 'bold' }}
              prefix={<span />}
            />
          </Card>
        </Col>
      </Row>

      {/* Enhanced Charts Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCartOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <span>Top 5 Sản phẩm bán chạy nhất</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: '8px' }}
          >
            {loadingCharts ? (
              <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="small" />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Đang tải biểu đồ...</Text>
                </div>
              </div>
            ) : (
              <div style={{ height: 350 }}>
                <Bar {...bestSellingProductsConfig} />
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DollarCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <span>Doanh thu hàng tháng (Năm hiện tại)</span>
              </div>
            }
            bordered={false}
            style={{ borderRadius: '8px' }}
          >
            {loadingCharts ? (
              <div style={{ textAlign: 'center', padding: 50 }}>
                <Spin size="small" />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Đang tải biểu đồ...</Text>
                </div>
              </div>
            ) : (
              <div style={{ height: 350 }}>
                <Line {...monthlyRevenueConfig} />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
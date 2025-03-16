import React from "react";
import { Col, Row, Typography } from "antd";
import { useLocation } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const { Title, Text } = Typography;

const Footer = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      <Row
        justify="center"
        style={{
          backgroundColor: "#0d0d19",
          padding: "50px 0",
          marginTop: isLoginPage ? 0 : "50px",
          textAlign: "center",
        }}
      >
        <Col xs={24} sm={12} md={6} lg={4}>
          <Title level={3} style={{ color: "white" }}>
            Top Products
          </Title>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Managed Website
          </Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Manage Reputation
          </Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Power Tools
          </Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Marketing Service
          </Text>
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <Title level={3} style={{ color: "white" }}>
            Quick Links
          </Title>
          <Text style={{ display: "block", color: "#bfbfbf" }}>Jobs</Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Brand Assets
          </Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Investor Relations
          </Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Terms of Service
          </Text>
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <Title level={3} style={{ color: "white" }}>
            Features
          </Title>
          <Text style={{ display: "block", color: "#bfbfbf" }}>Jobs</Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Brand Assets
          </Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Investor Relations
          </Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>
            Terms of Service
          </Text>
        </Col>

        <Col xs={24} sm={12} md={6} lg={4}>
          <Title level={3} style={{ color: "white" }}>
            Resources
          </Title>
          <Text style={{ display: "block", color: "#bfbfbf" }}>Guides</Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>Research</Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>Experts</Text>
          <Text style={{ display: "block", color: "#bfbfbf" }}>Agencies</Text>
        </Col>

        <Col>
          <DotLottieReact
            src="https://lottie.host/0e6af37e-e070-4ea1-80e5-5243c766a682/XxZvDkMqEP.lottie"
            loop
            autoplay
          />
        </Col>
      </Row>
    </>
  );
};

export default Footer;
import { useRouteError, useNavigate } from "react-router-dom";
import React from 'react';
import { Button, Result } from 'antd';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  const goHome = () => {
    navigate('/');
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle={`Sorry, an unexpected error has occurred: ${error.statusText || error.message}`}
      extra={<Button type="primary" onClick={goHome}>Back Home</Button>}
    />
  );
}
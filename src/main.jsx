import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './styles/global.css'
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import UserPage from '../src/pages/AdminLayout/AdminUser/user.jsx';
import IntroducePage from './pages/introduce.jsx';
import Client from './pages/ClientLayout/HomePage.jsx'
import AdminLayout from './pages/AdminLayout/AdminLayout.jsx';
import CreateUser from './pages/AdminLayout/AdminUser/CreateUser.jsx';
import ManageUser from './pages/AdminLayout/AdminUser/ManageUser.jsx';
import ErrorPage from './pages/Error/Error.jsx';
import HomePage from './pages/ClientLayout/HomePage.jsx';
import ProductPage from './pages/ClientLayout/Product.jsx';
import AboutUsPage from './pages/ClientLayout/AboutUsPage.jsx';
import ProductDetailPage from './pages/ClientLayout/ProductDetailPage.jsx';
import CartPage from './pages/ClientLayout/CartPage.jsx';

const router = createBrowserRouter([
  // Manager Client 
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children:[
      { index: true,  element: <HomePage/>,},
      { path: "/user", element: <UserPage />},
      { path: "/product", element: <ProductPage/>},
      { path: "/product_detail", element: <ProductDetailPage/>},
      { path: "/about_us_page", element: <AboutUsPage/>},
      { path: "/cart_page", element: <CartPage/>}
    ],
  },

  // Manager Login 
  { path: "/client",element: <Client/>},
  { path: "/login", element: <LoginPage/>},
  { path: "/introduce", element: <IntroducePage/>},
  { path: "/register", element: <RegisterPage />},

  // Admin 
  {
    path: "/admin",
    element:  <AdminLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      // { index: true, element:  <AdminDashboard/>  },
      {path: "user", element: <UserPage/> },
      { path: "list-user", element: <ManageUser/>  },
      {path: "add-user", element: <CreateUser/> },
    ]
  },
 

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <RouterProvider router={router} />

  </StrictMode>,
)

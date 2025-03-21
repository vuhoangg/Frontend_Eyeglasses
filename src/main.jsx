import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './styles/global.css'
import AdminLayout from './pages/AdminLayout/AdminLayout.jsx';
import CreateUser from './pages/AdminLayout/AdminUser/CreateUser.jsx';
import ManageUser from './pages/AdminLayout/AdminUser/ManageUser.jsx';
import ErrorPage from './pages/Error/Error.jsx';
import HomePage from './pages/ClientLayout/HomePage.jsx';
import ProductPage from './pages/ClientLayout/Product.jsx';
import AboutUsPage from './pages/ClientLayout/AboutUsPage.jsx';
import ProductDetailPage from './pages/ClientLayout/ProductDetailPage.jsx';
import CartPage from './pages/ClientLayout/CartPage.jsx';
import AdminDashboard from './pages/AdminLayout/AdminDashboard.jsx';
import CreateProduct from './pages/AdminLayout/AdminProduct/CreateProduct.jsx';
import ManageProduct from './pages/AdminLayout/AdminProduct/ManagerProduct.jsx';

const router = createBrowserRouter([


  // Manager Client 
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children:[
      { index: true,  element: <HomePage/>,},

      { path: "/product", element: <ProductPage/>},
      { path: "/product_detail", element: <ProductDetailPage/>},
      { path: "/about_us_page", element: <AboutUsPage/>},
      { path: "/cart_page", element: <CartPage/>}
    ],
  },
  // Manager Login 


  // Admin 
  {
    path: "/admin",
    element:  <AdminLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      { index: true, element:  <AdminDashboard/>  },

      // router user
      {path: "list-user", element: <ManageUser/>},
      {path: "add-user", element: <CreateUser/> },

      // reuter product 
      { path: "list-product", element: <ManageProduct/>},
      {path: "add-product", element: <CreateProduct/> },





    ]
  },
 

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <RouterProvider router={router} />

  </StrictMode>,
)

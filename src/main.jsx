//main.jsx
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
import LoginPage from './pages/LoginLayout/login.jsx';
import RegisterPage from './pages/LoginLayout/register.jsx';
import CheckoutPage from './pages/ClientLayout/CheckoutPage.jsx';
import OrderSuccessPage from './pages/ClientLayout/OrderSuccessPage.jsx';
import ManageCategory from './pages/AdminLayout/AdminCategory/ManageCategory.jsx';
import CreateCategory from './pages/AdminLayout/AdminCategory/CreateCategory.jsx';
import ManageBrand from './pages/AdminLayout/AdminBrand/ManageBrand.jsx';
import CreateBrand from './pages/AdminLayout/AdminBrand/CreateBrand.jsx';
import ManageOrder from './pages/AdminLayout/AdminOrder/ManageOrder.jsx';
import UserProfile from './pages/ClientLayout/UserProfile.jsx';
import ChangePassword from './pages/ClientLayout/ChangePassword.jsx';
import ManageVendor from './pages/AdminLayout/AdminVendor/ManageVendor.jsx';
import CreateVendor from './pages/AdminLayout/AdminVendor/CreateVendor.jsx';
import ManageImportReceipt from './pages/AdminLayout/AdminReceipt/ManageImportReceipt.jsx';
import CreateImportReceipt from './pages/AdminLayout/AdminReceipt/CreateImportReceipt.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';
import BlogPage from './pages/ClientLayout/BlogPage.jsx';
import VoucherPage from './pages/ClientLayout/VoucherPage.jsx';

const router = createBrowserRouter([


  // Manager Client 
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children:[
      { index: true,  element: <HomePage/>,},

      { path: "/product", element: <ProductPage/>},
      { path: "/product/:id", element: <ProductDetailPage/>},
      { path: "/about_us_page", element: <AboutUsPage/>},
      { path: "/cart_page", element: <CartPage/>}, // Add this line

      { path: "/blog", element: <BlogPage/>}, // Add Blog Page
      // { path: "/blog/:blogId", element: <BlogDetailPage/> }, // Add Blog Detail Page
      { path: "/voucher", element: <VoucherPage/>}, // Add Voucher Page


      { path: "/checkout",element: <CheckoutPage />,},
      { path: "/order-success", element: <OrderSuccessPage/> },

      { path: "/profile", element: <UserProfile /> }, // Direct route to UserProfile
      { path: "/password", element: <ChangePassword /> }, // Direct route to ChangePassword

   



    ],
  },
  // Manager Login 

  { path: "/login", element: <LoginPage/> },  
{ path: "/register", element: <RegisterPage/> },

  // Admin 
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin', 'staff']}> {/* Protect AdminLayout */}
      <AdminLayout/>
    </ProtectedRoute>
    ),
    errorElement: <ErrorPage/>,
    children: [
      { index: true, element:  <AdminDashboard/>  },

      // router user
      {path: "list-user", element: <ManageUser/>},
      {path: "add-user", element: <CreateUser/> },

      // reuter product 
      { path: "list-product", element: <ManageProduct/>},
      {path: "add-product", element: <CreateProduct/> },

       // router category
       { path: "list-category", element: <ManageCategory/>},
       {path: "add-category", element: <CreateCategory/> },
 
       // router brand
       { path: "list-brand", element: <ManageBrand/>},
       {path: "add-brand", element: <CreateBrand/> },

       // router order
      { path: "list-order", element: <ManageOrder/>},


       // *** THÊM ROUTE CHO VENDOR (SUPPLIER) ***
       { path: "list-supplier", element: <ManageVendor /> }, // Route bị thiếu gây lỗi 404
       { path: "add-supplier", element: <CreateVendor /> },
       // *****************************************

       // *** THÊM ROUTE CHO IMPORT RECEIPT ***
       { path: "list-receipt", element: <ManageImportReceipt /> },
       { path: "add-receipt", element: <CreateImportReceipt /> },
       // **************************************



    ]
  },
 

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <RouterProvider router={router} />

  </StrictMode>,
)

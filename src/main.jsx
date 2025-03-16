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
import ProductPage from './pages/product.jsx';
import TodoApp from './component/todolist/TodoApp.jsx';
import IntroducePage from './pages/introduce.jsx';
import Client from './Client.jsx'
import AdminLayout from './pages/AdminLayout/AdminLayout.jsx';
import CreateUser from './pages/AdminLayout/AdminUser/CreateUser.jsx';
import ManageUser from './pages/AdminLayout/AdminUser/ManageUser.jsx';
import ErrorPage from './pages/Error/Error.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,

    children:[
      { index: true, 
        element: <TodoApp />,
      },
      /* existing routes */
      {
        path: "/user",
        element: <UserPage />
      },
      {
        path: "/product",
        element: <ProductPage />
      }
    ],
  },

  {
    path: "/client",
    element: <Client/>
  },
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/introduce",
    element: <IntroducePage/>
  },
  {
    path: "/register",
    element: <RegisterPage />
  },

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

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
import UserPage from './pages/user.jsx';
import ProductPage from './pages/product.jsx';
import TodoApp from './component/todolist/TodoApp.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      { index: true, 
        element: <TodoApp />
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
    ]
  },
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
 

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <RouterProvider router={router} />

  </StrictMode>,
)

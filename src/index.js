import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgetPassword from './components/ForgetPassword';
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';
import AdminPanel from './components/AdminPanel';
import Add from './components/Add';
import Update from './components/Update';
import Details from './components/Details';
import UpdateProfile from './components/UpdateProfile';
import Fav from './components/Fav';
import Info from './components/Info';
import Rules from './components/Rules';
import NotFound from './components/NotFound';
const router = createBrowserRouter([
  {
    path: "/", element: <MainLayout />, children: [
      {path: "/",element: <div><App /></div>,},
      {path: "/user",element: <AdminPanel />},
      {path: "/add",element: <Add />},
      {path: "/update/:params",element: <Update />},
      {path: "/details/:params",element: <Details />},
      {path: "/updateuser",element: <UpdateProfile />},
      {path: "/fav",element: <Fav />},
      {path: "/info",element: <Info />},
      {path: "/rules",element: <Rules />},
      {path: "*",element: <NotFound />}
    ]
  },
  {
    path: "/", element: <AuthLayout />, children: [
      {path: "sign-in",element: <div><SignIn /></div>},
      {path: "sign-up",element: <div><SignUp /></div>},
      {path: "forget",element: <div><ForgetPassword /></div>,},
      {path: "*",element: <NotFound />}
    ]
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);


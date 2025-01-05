import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Donors from "./pages/Donors";
import Recipients from "./pages/Recipients";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDonors from "./pages/AdminDonors";
import Menu from "./components/Menu";
import VerifyEmail from "./pages/verifyEmail";
function App() {
  const Layout = () => {
    return (
      <div className = "flex">
        <div>
          <h1>
            <Menu />
          </h1>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element : <Home />
    },
    {
      path: "/admin",
      element: <Layout />,
      children: [
        {
          path: "/admin",
          element: <Admin/>
        },
        {
          path: "/admin/donors",
          element: <AdminDonors />
        },
      ]
    },
    {
      path: "/login",
      element : <Login />
    },
    {
      path: "/register",
      element : <Register />
    }, 
    {
      path: "/verify-email", 
      element: <VerifyEmail />,
    },
    {
      path: "/donors", 
      element: <Donors />,
    },
    {
      path: "/recipients", 
      element: <Recipients />,
    },
    
  ])

  return (
    <>
      <RouterProvider router={router } />
    </>
  )
}

export default App

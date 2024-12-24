import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donors from "./pages/Donors";
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
          element: <Donors/>
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
    
  ])

  return (
    <>
      <RouterProvider router={router } />
    </>
  )
}

export default App

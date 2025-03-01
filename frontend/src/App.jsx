import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Donors from "./pages/Donors";
import Recipients from "./pages/Recipients";
import Hospital from "./pages/Hospital";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import AdminDonors from "./pages/AdminDonors";
import NewDonor from "./pages/NewDonor";
import AdminRecipients from "./pages/AdminRecipients"
import AdminHospital from "./pages/AdminHospital"
import Inventory from "./pages/Inventory"
import BloodRequests from "./pages/BloodRequests"
import Eligibility from "./pages/Eligibility"
import AdminSettings from "./pages/AdminSettings";
import AdminLogout from "./pages/AdminLogout"
import Menu from "./components/Menu";
import VerifyEmail from "./pages/verifyEmail";
import NewRecipient from "./pages/NewRecipient";
import NewHospital from "./pages/NewHospital"
import EditDonor from "./pages/EditDonor";
import EditRecipient from "./pages/EditRecipient";
import EditHospital from "./pages/EditHospital";
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
          path: "/admin/users",
          element: <AdminUsers />
        },
        {
          path: "/admin/donors",
          element: <AdminDonors />
        },
        {
          path: "/admin/newdonor",
          element: <NewDonor />
        },
        {
          path: "/admin/donor/:id",
          element: <EditDonor />
        },
        {
          path: "/admin/donor/:id",
          element: <AdminDonors />,
        },
        {
          path: "/admin/recipients",
          element: <AdminRecipients />
        },
        {
          path: "/admin/newrecipient",
          element: <NewRecipient />
        },
        {
          path: "/admin/recipient/:id",
          element: <EditRecipient />
        },
        {
          path: "/admin/hospital",
          element: <AdminHospital />
        },
        {
          path: "/admin/newhospital",
          element: <NewHospital />
        },
        {
          path: "/admin/hospital/:id",
          element: <EditHospital />
        },
        {
          path: "/admin/inventory",
          element: <Inventory />
        },
        {
          path: "/admin/bloodrequests",
          element: <BloodRequests />
        },
        {
          path: "/admin/eligibility",
          element: <Eligibility />
        },
        {
          path: "/admin/settings",
          element: <AdminSettings />
        },
        {
          path: "/admin/logout",
          element: <AdminLogout />
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
    {
      path: "/hospital",
      element: <Hospital />
    }
    
  ])

  return (
    <>
      <RouterProvider router={router } />
    </>
  )
}

export default App  
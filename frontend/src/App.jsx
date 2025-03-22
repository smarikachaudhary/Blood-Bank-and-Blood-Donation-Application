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
import AdminRecipients from "./pages/AdminRecipients";
import AdminHospital from "./pages/AdminHospital";
import Inventory from "./pages/Inventory";
import BloodRequests from "./pages/BloodRequests";
import Eligibility from "./pages/Eligibility";
import AdminSettings from "./pages/AdminSettings";
import AdminLogout from "./pages/AdminLogout";
import Menu from "./components/Menu";
import DonorMenu from "./components/DonorMenu";
import RecipientMenu from "./components/RecipientMenu";
import HospitalMenu from "./components/HospitalMenu";
import VerifyEmail from "./pages/verifyEmail";
import NewRecipient from "./pages/NewRecipient";
import NewHospital from "./pages/NewHospital";
import EditDonor from "./pages/EditDonor";
import EditRecipient from "./pages/EditRecipient";
import EditHospital from "./pages/EditHospital";
import AddBlood from "./pages/AddBlood";
import EditInventroy from "./pages/EditInventroy";
import getTokenAndEmail from "./redux/getTokenAndEmail";
import { Navigate } from "react-router-dom";
import DonorEligibility from "./pages/DonorEligibility";
import DonorSchedulingDonations from "./pages/DonorSchedulingDonations";
import DonorDonateBlood from "./pages/DonorDonateBlood";
import DonorSettings from "./pages/DonorSettings";
import RecipientMakeRequest from "./pages/RecipientMakeRequest";
import RecipientTrackBloodRequest from "./pages/RecipientTrackBloodRequest";
import RecipientSettings from "./pages/RecipientSettings";
import HospitalBloodStock from "./pages/HospitalBloodStock";
import HospitalRequsetHistory from "./pages/HospitalRequestHistory";
import HospitalSettings from "./pages/HospitalSettings";
import Donations from "./pages/Donations";

function App() {
  const Layout = () => {
    const user = getTokenAndEmail();
    const role = user?.role;
    let SidebarMenu;
    if (role === "admin") {
      SidebarMenu = <Menu />;
    } else if (role === "donor") {
      SidebarMenu = <DonorMenu />;
    } else if (role === "recipient") {
      SidebarMenu = <RecipientMenu />;
    } else if (role === "hospital") {
      SidebarMenu = <HospitalMenu />;
    } else {
      SidebarMenu = null;
    }

    if (!role) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="flex">
        <div>
          <h1>{SidebarMenu}</h1>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/admin",
      element: <Layout />,
      children: [
        {
          path: "/admin",
          element: <Admin />,
        },
        {
          path: "/admin/users",
          element: <AdminUsers />,
        },
        {
          path: "/admin/donors",
          element: <AdminDonors />,
        },
        {
          path: "/admin/newdonor",
          element: <NewDonor />,
        },
        {
          path: "/admin/donor/:id",
          element: <EditDonor />,
        },
        {
          path: "/admin/donor/:id",
          element: <AdminDonors />,
        },
        {
          path: "/admin/recipients",
          element: <AdminRecipients />,
        },
        {
          path: "/admin/newrecipient",
          element: <NewRecipient />,
        },
        {
          path: "/admin/recipient/:id",
          element: <EditRecipient />,
        },
        {
          path: "/admin/hospital",
          element: <AdminHospital />,
        },
        {
          path: "/admin/newhospital",
          element: <NewHospital />,
        },
        {
          path: "/admin/hospital/:id",
          element: <EditHospital />,
        },
        {
          path: "/admin/inventory",
          element: <Inventory />,
        },
        {
          path: "/admin/addblood",
          element: <AddBlood />,
        },
        {
          path: "/admin/inventory/:id",
          element: <EditInventroy />,
        },
        {
          path: "/admin/donations",
          element: <Donations />,
        },
        {
          path: "/admin/bloodrequests",
          element: <BloodRequests />,
        },
        {
          path: "/admin/eligibility",
          element: <Eligibility />,
        },
        {
          path: "/admin/settings",
          element: <AdminSettings />,
        },
        {
          path: "/admin/logout",
          element: <AdminLogout />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/verify-email",
      element: <VerifyEmail />,
    },
    {
      path: "/donors",
      element: <Layout />,
      children: [
        {
          path: "/donors",
          element: <Donors />,
        },
        {
          path: "/donors/eligibility",
          element: <DonorEligibility />,
        },
        {
          path: "/donors/schedulingdonations",
          element: <DonorSchedulingDonations />,
        },
        {
          path: "/donors/donateblood",
          element: <DonorDonateBlood />,
        },
        {
          path: "/donors/settings",
          element: <DonorSettings />,
        },
      ],
    },
    {
      path: "/recipients",
      element: <Layout />,
      children: [
        {
          path: "/recipients",
          element: <Recipients />,
        },
        {
          path: "/recipients/makerequest",
          element: <RecipientMakeRequest />,
        },
        {
          path: "/recipients/trackbloodrequest",
          element: <RecipientTrackBloodRequest />,
        },
        {
          path: "/recipients/settings",
          element: <RecipientSettings />,
        },
      ],
    },
    {
      path: "/hospital",
      element: <Layout />,
      children: [
        {
          path: "/hospital",
          element: <Hospital />,
        },
        {
          path: "/hospital/bloodstock",
          element: <HospitalBloodStock />,
        },
        {
          path: "/hospital/requesthistory",
          element: <HospitalRequsetHistory />,
        },
        {
          path: "/hospital/settings",
          element: <HospitalSettings />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

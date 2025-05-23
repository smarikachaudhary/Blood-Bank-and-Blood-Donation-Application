import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Donors from "./pages/Donors";
import Recipients from "./pages/Recipients";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import AdminDonors from "./pages/AdminDonors";
import NewDonor from "./pages/NewDonor";
import AdminRecipients from "./pages/AdminRecipients";
import Inventory from "./pages/Inventory";
import BloodRequests from "./pages/BloodRequests";
import AdminSettings from "./pages/AdminSettings";
import AdminLogout from "./pages/AdminLogout";
import Menu from "./components/Menu";
import DonorMenu from "./components/DonorMenu";
import RecipientMenu from "./components/RecipientMenu";
import VerifyEmail from "./pages/verifyEmail";
import NewRecipient from "./pages/NewRecipient";
import EditDonor from "./pages/EditDonor";
import EditRecipient from "./pages/EditRecipient";
import AddBlood from "./pages/AddBlood";
import EditInventroy from "./pages/EditInventroy";
import getTokenAndEmail from "./redux/getTokenAndEmail";
import DonorSchedulingDonations from "./pages/DonorSchedulingDonations";
import DonorDonateBlood from "./pages/DonorDonateBlood";
import DonorViewHistory from "./pages/DonorViewHistory";
import DonorSettings from "./pages/DonorSettings";
import RecipientMakeRequest from "./pages/RecipientMakeRequest";
import RecipientTrackBloodRequest from "./pages/RecipientTrackBloodRequest";
import RecipientSettings from "./pages/RecipientSettings";
import Donations from "./pages/Donations";
import AdminMessages from "./pages/AdminMessages";

function App() {
  // Auth wrapper component
  const AuthWrapper = ({ children, allowedRoles }) => {
    const user = getTokenAndEmail();
    console.log("AuthWrapper user:", user);
    console.log("Allowed roles:", allowedRoles);

    if (!user) {
      console.log("No user found, redirecting to login");
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
      console.log(
        `User role ${user.role} not in allowed roles ${allowedRoles.join(
          ", "
        )}, redirecting to home`
      );
      
      // Check if user has a role stored in localStorage as a fallback
      const storedRole = localStorage.getItem("role");
      if (storedRole && allowedRoles.includes(storedRole)) {
        console.log(`Using stored role ${storedRole}, allowing access`);
        return children;
      }
      
      return <Navigate to="/" replace />;
    }

    console.log("Access granted to route");
    return children;
  };

  // PropTypes for AuthWrapper
  AuthWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  // Layout component with sidebar
  const Layout = ({ allowedRoles }) => {
    const user = getTokenAndEmail();
    let SidebarMenu;

    switch (user?.role) {
      case "admin":
        SidebarMenu = <Menu />;
        break;
      case "donor":
        SidebarMenu = <DonorMenu />;
        break;
      case "recipient":
        SidebarMenu = <RecipientMenu />;
        break;
      default:
        SidebarMenu = null;
    }

    return (
      <>
        <AuthWrapper allowedRoles={allowedRoles}>
          <div className="flex">
            {SidebarMenu && <div>{SidebarMenu}</div>}
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </AuthWrapper>
        <ToastContainer />
      </>
    );
  };

  // PropTypes for Layout
  Layout.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  // Public routes
  const publicRoutes = [
    {
      path: "/",
      element: <Home />,
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
  ];

  // Admin protected routes
  const adminRoutes = {
    path: "/admin",
    element: <Layout allowedRoles={["admin"]} />,
    children: [
      {
        index: true,
        element: <Admin />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "donors",
        element: <AdminDonors />,
      },
      {
        path: "newdonor",
        element: <NewDonor />,
      },
      {
        path: "donor/:id",
        element: <EditDonor />,
      },
      {
        path: "recipients",
        element: <AdminRecipients />,
      },
      {
        path: "newrecipient",
        element: <NewRecipient />,
      },
      {
        path: "recipient/:id",
        element: <EditRecipient />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "addblood",
        element: <AddBlood />,
      },
      {
        path: "inventory/:id",
        element: <EditInventroy />,
      },
      {
        path: "donations",
        element: <Donations />,
      },
      {
        path: "bloodrequests",
        element: <BloodRequests />,
      },
      {
        path: "messages",
        element: <AdminMessages />,
      },
      {
        path: "settings",
        element: <AdminSettings />,
      },
      {
        path: "logout",
        element: <AdminLogout />,
      },
    ],
  };

  // Donor protected routes
  const donorRoutes = {
    path: "/donors",
    element: <Layout allowedRoles={["donor"]} />,
    children: [
      {
        index: true,
        element: <Donors />,
      },
      {
        path: "schedulingdonations",
        element: <DonorSchedulingDonations />,
      },
      {
        path: "donateblood",
        element: <DonorDonateBlood />,
      },
      {
        path: "viewhistory",
        element: <DonorViewHistory />,
      },
      {
        path: "settings",
        element: <DonorSettings />,
      },
    ],
  };

  // Recipient protected routes
  const recipientRoutes = {
    path: "/recipients",
    element: <Layout allowedRoles={["recipient"]} />,
    children: [
      {
        index: true,
        element: <Recipients />,
      },
      {
        path: "makerequest",
        element: <RecipientMakeRequest />,
      },
      {
        path: "trackbloodrequest",
        element: <RecipientTrackBloodRequest />,
      },
      {
        path: "settings",
        element: <RecipientSettings />,
      },
    ],
  };

  // Combine all routes
  const router = createBrowserRouter([
    ...publicRoutes,
    adminRoutes,
    donorRoutes,
    recipientRoutes,
    // Fallback for 404
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <GoogleOAuthProvider
      clientId="196248224275-lam155k06e3pour20f319m3ngl42bf4h.apps.googleusercontent.com"
      onScriptLoadError={(error) => {
        console.error("Google Script load error:", error);
      }}
      onScriptLoadSuccess={() => {
        console.log("Google Script loaded successfully");
      }}
    >
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  );
}

export default App;

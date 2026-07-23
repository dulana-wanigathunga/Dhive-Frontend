import "./App.css";
import Layout from "./components/Layout";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import StarterPage from "./pages/StarterPage";
import { createTheme } from "@mui/material/styles";
import AdminDashboard from "./pages/AdminDashboard";
import OtpVerification from "./pages/OtpVerification";
import ExpireImage from "./assets/session-expire.png";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Followers from "./pages/Followers";
import Settings from "./pages/Settings";
import CreatePost from "./pages/CreatePost";
import DashboardHome from "./pages/DashboardHome";
import PageNotFound from "./pages/PageNotFound";
import { MantineProvider } from "@mantine/core";
import ForgetPasswordPage from "./components/form/ForgotPassword";
import PrivateRoute from "./pages/PrivateRoute";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "./store/userSlice";
import MessageModal from "./components/MessageModal";

export const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

function App() {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/auth" />,
      index: true,
    },
    {
      path: "/auth",
      element: (
        <Layout>
          <StarterPage />
        </Layout>
      ),
    },

    {
      path: "/otp-verification",
      element: (
        <PrivateRoute>
          <OtpVerification />
        </PrivateRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: <ForgetPasswordPage />,
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Layout>
            <AdminDashboard />
          </Layout>
        </PrivateRoute>
      ),
      children: [
        {
          path: "/dashboard",
          element: <Navigate to="home" replace />,
          errorElement: <PageNotFound />,
        },

        {
          path: "home",
          element: (
            <PrivateRoute>
              <DashboardHome />,
            </PrivateRoute>
          ),
        },
        {
          path: "analytics",
          element: <Analytics />,
        },
        {
          path: "content",
          element: <Content />,
        },
        {
          path: "followers",
          element: <Followers />,
        },

        {
          path: "create-post",
          element: (
            <MantineProvider>
              <CreatePost />
            </MantineProvider>
          ),
        },
        {
          path: "update-post/:postId",
          element: (
            <MantineProvider>
              <CreatePost />
            </MantineProvider>
          ),
        },
        {
          path: "settings",
          element: <Settings />,
        },
      ],
    },
    { path: "*", element: <PageNotFound /> },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef(null);

  const checkTokenExpiration = () => {
    if (user && user.expiresIn) {
      const currentTime = new Date().getTime();
      const expirationTime = user.expiresIn;
      if (currentTime >= expirationTime) {
        dispatch(signOut());
        setIsModalOpen(true);
        console.log("Token expired. Signing out...");
      } else {
        const timeLeft = Math.max(0, expirationTime - currentTime);
        console.log(`Token will expire in ${timeLeft / 1000} seconds.`);
      }
    }
  };

  useEffect(() => {
    // Check token expiration immediately when component mounts
    checkTokenExpiration();

    // Set up interval to check token expiration every 30 min
    intervalRef.current = setInterval(checkTokenExpiration, 30 * 60 * 1000);

    return () => {
      // Clear the interval on component unmount
      clearInterval(intervalRef.current);
    };
  }, [user]);

  const handleCancel = () => {
    // Handle session expiration confirmation
    console.log("Session expired, user confirmed");
    setIsModalOpen(false);
    window.location.replace("/auth");
  };
  return (
    <>
      <RouterProvider router={router} />
      <MessageModal
        isOpen={isModalOpen}
        title="Session Expired"
        message="Your session has expired. Please log in again to continue."
        confirmButtonLabel="Log In"
        closeModal={handleCancel}
        image={ExpireImage}
      />
    </>
  );
}

export default App;

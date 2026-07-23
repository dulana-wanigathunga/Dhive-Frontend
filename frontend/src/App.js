import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WriterPage from "./pages/WriterPage";
import PageNotFound from "./pages/PageNotFound";
import OptVerificationPage from "./pages/OtpVerificationPage";
import BlogPostPage from "./pages/BlogPostPage";
import ProfilePage from "./pages/ProfilePage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { signOut } from "./store/userSlice";
import MessageModal from "./components/MessageModal";
import ExpireImage from "./assets/session-expire.png";
import AboutPage from "./pages/AboutPage";
import PrivateRoute from "./components/PrivateRoute";

console.log("make this running)");

const router = createBrowserRouter([
  {
    index: true,
    path: "/",
    element: <HomePage />,
    exact: true,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/otp-verification",
    element: (
      <PrivateRoute>
        <OptVerificationPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PrivateRoute>
        <ForgetPasswordPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    ),
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "blog/:slug/:id?",
    element: <BlogPostPage />,
  },
  { path: "/writer/:id?", element: <WriterPage /> },
  { path: "*", element: <PageNotFound /> },
]);

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef(null);

  const checkTokenExpiration = () => {
    if (user && user.expiresIn) {
      const expirationDate = new Date(user.expiresIn);
      const currentTime = new Date().getTime();
      if (currentTime >= expirationDate.getTime()) {
        dispatch(signOut());
        setIsModalOpen(true);
        console.log("Token expired. Signing out...");
      } else {
        const timeLeft = Math.max(0, expirationDate.getTime() - currentTime);
        console.log(`Token will expire in ${timeLeft / 1000} seconds.`);
      }
    }
  };

  useEffect(() => {
    // Check token expiration immediately when component mounts
    checkTokenExpiration();

    // Set up interval to check token expiration every 30 minutes
    intervalRef.current = setInterval(checkTokenExpiration, 30 * 60 * 1000); // 30 minutes

    return () => {
      // Clear the interval on component unmount
      clearInterval(intervalRef.current);
    };
  }, [dispatch, user]);

  const handleCancel = () => {
    // Handle session expiration confirmation
    console.log("Session expired, user confirmed");
    setIsModalOpen(false);
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
};

export default App;

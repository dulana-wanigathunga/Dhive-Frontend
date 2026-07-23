import axios from "axios";
import toast from "react-hot-toast";

export const API_URL = process.env.REACT_APP_API_URL;

export const getGoogleSignUp = async (token) => {
  try {
    const user = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);

    if (user.sub) {
      const data = {
        name: user.name,
        email: user.email,
        emailVerified: user.email_verified,
        image: user.picture,
      };

      const result = await axios.post(`${API_URL}/auth/google-signup`, data);

      return result?.data;
    }
  } catch (error) {
    const err = error?.response?.data || error.message;
    console.log(err);
    return err;
  }
};

export const googleSignIn = async (token) => {
  try {
    const user = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);

    if (user.sub) {
      const data = {
        email: user.email,
      };

      const result = await axios.post(`${API_URL}/auth/login`, data);

      return result.data;
    }
  } catch (error) {
    const err = error.response.data || error.message;
    console.log(err);
    return err;
  }
};

export const emailSignUp = async (data) => {
  try {
    const result = await axios.post(`${API_URL}/auth/register`, data);

    return result.data;
  } catch (error) {
    const err = error.response.data || error.message;
    console.log(error);
    return err;
  }
};

export const emailLogin = async (data) => {
  try {
    const result = await axios.post(`${API_URL}/auth/login`, data);

    if (result.data.success) {
      toast.success(result.data.message);
      return result.data;
    } else {
      toast.error(result.data.message || "Something went wrong");
      return result.data;
    }
  } catch (error) {
    const err = error.response?.data || error.message;
    toast.error(err.message);
    console.log(err);
    return { success: false, message: err.message || "Something went wrong" };
  }
};

export const resetPassword = async (data) => {
  try {
    const result = await axios.put(`${API_URL}/users/reset-password`, data);

    return result.data;
  } catch (error) {
    const err = error.response.data || error.message;
    console.log(error);
    return err;
  }
};

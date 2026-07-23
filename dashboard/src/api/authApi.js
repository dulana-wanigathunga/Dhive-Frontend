import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

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
        accountType: "Writer",
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

export const googleSignUp = async (token) => {
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
        accountType: "Writer",
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

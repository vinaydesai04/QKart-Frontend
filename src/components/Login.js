import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Perform the Login API call
  const login = async (formData) => {
    if (!validateInput(formData)) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${config.endpoint}/auth/login`,
        {
          username: formData.username,
          password: formData.password,
        }
      );

      if (response.status === 201) {
        enqueueSnackbar("Logged in successfully", { variant: "success" });

        const { token, username, balance } = response.data;
        persistLogin(token, username, balance);

        history.push("/"); // redirect to products page
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Validate the input values
  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }

    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }

    return true;
  };

  // Persist user's login information
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>

          <TextField
            id="username"
            label="username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
          />

          <TextField
            id="password"
            label="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            className="button"
            variant="contained"
            fullWidth
            onClick={() => login(formData)}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "LOGIN TO QKART"
            )}
          </Button>

          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link to="/register" className="link">
              Register now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
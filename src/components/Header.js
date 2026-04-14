import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const [username, setUsername] = useState(localStorage.getItem("username"));

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  });

  const isLoggedIn = !!username;

  const handleBackToExplore = () => {
    history.push("/");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    history.push("/");
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon" />
      </Box>

      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={handleBackToExplore}
        >
          Back to explore
        </Button>
      ) : isLoggedIn ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src="avatar.png" alt={username || "user"} />
          <span>{username}</span>
          <Button variant="text" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button variant="text" onClick={() => history.push("/login")}>
            Login
          </Button>
          <Button
            variant="contained"
            onClick={() => history.push("/register")}
          >
            Register
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
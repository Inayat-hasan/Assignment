"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Box,
  Tooltip,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import {
  Brightness4,
  Brightness7,
  Logout,
  Login,
  PersonAdd,
} from "@mui/icons-material";
import { useThemeContext } from "../contexts/themeContext";
import { useAuth } from "@/contexts/authContext";

const Header = () => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { mode, toggleTheme } = useThemeContext();

  const { user, isLoading, error, handleLogout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  // const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setLogoutDialogOpen(false);
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <a href="/">
            <Typography variant="h6" noWrap className="cursor-pointer">
              📝 TodoApp
            </Typography>
          </a>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Toggle theme */}
            <Tooltip title="Toggle theme">
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Auth section */}
            {!isLoading && (
              <>
                <IconButton onClick={handleMenuClick} color="inherit">
                  <Avatar alt={user?.name || "Guest"} />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                    },
                  }}
                >
                  {user
                    ? [
                        <MenuItem
                          key="user-info"
                          disableRipple
                          sx={{
                            cursor: "default",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography variant="subtitle1">
                            {user.displayName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </MenuItem>,
                        <MenuItem key="logout" onClick={confirmLogout}>
                          <Logout fontSize="small" sx={{ mr: 1 }} />
                          Logout
                        </MenuItem>,
                      ]
                    : [
                        <a href="/login">
                          <MenuItem
                            key="login"
                            onClick={() => console.log("login clicked")}
                          >
                            <Login fontSize="small" sx={{ mr: 1 }} />
                            Login
                          </MenuItem>
                        </a>,
                        <a href="/register">
                          <MenuItem
                            key="register"
                            onClick={() => console.log("register clicked")}
                          >
                            <PersonAdd fontSize="small" sx={{ mr: 1 }} />
                            Register
                          </MenuItem>
                        </a>,
                      ]}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;

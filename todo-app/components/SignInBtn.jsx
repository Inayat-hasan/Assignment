"use client";
import { useAuth } from "../contexts/authContext.js";
import React from "react";
import { Button, Typography, Box, Paper, Stack } from "@mui/material";

const SignInBtn = ({ name }) => {
  const { handleLogin, user } = useAuth();

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 4 }}>
      <Stack spacing={2} alignItems="center">
        {user ? (
          <>
            <Typography variant="h6">Welcome back, {user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </>
        ) : null}

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={!!user}
          fullWidth
        >
          {user ? "Already Logged In" : name}
        </Button>
      </Stack>
    </Paper>
  );
};

export default SignInBtn;

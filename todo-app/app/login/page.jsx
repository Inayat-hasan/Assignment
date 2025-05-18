"use client";
import React from "react";
import { Container, Typography } from "@mui/material";
import SignInBtn from "@/components/SignInBtn";
import { useThemeContext } from "@/contexts/themeContext";

const Page = () => {
  const { mode } = useThemeContext();

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      <SignInBtn name="Login with Google" />
    </Container>
  );
};

export default Page;

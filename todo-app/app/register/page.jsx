"use client";
import React from "react";
import { Container, Typography } from "@mui/material";
import SignInBtn from "@/components/SignInBtn";
import { useAuth } from "@/contexts/authContext";

const Page = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Register
      </Typography>
      <SignInBtn name="Register with Google" />
    </Container>
  );
};

export default Page;

"use client";
import React, { useState, useEffect } from "react";
import "./signin.scss";
import {
  Grid,
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react"; // Import NextAuth hooks
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignIn = () => {
  const { data: session } = useSession(); // Get authentication status
  const router = useRouter();

  const [signInFields, setSignInFields] = useState({
    email: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (session) {
      router.push("/dashboard"); // Redirect if already logged in
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signInFields.email || !signInFields.password) {
      setSnackbar({
        open: true,
        message: "Please fill in all fields.",
        severity: "error",
      });
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: signInFields.email,
        password: signInFields.password,
      });

      if (res?.error) {
        setSnackbar({ open: true, message: res.error, severity: "error" });
      } else {
        setSnackbar({
          open: true,
          message: "Signed in successfully!",
          severity: "success",
        });

        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Something went wrong!",
        severity: "error",
      });
    }
  };

  return (
    <div className="signin">
      <Grid container spacing={2}>
        {/* Form Section */}
        <Grid item xs={6}>
          <Container maxWidth="sm">
            <div className="signin--content">
              <Typography variant="h4" gutterBottom>
                Welcome Back!
              </Typography>
              <Typography
                variant="subtitle1"
                className="sub-title"
                gutterBottom
              >
                {session
                  ? "You are already logged in!"
                  : "Sign in to access your account"}
              </Typography>

              {/* If user is already logged in, show 'Go to Dashboard' button */}
              {session ? (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <form
                  className="signin--form"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={signInFields.email}
                        onChange={(e) =>
                          setSignInFields({
                            ...signInFields,
                            email: e.target.value,
                          })
                        }
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={signInFields.password}
                        onChange={(e) =>
                          setSignInFields({
                            ...signInFields,
                            password: e.target.value,
                          })
                        }
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        className="btn-primary"
                      >
                        Sign In
                      </Button>
                    </Grid>
                    <Grid item xs={12} >
                      <Typography variant="body2">
                        Don't have an account?{" "}
                        <Link
                          href="/signup"
                          style={{ color: "#1976d2", textDecoration: "none" }}
                        >
                          Sign Up
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </form>
              )}
            </div>
          </Container>
        </Grid>

        {/* Banner Section */}
        <Grid item xs={6} className="signin--banner">
          {/* <div className="slider-item">
            <h2>What's new?</h2>
            <h3>Pi Network's KYC Verification Deadline</h3>
            <p>Pi Network, a cryptocurrency platform, set a final KYC verification deadline for January 31, 2025, ahead of its planned mainnet launch in March. Users who do not complete the KYC process risk forfeiting most of their Pi holdings, as the platform aims to maintain network integrity and eliminate fraudulent accounts.</p>
          </div> */}
        </Grid>
      </Grid>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignIn;

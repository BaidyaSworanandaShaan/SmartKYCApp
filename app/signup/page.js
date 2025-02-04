"use client";
import React, { useState, useEffect } from "react";
import "./signup.scss";
import {
  Grid,
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import NextAuth hooks

const Signup = () => {
  const { data: session, status } = useSession(); // Get authentication status
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard"); // Redirect if user is already logged in
    }
  }, [session, router]);

  const [signUpFields, setSignUpFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = signUpFields;
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

    // Name validation
    if (!name) newErrors.name = "Name is required.";
    else if (name.length < 3)
      newErrors.name = "Name must be at least 3 characters long.";

    // Password validation
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";

    // Confirm Password validation
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("/api/user", {
          name,
          email,
          password,
        });

        if (response.status === 201) {
          setSnackbar({
            open: true,
            message: "User registered successfully!",
            severity: "success",
          });
          setTimeout(() => router.push("/signin"), 1000);
        }
      } catch (error) {
        let errorMessage = "An unexpected error occurred. Try again later.";
        if (error.response) {
          errorMessage =
            error.response.data.message || "Signup failed. Please try again.";
        }
        setSnackbar({ open: true, message: errorMessage, severity: "error" });
      }
    }
  };

  // Show loading while checking authentication status
  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="signup">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Container maxWidth="sm">
            <div className="signup--content">
              <Typography variant="h4" className="title" gutterBottom>
                Join VerifyNow Today
              </Typography>
              <Typography
                variant="subtitle1"
                className="sub-title"
                gutterBottom
              >
                Secure Your Identity and Streamline Your Experience
              </Typography>
              <form
                className="signup--form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      value={signUpFields.name}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          name: e.target.value,
                        })
                      }
                      margin="normal"
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      value={signUpFields.email}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          email: e.target.value,
                        })
                      }
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={signUpFields.password}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          password: e.target.value,
                        })
                      }
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={signUpFields.confirmPassword}
                      onChange={(e) =>
                        setSignUpFields({
                          ...signUpFields,
                          confirmPassword: e.target.value,
                        })
                      }
                      margin="normal"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      className="btn btn-primary"
                      fullWidth
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        </Grid>
        <Grid item xs={6} className="signup--banner">
          <div className="slider-item">
            <h2>What's new?</h2>
            <h3>Pi Network's KYC Verification Deadline</h3>
            <p>Pi Network, a cryptocurrency platform, set a final KYC verification deadline for January 31, 2025, ahead of its planned mainnet launch in March. Users who do not complete the KYC process risk forfeiting most of their Pi holdings, as the platform aims to maintain network integrity and eliminate fraudulent accounts.</p>
          </div>
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

export default Signup;

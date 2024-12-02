'use client';
import React from "react";
import "./login.scss";
import { TextField, Button,Grid,Container, Typography} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import kycVerification from "../../assets/images/verification.png"; // Adjust the import path as needed
const LoginForm = () => {
  return (
    <div className="login">
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Container maxWidth="sm">
          <div className="login--content">
          <Typography variant="h5" className="form-title">
        Login to Your Account
      </Typography>
      <form noValidate autoComplete="off">
        <TextField
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Link href="#" className="forgot-password">
          Forgot password?
        </Link>
        <Button
          variant="contained"
          color="primary"
          className="btn btn-primary"
          fullWidth
        >
          Login
        </Button>
      </form>
      <Typography variant="body2" className="switch-auth">
        Not a member?{" "}
        <Link href="#">
          Signup now
        </Link>
      </Typography>
          </div>
        </Container>
      </Grid>
      <Grid item xs={6} className="login--banner">
        <div className="slider-item">
          <Image
            className="slider-image"
            src={kycVerification}
            alt="Instant KYC Verification"
            width={400}
            height={400}
          />
          <h3 className="title">Instant KYC Verification</h3>
          <span className="sub-title">
            Get verified in just a few minutes with our streamlined process.
          </span>
        </div>
      </Grid>
    </Grid>
  </div>
  );
};

export default LoginForm;

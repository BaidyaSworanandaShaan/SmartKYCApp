import React from "react";
import "./signup.scss";
import {
  Grid,
  TextField,
  Button,
  Container,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import kycVerification from "../../assets/images/verification.png"; // Adjust the import path as needed
const Signup = () => {
  return (
    <div className="signup">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Container maxWidth="sm">
            <div className="signup--content">
              <div className="logo">VN</div>
              <h2 className="title">Join VerifyNow Today</h2>
              <span className="sub-title">
                Secure Your Identity and Streamline Your Experience
              </span>
              <form className="signup--form" noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      type="email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      className="btn btn-primary"
                      fullWidth
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

export default Signup;


import React from "react";

import { Button, Container, Grid,Box } from "@mui/material";
import "./style.scss"; // Adjust the import path based on your styles
import Link from "next/link";
const SignupBanner = () => {
  return (
    <div className="signup-banner">
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <h2 className="title">Fast, Safe, Verified - That’s VerifyNow.</h2>
          <p className="desc">
            Create an account and access cutting-edge tools to secure and
            streamline your verification needs!
          </p>
          <Box sx={{ marginTop: 3, display: "flex", gap: "10px" }}>
            <Link href="/signup">
              <Button className="btn btn-secondary">Sign Up Now</Button>
            </Link>
            <Link href="/login">
              <Button className="btn-secondary">Log In</Button>
            </Link>
          </Box>
        </Grid>
        <Grid item md={4} xs={12}>
          {/* <img src={dashboardImg} alt="Dashboard" className="dashboard-image" /> */}
        </Grid>
      </Grid>
    </div>
  );
};

export default SignupBanner;

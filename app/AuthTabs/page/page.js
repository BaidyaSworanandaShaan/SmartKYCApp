import React, { useState } from "react";
import { Grid, Tabs, Tab, Box, Typography } from "@mui/material";
import LoginForm from "./LoginForm"; // Import the LoginForm component
import Signup from "./Signup"; // Import the Signup component
import Image from "next/image";
import kycVerification from "../../assets/images/verification.png"; // Adjust as needed
import "./auth.scss"; // Add any global styles

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState(0); // State to toggle tabs

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="auth-page">
      <Grid container spacing={2}>
        {/* Left Side: Tabs + Forms */}
        <Grid item xs={6}>
          <Box>
            {/* Tabs for switching between Login and Signup */}
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Signup" />
            </Tabs>

            {/* Content: Login or Signup based on the active tab */}
            {activeTab === 0 && <LoginForm />} {/* Render LoginForm */}
            {activeTab === 1 && <Signup />}   {/* Render Signup */}
          </Box>
        </Grid>

        {/* Right Side: Static Banner */}
        <Grid item xs={6} className="auth-banner">
          <div className="slider-item">
            <Image
              className="slider-image"
              src={kycVerification}
              alt="Instant KYC Verification"
              width={400}
              height={400}
            />
            <h3 className="title">Instant KYC Verification</h3>
            <Typography variant="body2" className="sub-title">
              Get verified in just a few minutes with our streamlined process.
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AuthTabs;

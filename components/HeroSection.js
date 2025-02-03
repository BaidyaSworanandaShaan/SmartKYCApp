import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./style.scss"; // Import your stylesheet
import bannerImg from "../assets/images/bannerimg.png"; // Adjust the import path as needed
import Image from "next/image";
const HeroSection = () => {
  return (
    <div className="banner">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        spacing={2}
      >
        {/* Text Section */}
        <Grid item xs={12} className="text-section">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" className="banner-title">
              Revolutionize Your KYC Process
            </Typography>
            <Typography variant="h5" className="banner-subtitle">
              Join VerifyNow and unlock the power of fast, secure identity
              verification! Our streamlined process allows you to complete your
              KYC verification in minutes—no more waiting in line or dealing
              with complicated paperwork.
            </Typography>
            <Box sx={{ marginTop: 3, display: "flex", gap: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                href="/signin"
                className="btn-primary"
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="primary"
                href="#"
                className="btn-secondary"
              >
                View Demo
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Image Section */}
        <Grid item xs={12} className="image-section">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%" // Optional: Adjusts height to center vertically
          >
            <Image
              src={bannerImg} // Example image URL
              alt="facial recognition image"
              className="banner-image"
              width={700} // Set an appropriate width
              height={700}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default HeroSection;

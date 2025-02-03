import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../(auth)/api/auth/[...nextauth]/route";

import { CircularProgress, Container, Typography, Button } from "@mui/material";
import { signOut } from "next-auth/react"; // Import signOut
import Navbar from "@/components/Navbar";
import Link from "next/link";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div>
      <Container sx={{ marginTop: "150px" }}>
        <Typography variant="h3" gutterBottom>
          Welcome to your Dashboard, {session?.user?.name || "User"}!
        </Typography>

        <Typography variant="h6" paragraph>
          To enhance your security and streamline your verification process,
          please proceed with verifying your citizen data for Know Your Customer
          (KYC) purposes. Our system uses advanced technologies like facial
          recognition and Optical Character Recognition (OCR) to ensure the
          accuracy and safety of your personal information. This quick and
          secure process will help you access all the features of our platform
          with full confidence.
        </Typography>

        {/* Example Content */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/stepper"
        >
          Proceed To Verification
        </Button>
      </Container>
    </div>
  );
};

export default Dashboard;

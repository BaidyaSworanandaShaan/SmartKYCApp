"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Use useSession hook
import "./style.scss";

const Navbar = () => {
  const { data: session } = useSession(); // Automatically updates when session changes

  return (
    <div className="navbar">
      <Container className="navbar-container">
        <Typography variant="h6" className="navbar-title">
          <Link href="/" style={{ textDecoration: "none" }}>
            VERIFYNOW
          </Link>
        </Typography>

        <div className="navbar-buttons">
          {session ? (
            <>
              <Button
                color="inherit"
                component={Link}
                href="/dashboard" // Dashboard route for logged-in users
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/signin">
                Login
              </Button>
              <Button color="inherit" component={Link} href="/signup">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;

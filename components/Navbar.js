"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Use useSession hook
import "./style.scss";
import Image from "next/image";
import LogoImg from "../assets/images/logo/logo-main.png";
const Navbar = () => {
  const { data: session } = useSession(); // Automatically updates when session changes

  return (
    <div className="navbar">
      <Container className="navbar-container">
        <Typography variant="h6" className="navbar-title">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Image
              src={LogoImg}
              alt="VERIFYNOW Logo"
              height={30} // Using number for height in pixels
              width="auto"
            />
          </Link>
        </Typography>

        <div className="navbar-buttons">
          {session ? (
            <>
              <Button
                color="inherit"
                className="btn-primary"
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
              <Link href="/signup" passHref>
                <Button className="btn-primary" color="inherit">
                  Sign Up
                </Button>
              </Link>
              <Link href="/signin" passHref>
                <Button color="inherit">Login</Button>
              </Link>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;

"use client"; // Add this at the top


import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import RegisterSteps from "@/components/RegisterSteps";
import SignupBanner from "@/components/SignupBanner";
import { Container } from "@mui/material";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      // once: true, // Whether animation should happen only once while scrolling
      easing: "ease-in-out", // Animation easing function
    });
  }, []);

  return (
    <main>
      <HeroSection />

      <Container maxWidth="lg">
        {/* Explore cutting-edge features section */}
        <Features
          subTitle="Features"
          title="Explore Our Cutting-Edge Features"
        />

        {/* Registration steps */}
        <RegisterSteps />

        {/* Signup banner */}
        <SignupBanner />
      </Container>
    </main>
  );
}

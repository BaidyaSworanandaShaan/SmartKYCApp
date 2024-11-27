import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";
import RegisterSteps from "@/components/RegisterSteps";
import SignupBanner from "@/components/SignupBanner";
import { Container } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Container maxWidth="lg">
        <Container maxWidth="lg">
          <Features
            subTitle={<>Features</>}
            title={<>Explore Our Cutting-Edge Features</>}
          />
        </Container>
        <RegisterSteps />
        <SignupBanner />
      </Container>
    </main>
  );
}

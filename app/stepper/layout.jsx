"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import UploadDocument from "./upload-document/page";
import FacialRecognition from "./facial-recognition/page";
import Success from "./sucess/page";
import "./stepper.scss";
import DocumentVerification from "./document-verification/page";
const steps = [
  {
    label: "Upload Document",
    path: "/stepper/upload-document",
    component: <UploadDocument />,
  },
  {
    label: "Facial Recognition",
    path: "/stepper/facial-recognition",
    component: <FacialRecognition />,
  },
  {
    label: "Document Verification",
    path: "/stepper/facial-recognition",
    component: <DocumentVerification />,
  },
  {
    label: "Complete",
    path: "/stepper/success",
    component: <Success />,
  },
];

export default function HorizontalLinearStepper() {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);

  // Sync activeStep with the current route
  React.useEffect(() => {
    const currentPath = window.location.pathname;
    const stepIndex = steps.findIndex((step) => step.path === currentPath);
    if (stepIndex !== -1) {
      setActiveStep(stepIndex);
    }
  }, []);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      router.push(steps[nextStep].path);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      router.push(steps[prevStep].path);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    router.push(steps[0].path); // Navigate to the first step
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: "100%", margin: "100px 0" }}>
        <Stepper activeStep={activeStep} className="stepper-header">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div sx={{ mt: 2, mb: 1 }}>{steps[activeStep].component}</div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                pt: 2,
                justifyContent: "center",
              }}
            >
              <Button
                className="btn-primary"
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Container>
  );
}

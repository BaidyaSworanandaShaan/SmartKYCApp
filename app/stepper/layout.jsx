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
import DocumentStorage from "./document-storage/page";
import { useCookies } from "react-cookie";
import axios from "axios";
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
    path: "/stepper/document-verification",
    component: <DocumentVerification />,
  },
  {
    label: "Secure Storage",
    path: "/stepper/document-storage",
    component: <DocumentStorage />,
  },
];

export default function HorizontalLinearStepper() {
  const [cookies] = useCookies([
    "extractedInfo",
    "croppedFace",
    "uploadedFiles",
  ]);
  console.log(cookies, "cookies");
  const [extractedInfo] = React.useState(cookies.extractedInfo || {});
  const [croppedFace] = React.useState(cookies.croppedFace || {});
  const [uploadedFiles] = React.useState(
    Array.isArray(cookies.uploadedFiles) ? cookies.uploadedFiles : []
  );

  console.log(uploadedFiles, "UF");
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

  const saveExtractedData = async () => {
    // Destructure and organize the data from extractedInfo, croppedFace, and uploadedFiles
    const {
      citizenshipNumber,
      fullName,
      sex,
      dob,
      birthPlace,
      permanentAddress,
      wardNumber,
    } = extractedInfo;
    const frontImg = uploadedFiles[0]; // Assuming the first file is the front image
    const backImg = uploadedFiles[1]; // Assuming the second file is the back image
    const userImg = croppedFace; // Assuming the cropped face is the user image

    // Prepare the data to send to the server in the required format
    const updatedData = {
      userId: 27, // You can pass a real userId from your app state or context
      certificateNumber: citizenshipNumber,
      fullName,
      gender: sex, // Mapping 'sex' to 'gender' as expected by your backend
      dob: `${dob.year}-${dob.month}-${dob.day}`, // Format the date appropriately
      birthplace: birthPlace.district, // Extract birthPlace from the nested object
      permanentAddress: permanentAddress.district, // Extract permanentAddress from the nested object
      wardNumber,
      frontImg,
      backImg,
      userImg,
    };

    console.log("Saving extracted data: ", updatedData);

    const options = {
      path: "/",
      maxAge: 24 * 60 * 60,
    };

    try {
      const response = await axios.post("/api/saveCitizenship", updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Data saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving extracted data: ", error);
    }
  };
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      router.push(steps[nextStep].path);
    } else {
      saveExtractedData();
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

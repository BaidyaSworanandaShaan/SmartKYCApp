"use client";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js"; // Import Tesseract.js
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";

const FacialRecognition = () => {
  const [cookies] = useCookies(["uploadedFiles"]); // Access uploaded files from cookies

  const [isProcessing, setIsProcessing] = useState(false);
  const [matchStatus, setMatchStatus] = useState(null);
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load the face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Assumes models are stored in /public/models
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      console.log("FaceAPI models loaded.");
    };
    loadModels();

    return () => {
      if (webcamStream) {
        webcamStream.getTracks().forEach((track) => track.stop()); // Clean up webcam
      }
    };
  }, [webcamStream]);

  // Start webcam stream
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setWebcamStream(stream);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert("Unable to access the webcam. Please check permissions.");
    }
  };

  // Handle face comparison
  const handleFaceComparison = async () => {
    if (!cookies.uploadedFiles || cookies.uploadedFiles.length < 1) {
      alert("No document found in cookies!");
      return;
    }

    setIsProcessing(true);
    setMatchStatus(null);
    setExtractedInfo(null);

    // Load the uploaded document image
    const documentImage = await faceapi.fetchImage(cookies.uploadedFiles[0]);

    // Detect the face and landmarks from the uploaded document
    const uploadedFace = await faceapi
      .detectSingleFace(documentImage)
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!uploadedFace) {
      alert("No face detected in the uploaded document.");
      setIsProcessing(false);
      return;
    }

    const uploadedFaceDescriptor = uploadedFace.descriptor;

    // Start face detection on the webcam feed
    const detectFaceOnWebcam = async () => {
      const webcamFace = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (webcamFace) {
        const distance = faceapi.euclideanDistance(
          uploadedFaceDescriptor,
          webcamFace.descriptor
        );

        const isMatched = distance < 0.6; // Match threshold
        if (isMatched) {
          setMatchStatus("Matched");
          clearInterval(detectionInterval);
          performOCR(cookies.uploadedFiles[1]); // Perform OCR if matched
        } else {
          setMatchStatus("Unmatched");
        }
      }
    };

    const detectionInterval = setInterval(detectFaceOnWebcam, 500);

    // Stop detection after 5 seconds
    setTimeout(() => {
      clearInterval(detectionInterval);
      setIsProcessing(false);
    }, 5000);
  };

  // Perform OCR on the uploaded document
  const performOCR = async (imagePath) => {
    try {
      const result = await Tesseract.recognize(imagePath, "eng");
      const extractedText = result.data.text;

      console.log("Extracted Text:\n", extractedText);

      // Clean the text
      const cleanText = extractedText
        .replace(/[^A-Za-z0-9\s:.-]/g, " ") // Remove non-alphanumeric characters
        .replace(/\s+/g, " ") // Replace multiple spaces with one
        .trim(); // Trim extra spaces at the start/end

      console.log("Cleaned Text:", cleanText);

      // Define regex patterns
      const patterns = {
        certificateNo: /Citizenship\s*Certificate\s*No\s*[:\-]?\s*([\d\-]+)/i,
        fullName: /Full\s*Name\s*[:.\-]?\s*([A-Z\s]+)(?=\s*Date\s*of\s*Birth)/i,

        dob: /Date\s*of\s*Birth.*?Year[:\-]?\s*(\d{4})\s*Month[:\-]?\s*([A-Z]+)\s*Day[:\-]?\s*(\d{1,2})/i,
        birthPlace:
          /Birth\s*Place.*?District[:\-]?\s*([A-Za-z\s]+?)\s*Metropolitan\s*[:\-]?\s*([A-Za-z\s]+)/i,
        permanentAddress:
          /Permanent\s*Address.*?District[:\-]?\s*([A-Za-z\s]+?)\s*Metropolitan\s*[:\-]?\s*([A-Za-z\s]+)/i,
      };

      // Extract data using regex
      const extractedInfo = {
        certificateNo:
          cleanText.match(patterns.certificateNo)?.[1] || "Not Found",
        fullName:
          cleanText.match(patterns.fullName)?.[1]?.trim() || "Not Found",
        dob: {
          year: cleanText.match(patterns.dob)?.[1] || "Not Found",
          month: cleanText.match(patterns.dob)?.[2] || "Not Found",
          day: cleanText.match(patterns.dob)?.[3] || "Not Found",
        },
        birthPlace: {
          district:
            cleanText.match(patterns.birthPlace)?.[1]?.trim() || "Not Found",
          metropolitan:
            cleanText.match(patterns.birthPlace)?.[2]?.trim() || "Not Found",
        },
        permanentAddress: {
          district:
            cleanText.match(patterns.permanentAddress)?.[1]?.trim() ||
            "Not Found",
          metropolitan:
            cleanText.match(patterns.permanentAddress)?.[2]?.trim() ||
            "Not Found",
        },
      };
      console.log("Extracted Data:", extractedInfo);

      setExtractedInfo(extractedInfo);
      return extractedInfo;
    } catch (error) {
      console.error("OCR Failed:", error);
      setExtractedInfo({ error: "OCR process failed." });
      return { error: "OCR process failed." };
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5">Facial Recognition</Typography>
        <Typography variant="body1" mt={2}>
          Compare your live face with the uploaded document and extract details.
        </Typography>

        {cookies.uploadedFiles && cookies.uploadedFiles.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6">Document:</Typography>
            <Image
              src={cookies.uploadedFiles[0]}
              alt="Document"
              width={150}
              height={150}
              style={{
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Box>
        )}

        <Box mt={4}>
          <Button variant="contained" onClick={startWebcam}>
            Start Webcam
          </Button>
        </Box>

        <Box mt={4} position="relative">
          <video ref={videoRef} width="100%" autoPlay muted />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </Box>

        <Box mt={4}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleFaceComparison}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} /> : "Compare Face"}
          </Button>
        </Box>

        {matchStatus && (
          <Box mt={4}>
            <Typography
              variant="h6"
              color={matchStatus === "Matched" ? "success.main" : "error.main"}
            >
              {matchStatus}
            </Typography>
          </Box>
        )}

        {extractedInfo && (
          <Box mt={4}>
            <Typography variant="h6">Extracted Information:</Typography>
            <Typography>
              Certificate No: {extractedInfo.certificateNo}
            </Typography>
            <Typography>Full Name: {extractedInfo.fullName}</Typography>
            <Typography>
              Date of Birth: {extractedInfo?.dob?.year}-
              {extractedInfo.dob.month}-{extractedInfo.dob.day}
            </Typography>
            <Typography>
              Birth Place: {extractedInfo.birthPlace.district},{" "}
              {extractedInfo.birthPlace.metropolitan}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FacialRecognition;

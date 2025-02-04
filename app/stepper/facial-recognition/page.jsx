"use client";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import * as faceapi from "face-api.js";
import Tesseract from "tesseract.js";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Image from "next/image";

const FacialRecognition = () => {
  const [cookies, setCookie] = useCookies(["uploadedFiles", "extractedInfo"]);
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

      // Clean the text by removing unwanted characters and whitespace
      const cleanText = extractedText
        .replace(/[^A-Za-z0-9\s:.,-]/g, " ") // Keep commas and hyphens for address parsing
        .replace(/\s+/g, " ") // Remove extra spaces
        .trim(); // Trim leading/trailing spaces

      console.log("Cleaned Text:", cleanText);

      // Regex patterns to extract data
      const patterns = {
        citizenshipNumber: /\b\d{2}-\d{2}-\d{2}-\d{5}\b/,
        fullName:
          /Full\s*Name\s*[:\.\s]*([A-Z\s]+)(?=\s*(Date\s*of\s*Birth|$))/i, // Full Name

        wardNumber: /Ward\s*Ne\.?\s*[:\s]*(\d{1,2})/i,
        sex: /Sex:\s*(Male|Female)/,
        dobYear: /Year:\s*(\d{4})/,
        dobMonth: /Month:\s*(\w{3})/,
        dobDay: /Day:\s*(\d{1,2})/,
        birthPlace: /Birth Place:\s*District:\s*([A-Za-z\s]+)/,
        permanentAddress: /Permanent Address:\s*District:\s*([A-Za-z\s]+)/,
      };

      // Extracting data using regex
      const extractedInfo = {
        citizenshipNumber: cleanText.match(patterns.citizenshipNumber)
          ? cleanText.match(patterns.citizenshipNumber)[0]
          : "Not Available",
        fullName: cleanText.match(patterns.fullName)
          ? cleanText.match(patterns.fullName)[1]
          : "Not Available",
        sex: cleanText.match(patterns.sex)
          ? cleanText.match(patterns.sex)[1]
          : "Not Available",
        dob: {
          year: cleanText.match(patterns.dobYear)
            ? cleanText.match(patterns.dobYear)[1]
            : "Not Available",
          month: cleanText.match(patterns.dobMonth)
            ? cleanText.match(patterns.dobMonth)[1]
            : "Not Available",
          day: cleanText.match(patterns.dobDay)
            ? cleanText.match(patterns.dobDay)[1]
            : "Not Available",
        },
        wardNumber: cleanText.match(patterns.wardNumber)
          ? cleanText.match(patterns.wardNumber)[1]
          : "Not Available",
        birthPlace: cleanText.match(patterns.birthPlace)
          ? cleanText.match(patterns.birthPlace)[1]
          : "Not Available",
        permanentAddress: cleanText.match(patterns.permanentAddress)
          ? cleanText.match(patterns.permanentAddress)[1]
          : "Not Available",
      };
      console.log("Extracted Data:", extractedInfo);

      setExtractedInfo(extractedInfo);
      setCookie("extractedInfo", extractedInfo, { path: "/" });
      return extractedInfo;
    } catch (error) {
      console.error("OCR Failed:", error);
      setExtractedInfo({ error: "OCR process failed." });
      return { error: "OCR process failed." };
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Facial Recognition and Document Verification
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={4}>
          Compare your live face with the uploaded document and extract personal
          information.
        </Typography>

        {cookies.uploadedFiles && cookies.uploadedFiles.length > 0 && (
          <Box mb={4} sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6">Uploaded Document</Typography>
              <Image
                src={cookies.uploadedFiles[0]}
                alt="Uploaded Document"
                width={200}
                height={200}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Box>
          </Box>
        )}

        <Box mb={4}>
          <Button variant="contained" onClick={startWebcam}>
            Start Webcam
          </Button>
        </Box>

        <Box
          mb={4}
          sx={{ position: "relative", width: "100%", height: "auto" }}
        >
          <video ref={videoRef} width="100%" height="auto" autoPlay muted />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
            }}
          />
        </Box>

        <Box mb={4}>
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
          <Box mb={4}>
            <Typography
              variant="h6"
              color={matchStatus === "Matched" ? "success.main" : "error.main"}
              sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {matchStatus}
            </Typography>
          </Box>
        )}

        {extractedInfo && (
          <Box mb={4}>
            <Typography variant="h6">Extracted Information:</Typography>
            {extractedInfo.error ? (
              <Alert severity="error">{extractedInfo.error}</Alert>
            ) : (
              <>
                <Typography>
                  Certificate No: {extractedInfo.citizenshipNumber}
                </Typography>
                <Typography>Full Name: {extractedInfo.fullName}</Typography>
                <Typography>
                  Date of Birth: {extractedInfo.dob.year}-
                  {extractedInfo.dob.month}-{extractedInfo.dob.day}
                </Typography>
                <Typography>Birth Place: {extractedInfo.birthPlace}</Typography>
                <Typography>
                  Permanent Address: {extractedInfo.permanentAddress}
                </Typography>
                <Typography>Ward Number: {extractedInfo.wardNumber}</Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FacialRecognition;

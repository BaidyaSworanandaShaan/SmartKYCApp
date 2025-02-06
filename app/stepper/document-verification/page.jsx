"use client";
import StepperHeader from "@/components/StepperHeader";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import {
  TextField,
  Grid,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";

const DocumentVerification = () => {
  const [cookies, setCookies] = useCookies(["extractedInfo"]);
  const [editableInfo, setEditableInfo] = useState(cookies.extractedInfo || {});

  if (!cookies.extractedInfo) {
    return <div>No extracted info found.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle the 'dob' field separately since it's a nested object
    if (name === "year" || name === "month" || name === "day") {
      setEditableInfo((prevInfo) => {
        const updatedInfo = {
          ...prevInfo,
          dob: {
            ...prevInfo.dob,
            [name]: value, // Update the respective field in the dob object
          },
        };
        setCookies("extractedInfo", updatedInfo); // Update cookies after state
        return updatedInfo;
      });
    }
    // Handle birthPlace and permanentAddress fields separately
    else if (name === "birthPlace" || name === "permanentAddress") {
      setEditableInfo((prevInfo) => {
        const updatedInfo = {
          ...prevInfo,
          [name]: {
            ...prevInfo[name],
            district: value, // Update the district value
          },
        };
        setCookies("extractedInfo", updatedInfo); // Update cookies after state
        return updatedInfo;
      });
    } else {
      // Handle other fields
      setEditableInfo((prevInfo) => {
        const updatedInfo = {
          ...prevInfo,
          [name]: value,
        };
        setCookies("extractedInfo", updatedInfo); // Update cookies after state
        return updatedInfo;
      });
    }
  };

  console.log(cookies.extractedInfo);

  return (
    <div>
      <StepperHeader
        title="Verify Your Citizenship Document"
        subTitle="Double-check the extracted information for accuracy before proceeding with secure storage."
      />
      <Typography className="title">Extracted Information:</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Certificate No"
            variant="outlined"
            fullWidth
            name="citizenshipNumber"
            value={editableInfo.citizenshipNumber || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            name="fullName"
            value={editableInfo.fullName || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              name="gender"
              value={editableInfo.sex || ""}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Year of Birth"
            variant="outlined"
            fullWidth
            name="year"
            value={editableInfo.dob?.year || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Month of Birth"
            variant="outlined"
            fullWidth
            name="month"
            value={editableInfo.dob?.month || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Day of Birth"
            variant="outlined"
            fullWidth
            name="day"
            value={editableInfo.dob?.day || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Birth Place"
            variant="outlined"
            fullWidth
            name="birthPlace"
            value={editableInfo.birthPlace?.district || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Permanent Address"
            variant="outlined"
            fullWidth
            name="permanentAddress"
            value={editableInfo.permanentAddress?.district || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Ward Number"
            variant="outlined"
            fullWidth
            name="wardNumber"
            value={editableInfo.wardNumber || ""}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      {/* <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box> */}
    </div>
  );
};

export default DocumentVerification;

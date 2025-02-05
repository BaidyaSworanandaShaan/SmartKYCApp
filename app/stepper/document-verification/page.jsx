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
} from "@mui/material";

const DocumentVerification = () => {
  const [cookies] = useCookies(["extractedInfo"]);
  const [editableInfo, setEditableInfo] = useState(cookies.extractedInfo || {});

  if (!cookies.extractedInfo) {
    return <div>No extracted info found.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Handle saving logic here, for example, updating cookies or sending data to backend
    console.log("Saved Data:", editableInfo);
  };

  return (
    <div>
      <StepperHeader
        title="Document Verification"
        subTitle="Verifying your document against your facial recognition data. Please wait while we extract and validate the information using OCR technology."
      />
      <h3>Extracted Information:</h3>
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
            value={editableInfo.birthPlace || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Permanent Address"
            variant="outlined"
            fullWidth
            name="permanentAddress"
            value={editableInfo.permanentAddress || ""}
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

import StepperHeader from "@/components/StepperHeader";
import React from "react";

const DocumentVerification = () => {
  return (
    <div>
      <StepperHeader
        title="Document Verification"
        subTitle="Verifying your document against your facial recognition data. Please wait while we extract and validate the information using OCR technology."
      />
    </div>
  );
};

export default DocumentVerification;

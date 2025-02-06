import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../(auth)/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client"; // Prisma Client for DB access
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { decryptData } from "@/lib/encryption"; // Import your decryption function
import Image from "next/image";

const prisma = new PrismaClient();

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <CircularProgress />;
  }

  // Fetch the citizenship record from the database
  let citizenshipData = await prisma.citizenshipInfo.findUnique({
    where: { userId: session.user.id },
  });

  if (citizenshipData) {
    citizenshipData.certificateNumber = decryptData(
      citizenshipData.certificateNumber
    );
    citizenshipData.fullName = decryptData(citizenshipData.fullName);
    citizenshipData.gender = decryptData(citizenshipData.gender);
    citizenshipData.dob = decryptData(citizenshipData.dob);
    citizenshipData.birthplace = decryptData(citizenshipData.birthplace);
    citizenshipData.permanentAddress = decryptData(
      citizenshipData.permanentAddress
    );
    citizenshipData.wardNumber = decryptData(citizenshipData.wardNumber);
  }

  return (
    <div>
      <Navbar />
      <Container sx={{ marginTop: "150px" }}>
        <Typography variant="h3" gutterBottom>
          Welcome to your Dashboard, {session?.user?.name || "User"}! 🎉
        </Typography>

        {!citizenshipData ? (
          <Typography
            variant="h6"
            paragraph
            sx={{ lineHeight: "1.7", marginBottom: "20px" }}
          >
            To enhance your security and streamline your verification process,
            you'll need to verify your citizen data for Know Your Customer (KYC)
            purposes. <strong>Let's get started!</strong>
          </Typography>
        ) : (
          <div>
            <Typography variant="h6" paragraph>
              Your verification data is successfully processed:
            </Typography>
            <Table sx={{ marginTop: "20px" }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Field</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Value</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Certificate Number</TableCell>
                  <TableCell>{citizenshipData.certificateNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>{citizenshipData.fullName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gender</TableCell>
                  <TableCell>{citizenshipData.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>{citizenshipData.dob}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Birthplace</TableCell>
                  <TableCell>{citizenshipData.birthplace}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Permanent Address</TableCell>
                  <TableCell>{citizenshipData.permanentAddress}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ward Number</TableCell>
                  <TableCell>{citizenshipData.wardNumber}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Display the Image */}
            {citizenshipData.image && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Typography variant="h6">Citizenship Image</Typography>
                <Image
                  width={200}
                  height={200}
                  src={citizenshipData.image}
                  alt="Citizenship Document"
                />
              </div>
            )}
          </div>
        )}

        {!citizenshipData && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/stepper"
            className="btn-primary"
          >
            ✅ Proceed to Verification
          </Button>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;

import { PrismaClient } from "@prisma/client";
import { decryptData } from "../../lib/encryption";
import { getSession } from "next-auth/react"; // Use NextAuth for authentication

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Authenticate the user
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { userId } = req.query;

    // Fetch encrypted citizenship data
    const citizenshipInfo = await prisma.citizenshipInfo.findUnique({
      where: { userId: Number(userId) },
    });

    if (!citizenshipInfo) {
      return res.status(404).json({ message: "No data found" });
    }

    // Decrypt the data before sending it to frontend
    const decryptedData = {
      certificateNumber: decryptData(citizenshipInfo.certificateNumber),
      fullName: decryptData(citizenshipInfo.fullName),
      gender: decryptData(citizenshipInfo.gender),
      dob: decryptData(citizenshipInfo.dob),
      birthplace: decryptData(citizenshipInfo.birthplace),
      permanentAddress: decryptData(citizenshipInfo.permanentAddress),
      wardNumber: decryptData(citizenshipInfo.wardNumber),
      frontImg: decryptData(citizenshipInfo.frontImg),
      backImg: decryptData(citizenshipInfo.backImg),
      userImg: decryptData(citizenshipInfo.userImg),
    };

    return res.status(200).json({
      message: "Decrypted Data Retrieved",
      data: decryptedData,
    });
  } catch (error) {
    console.error("Error retrieving decrypted data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

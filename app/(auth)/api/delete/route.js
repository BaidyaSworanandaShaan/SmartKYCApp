import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../(auth)/[...nextauth]/route";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user has a citizenship record
    const citizenshipData = await prisma.citizenshipInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!citizenshipData) {
      return NextResponse.json(
        { error: "Citizenship record not found" },
        { status: 404 }
      );
    }

    // Delete the citizenship record
    await prisma.citizenshipInfo.delete({
      where: { userId: session.user.id },
    });

    return NextResponse.json(
      { message: "Citizenship record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting citizenship record:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { seedDatabase } from "@/utils/seedData";

// API route to seed the database with sample data
export async function GET() {
  try {
    const result = await seedDatabase();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Database seeded successfully!",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to seed database",
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in seed API route:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error,
      },
      { status: 500 }
    );
  }
}

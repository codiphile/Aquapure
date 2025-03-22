import { db } from "./db/db";
import {
  Users,
  Reports,
  Rewards,
  CollectedWastes,
  Notifications,
  Transactions,
} from "./db/schema";

/**
 * Seed function to populate the database with sample data for the water conservation app
 */
export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Create sample users
    const users = await db
      .insert(Users)
      .values([
        {
          clerkId: "user_sample1",
          email: "john.doe@example.com",
          name: "John Doe",
          imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
          updatedAt: new Date(),
        },
        {
          clerkId: "user_sample2",
          email: "jane.smith@example.com",
          name: "Jane Smith",
          imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
          updatedAt: new Date(),
        },
        {
          clerkId: "user_sample3",
          email: "alex.wilson@example.com",
          name: "Alex Wilson",
          imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
          updatedAt: new Date(),
        },
      ])
      .returning();

    console.log("Sample users created:", users.length);

    // Create sample water issue reports
    const reports = await db
      .insert(Reports)
      .values([
        {
          userId: users[0].id,
          location: "Lake Ontario - Woodbine Beach",
          waterIssueType: "Algae Bloom",
          severity: "High",
          imageUrl:
            "https://images.unsplash.com/photo-1590438150212-09ee15cb60e5?auto=format&fit=crop&q=80",
          status: "pending",
          verificationResult: {
            analysis:
              "Significant algae bloom detected at Woodbine Beach. The water has a distinct green coloration and clumping algae is visible. Severity rated 8/10 due to extent of coverage. This likely indicates high nutrient levels in the water, possibly from agricultural runoff or sewage overflow. Water testing recommended to check for cyanobacteria toxins.",
            coordinates: { lat: 43.66543, lng: -79.31554 },
          },
        },
        {
          userId: users[1].id,
          location: "Don River - Riverdale Park",
          waterIssueType: "Pollution",
          severity: "Medium",
          imageUrl:
            "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80",
          status: "in_progress",
          collectorId: users[2].id,
          verificationResult: {
            analysis:
              "Visible pollution in the Don River at Riverdale Park. The water has a cloudy appearance with some visible plastic waste and debris. Severity rated 6/10. This may be from recent stormwater runoff carrying street pollution into the river. Cleanup and source tracking recommended.",
            coordinates: { lat: 43.67245, lng: -79.35844 },
          },
        },
        {
          userId: users[2].id,
          location: "Humber River - Étienne Brûlé Park",
          waterIssueType: "Oil Spill",
          severity: "High",
          imageUrl:
            "https://images.unsplash.com/photo-1611273426858-450e7b08dd84?auto=format&fit=crop&q=80",
          status: "pending",
          verificationResult: {
            analysis:
              "Small oil spill detected at Étienne Brûlé Park section of the Humber River. Rainbow sheen visible on water surface. Severity rated 7/10 due to potential wildlife impact. Likely from a vehicle leakage or improper disposal of oil products upstream. Containment measures recommended immediately.",
            coordinates: { lat: 43.65412, lng: -79.49399 },
          },
        },
        {
          userId: users[0].id,
          location: "Rouge River - Glen Rouge Campground",
          waterIssueType: "Sewage",
          severity: "High",
          imageUrl:
            "https://images.unsplash.com/photo-1591325885829-bdd86bcd2ac4?auto=format&fit=crop&q=80",
          status: "resolved",
          collectorId: users[1].id,
          verificationResult: {
            analysis:
              "Potential sewage overflow at Glen Rouge Campground section of Rouge River. Strong odor and cloudy water with suspended solids. Severity rated 9/10 due to health hazards. This appears to be from a sewage system failure, possibly related to recent heavy rainfall. Immediate water testing and repair of infrastructure needed.",
            coordinates: { lat: 43.80553, lng: -79.15479 },
          },
        },
        {
          userId: users[1].id,
          location: "Grenadier Pond - High Park",
          waterIssueType: "Unusual Odor",
          severity: "Medium",
          imageUrl:
            "https://images.unsplash.com/photo-1612703391462-73ae0df6cad4?auto=format&fit=crop&q=80",
          status: "pending",
          verificationResult: {
            analysis:
              "Unusual sulfur-like odor reported at Grenadier Pond in High Park. Water appears normal visually but strong smell is present. Severity rated 5/10. This may indicate organic matter decomposition or potential bacterial activity. Water sampling recommended to test for hydrogen sulfide and bacterial levels.",
            coordinates: { lat: 43.64678, lng: -79.46339 },
          },
        },
      ])
      .returning();

    console.log("Sample reports created:", reports.length);

    // Create rewards for users
    await db.insert(Rewards).values([
      {
        userId: users[0].id,
        points: 35,
        level: 2,
        name: "Water Guardian",
        collectionInfo: "Rewards for reporting and resolving water issues",
        description:
          "Level 2 guardian with special access to conservation events",
      },
      {
        userId: users[1].id,
        points: 65,
        level: 3,
        name: "Water Protector",
        collectionInfo: "Elite rewards for outstanding conservation efforts",
        description: "Level 3 protector with access to educational workshops",
      },
      {
        userId: users[2].id,
        points: 20,
        level: 1,
        name: "Water Scout",
        collectionInfo: "Beginner rewards for new conservation participants",
        description: "Level 1 scout with basic rewards and recognition",
      },
    ]);

    console.log("Sample rewards created");

    // Create collected issues records for the "resolved" report
    await db.insert(CollectedWastes).values([
      {
        reportId: reports[3].id, // The resolved sewage issue
        collectorId: users[1].id,
        collectionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: "resolved",
      },
    ]);

    console.log("Sample resolved issues created");

    // Create notifications for users
    await db.insert(Notifications).values([
      {
        userId: users[0].id,
        message:
          "Your water issue report at Lake Ontario - Woodbine Beach has been received.",
        type: "info",
        isRead: true,
      },
      {
        userId: users[0].id,
        message: "You've earned 10 points for reporting a water issue!",
        type: "reward",
        isRead: false,
      },
      {
        userId: users[1].id,
        message:
          "Good news! A water conservation specialist is addressing your reported issue at Don River.",
        type: "status_update",
        isRead: false,
      },
      {
        userId: users[1].id,
        message:
          "Your water issue at Rouge River has been successfully resolved. Thank you!",
        type: "success",
        isRead: false,
      },
      {
        userId: users[2].id,
        message:
          "New water issue reported in your area at Humber River - Étienne Brûlé Park",
        type: "alert",
        isRead: false,
      },
    ]);

    console.log("Sample notifications created");

    // Create transactions for rewards
    await db.insert(Transactions).values([
      {
        userId: users[0].id,
        type: "earned_report",
        amount: 20,
        description: "Points earned for reporting water issues",
      },
      {
        userId: users[0].id,
        type: "earned_collect",
        amount: 15,
        description: "Points earned for resolving water issues",
      },
      {
        userId: users[1].id,
        type: "earned_report",
        amount: 30,
        description: "Points earned for reporting water issues",
      },
      {
        userId: users[1].id,
        type: "earned_collect",
        amount: 40,
        description: "Points earned for resolving water issues",
      },
      {
        userId: users[1].id,
        type: "redeemed",
        amount: 5,
        description: "Redeemed points for conservation event ticket",
      },
      {
        userId: users[2].id,
        type: "earned_report",
        amount: 20,
        description: "Points earned for reporting water issues",
      },
    ]);

    console.log("Sample transactions created");

    console.log("Database seeding completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error };
  }
}

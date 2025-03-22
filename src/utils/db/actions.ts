import { eq, sql, and, desc, ne } from "drizzle-orm";
import {
  Users,
  Reports,
  Rewards,
  CollectedWastes,
  Notifications,
  Transactions,
} from "./schema";
import { db } from "./db";

// User actions
export async function getUserByEmail(email: string) {
  try {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .execute();
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkId, clerkId))
      .execute();
    return user;
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    return null;
  }
}

export async function createUser(
  email: string,
  name: string,
  clerkId?: string,
  imageUrl?: string
) {
  try {
    // Check if user already exists with this email
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      // If user exists but doesn't have a clerkId, update it
      if (clerkId && !existingUser.clerkId) {
        const [updatedUser] = await db
          .update(Users)
          .set({
            clerkId,
            imageUrl,
            updatedAt: new Date(),
          })
          .where(eq(Users.id, existingUser.id))
          .returning()
          .execute();
        return updatedUser;
      }
      return existingUser;
    }

    // Create new user
    const [user] = await db
      .insert(Users)
      .values({
        email,
        name,
        clerkId: clerkId || "",
        imageUrl: imageUrl || "",
        updatedAt: new Date(),
      })
      .returning()
      .execute();

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export const createReport = async (reportData: {
  userId: string;
  location: string;
  description: string;
  waterIssueType: string;
  severity: string;
  coordinates: string;
  imageUrl: string;
  verificationResult: string;
}) => {
  try {
    // Implementation goes here...
    console.log("Creating report with data:", reportData);
    // Return some mock data for now
    return {
      id: Math.floor(Math.random() * 1000),
      ...reportData,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};

export async function getReportsByUserId(userId: number) {
  try {
    const reports = await db
      .select()
      .from(Reports)
      .where(eq(Reports.userId, userId))
      .execute();
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function getOrCreateReward(userId: number) {
  try {
    let [reward] = await db
      .select()
      .from(Rewards)
      .where(eq(Rewards.userId, userId))
      .execute();
    if (!reward) {
      [reward] = await db
        .insert(Rewards)
        .values({
          userId,
          name: "Default Reward",
          collectionInfo: "Default Collection Info",
          points: 0,
          level: 1,
          isAvailable: true,
        })
        .returning()
        .execute();
    }
    return reward;
  } catch (error) {
    console.error("Error getting or creating reward:", error);
    return null;
  }
}

export async function updateRewardPoints(userId: number, pointsToAdd: number) {
  try {
    const [updatedReward] = await db
      .update(Rewards)
      .set({
        points: sql`${Rewards.points} + ${pointsToAdd}`,
        updatedAt: new Date(),
      })
      .where(eq(Rewards.userId, userId))
      .returning()
      .execute();
    return updatedReward;
  } catch (error) {
    console.error("Error updating reward points:", error);
    return null;
  }
}

export async function createCollectedIssue(
  reportId: number,
  collectorId: number,
  notes?: string
) {
  try {
    // First update the report status
    await db
      .update(Reports)
      .set({ status: "in_progress", collectorId })
      .where(eq(Reports.id, reportId))
      .execute();

    const [collectedIssue] = await db
      .insert(CollectedWastes)
      .values({
        reportId,
        collectorId,
        collectionDate: new Date(),
      })
      .returning()
      .execute();

    return collectedIssue;
  } catch (error) {
    console.error("Error creating collected issue record:", error);
    return null;
  }
}

export async function getCollectedIssuesByCollector(collectorId: number) {
  try {
    return await db
      .select()
      .from(CollectedWastes)
      .where(eq(CollectedWastes.collectorId, collectorId))
      .execute();
  } catch (error) {
    console.error("Error fetching collected issues:", error);
    return [];
  }
}

export async function createNotification(
  userId: number,
  message: string,
  type: string
) {
  try {
    const [notification] = await db
      .insert(Notifications)
      .values({ userId, message, type })
      .returning()
      .execute();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

export async function getUnreadNotifications(userId: number) {
  try {
    return await db
      .select()
      .from(Notifications)
      .where(
        and(eq(Notifications.userId, userId), eq(Notifications.isRead, false))
      )
      .execute();
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: number) {
  try {
    await db
      .update(Notifications)
      .set({ isRead: true })
      .where(eq(Notifications.id, notificationId))
      .execute();
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

export async function getPendingReports() {
  try {
    return await db
      .select()
      .from(Reports)
      .where(eq(Reports.status, "pending"))
      .execute();
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    return [];
  }
}

export async function updateReportStatus(reportId: number, status: string) {
  try {
    await db
      .update(Reports)
      .set({ status })
      .where(eq(Reports.id, reportId))
      .execute();
  } catch (error) {
    console.error("Error updating report status:", error);
  }
}

export async function getRecentReports(limit: number = 10) {
  try {
    return await db
      .select()
      .from(Reports)
      .orderBy(desc(Reports.createdAt))
      .limit(limit)
      .execute();
  } catch (error) {
    console.error("Error fetching recent reports:", error);
    return [];
  }
}

export async function getWaterIssueCollectionTasks(limit: number = 20) {
  try {
    const tasks = await db
      .select({
        id: Reports.id,
        location: Reports.location,
        waterIssueType: Reports.waterIssueType,
        severity: Reports.severity,
        reporterId: Reports.userId,
        createdAt: Reports.createdAt,
        status: Reports.status,
        reporterName: Users.name,
        reporterImage: Users.imageUrl,
      })
      .from(Reports)
      .innerJoin(Users, eq(Reports.userId, Users.id))
      .where(
        and(
          ne(Reports.status, "resolved"),
          sql`${Reports.collectorId} IS NULL` // Not assigned yet
        )
      )
      .orderBy(desc(Reports.createdAt))
      .limit(limit)
      .execute();

    return tasks;
  } catch (error) {
    console.error("Error fetching collection tasks:", error);
    return [];
  }
}

export async function saveCollectedIssue(
  reportId: number,
  collectorId: number,
  verificationResult: any
) {
  try {
    // First update the report
    await db
      .update(Reports)
      .set({
        status: "resolved",
        collectorId,
        verificationResult,
      })
      .where(eq(Reports.id, reportId))
      .execute();

    // Award points to collector
    const pointsEarned = 20;
    await updateRewardPoints(collectorId, pointsEarned);

    // Create a transaction for the earned points
    await createTransaction(
      collectorId,
      "earned_collect",
      pointsEarned,
      "Points earned for resolving water issue"
    );

    // Create a notification for the user
    await createNotification(
      collectorId,
      `You've earned ${pointsEarned} points for resolving water issue!`,
      "reward"
    );

    // Create collected issue record
    const [collectedIssue] = await db
      .insert(CollectedWastes)
      .values({
        reportId,
        collectorId,
        collectionDate: new Date(),
        status: "resolved",
      })
      .returning()
      .execute();

    return collectedIssue;
  } catch (error) {
    console.error("Error saving collected issue record:", error);
    return null;
  }
}

export async function saveReward(userId: number, amount: number) {
  try {
    const [reward] = await db
      .insert(Rewards)
      .values({
        userId,
        name: "Waste Collection Reward",
        collectionInfo: "Points earned from waste collection",
        points: amount,
        level: 1,
        isAvailable: true,
      })
      .returning()
      .execute();

    // Create a transaction for this reward
    await createTransaction(
      userId,
      "earned_collect",
      amount,
      "Points earned for collecting waste"
    );

    return reward;
  } catch (error) {
    console.error("Error saving reward:", error);
    throw error;
  }
}

export async function updateTaskStatus(
  reportId: number,
  newStatus: string,
  collectorId?: number
) {
  try {
    // If status is set to "in_progress", assign collector
    if (newStatus === "in_progress" && collectorId) {
      await db
        .update(Reports)
        .set({
          status: newStatus,
          collectorId,
        })
        .where(eq(Reports.id, reportId))
        .execute();

      // Notify the reporter that their issue is being addressed
      const report = await db
        .select({ userId: Reports.userId })
        .from(Reports)
        .where(eq(Reports.id, reportId))
        .execute();

      if (report && report.length > 0) {
        await createNotification(
          report[0].userId,
          "Good news! A water conservation specialist is addressing your reported issue.",
          "status_update"
        );
      }
    } else {
      await db
        .update(Reports)
        .set({ status: newStatus })
        .where(eq(Reports.id, reportId))
        .execute();
    }
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}

export async function getAllRewards() {
  try {
    const rewards = await db
      .select({
        id: Rewards.id,
        userId: Rewards.userId,
        points: Rewards.points,
        level: Rewards.level,
        createdAt: Rewards.createdAt,
        userName: Users.name,
      })
      .from(Rewards)
      .leftJoin(Users, eq(Rewards.userId, Users.id))
      .orderBy(desc(Rewards.points))
      .execute();

    return rewards;
  } catch (error) {
    console.error("Error fetching all rewards:", error);
    return [];
  }
}

export async function getRewardTransactions(userId: number) {
  try {
    // Get all reward transactions for the user
    const transactions = await db
      .select({
        id: Transactions.id,
        type: Transactions.type,
        amount: Transactions.amount,
        description: Transactions.description,
        date: Transactions.date,
      })
      .from(Transactions)
      .where(eq(Transactions.userId, userId))
      .orderBy(desc(Transactions.date))
      .execute();

    return transactions.map((transaction) => ({
      ...transaction,
      date: transaction.date.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching reward transactions:", error);
    return [];
  }
}

export async function getAvailableRewards(userId: number) {
  try {
    console.log("Fetching available rewards for user:", userId);

    // Get user's total points
    const userTransactions = await getRewardTransactions(userId);
    const userPoints = userTransactions.reduce((total, transaction) => {
      return transaction.type.startsWith("earned")
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);

    console.log("User total points:", userPoints);

    // Get available rewards from the database
    const dbRewards = await db
      .select({
        id: Rewards.id,
        name: Rewards.name,
        cost: Rewards.points,
        description: Rewards.description,
        collectionInfo: Rewards.collectionInfo,
      })
      .from(Rewards)
      .where(eq(Rewards.isAvailable, true))
      .execute();

    console.log("Rewards from database:", dbRewards);

    // Combine user points and database rewards
    const allRewards = [
      {
        id: 0, // Use a special ID for user's points
        name: "Your Points",
        cost: userPoints,
        description: "Redeem your earned points",
        collectionInfo: "Points earned from reporting and collecting waste",
      },
      ...dbRewards,
    ];

    console.log("All available rewards:", allRewards);
    return allRewards;
  } catch (error) {
    console.error("Error fetching available rewards:", error);
    return [];
  }
}

export async function createTransaction(
  userId: number,
  type: "earned_report" | "earned_collect" | "redeemed",
  amount: number,
  description: string
) {
  try {
    const [transaction] = await db
      .insert(Transactions)
      .values({ userId, type, amount, description })
      .returning()
      .execute();
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return null;
  }
}

export async function redeemReward(userId: number, rewardId: number) {
  try {
    const userReward = (await getOrCreateReward(userId)) as any;

    if (rewardId === 0) {
      // Redeem all points
      const [updatedReward] = await db
        .update(Rewards)
        .set({
          points: 0,
          updatedAt: new Date(),
        })
        .where(eq(Rewards.userId, userId))
        .returning()
        .execute();

      // Create a transaction for this redemption
      await createTransaction(
        userId,
        "redeemed",
        userReward.points,
        `Redeemed all points: ${userReward.points}`
      );

      return updatedReward;
    } else {
      // Existing logic for redeeming specific rewards
      const availableReward = await db
        .select()
        .from(Rewards)
        .where(eq(Rewards.id, rewardId))
        .execute();

      if (
        !userReward ||
        !availableReward[0] ||
        userReward.points < availableReward[0].points
      ) {
        throw new Error("Insufficient points or invalid reward");
      }

      const [updatedReward] = await db
        .update(Rewards)
        .set({
          points: sql`${Rewards.points} - ${availableReward[0].points}`,
          updatedAt: new Date(),
        })
        .where(eq(Rewards.userId, userId))
        .returning()
        .execute();

      // Create a transaction for this redemption
      await createTransaction(
        userId,
        "redeemed",
        availableReward[0].points,
        `Redeemed: ${availableReward[0].name}`
      );

      return updatedReward;
    }
  } catch (error) {
    console.error("Error redeeming reward:", error);
    throw error;
  }
}

export async function getUserBalance(userId: number): Promise<number> {
  try {
    // Get all transactions for the user
    const transactions = await getRewardTransactions(userId);

    // Calculate the balance by summing up all transaction amounts
    const balance = transactions.reduce((total, transaction) => {
      return transaction.type.startsWith("earned")
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);

    return Math.max(balance, 0); // Ensure balance is not negative
  } catch (error) {
    console.error("Error calculating user balance:", error);
    return 0;
  }
}

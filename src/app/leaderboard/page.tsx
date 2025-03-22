"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Medal, Trophy, User, Award, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

type LeaderboardUser = {
  id: number;
  name: string;
  imageUrl: string | null;
  points: number;
  rank: number;
  isCurrentUser: boolean;
};

export default function LeaderboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<
    "week" | "month" | "all"
  >("month");

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to access this page");
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // In a real app, you would fetch from your API/database based on the selected period
        // For now, we'll simulate with dummy data

        // Generate some random users
        const dummyUsers: LeaderboardUser[] = Array.from(
          { length: 20 },
          (_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
            imageUrl: `https://i.pravatar.cc/150?u=${i + 1}`,
            points: Math.floor(Math.random() * 1000) + 100,
            rank: 0, // Will be calculated
            isCurrentUser: false, // Will be set for the current user
          })
        );

        // Sort by points (descending)
        dummyUsers.sort((a, b) => b.points - a.points);

        // Assign ranks
        dummyUsers.forEach((user, index) => {
          user.rank = index + 1;
        });

        // Mark current user if authenticated
        if (isAuthenticated && user) {
          // For demo purposes, randomly choose one of the top 10 users as the current user
          const randomIndex = Math.floor(Math.random() * 10);
          dummyUsers[randomIndex].name = user.name;
          dummyUsers[randomIndex].isCurrentUser = true;

          // Also add the current user to the bottom if they're not in the top ranks
          if (randomIndex > 5) {
            const currentUser = {
              id: user.id,
              name: user.name,
              imageUrl: user.imageUrl || null,
              points: dummyUsers[randomIndex].points,
              rank: dummyUsers[randomIndex].rank,
              isCurrentUser: true,
            };
            dummyUsers[randomIndex].isCurrentUser = false;
            setLeaderboard([...dummyUsers.slice(0, 10), currentUser]);
            return;
          }
        }

        // Take top 10 for display
        setLeaderboard(dummyUsers.slice(0, 10));
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        toast.error("Failed to load leaderboard data.");
      }
    };

    fetchLeaderboard();
  }, [isAuthenticated, user, leaderboardPeriod]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader className="animate-spin h-8 w-8 text-sky-600 mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-indigo-900">
        Top Contributors
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 border border-indigo-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-indigo-800">
            Water Conservation Heroes
          </h2>

          <div className="flex space-x-2">
            <Button
              variant={leaderboardPeriod === "week" ? "default" : "outline"}
              onClick={() => setLeaderboardPeriod("week")}
              className={
                leaderboardPeriod === "week"
                  ? "bg-sky-500 hover:bg-sky-600"
                  : ""
              }
            >
              Weekly
            </Button>
            <Button
              variant={leaderboardPeriod === "month" ? "default" : "outline"}
              onClick={() => setLeaderboardPeriod("month")}
              className={
                leaderboardPeriod === "month"
                  ? "bg-sky-500 hover:bg-sky-600"
                  : ""
              }
            >
              Monthly
            </Button>
            <Button
              variant={leaderboardPeriod === "all" ? "default" : "outline"}
              onClick={() => setLeaderboardPeriod("all")}
              className={
                leaderboardPeriod === "all" ? "bg-sky-500 hover:bg-sky-600" : ""
              }
            >
              All Time
            </Button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="grid grid-cols-12 bg-indigo-50 p-4 rounded-t-lg font-medium text-indigo-600">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-7">Contributor</div>
            <div className="col-span-4 text-right">Impact Points</div>
          </div>

          <div className="divide-y divide-indigo-100">
            {leaderboard.map((leaderboardUser) => (
              <div
                key={leaderboardUser.id}
                className={`grid grid-cols-12 p-4 ${
                  leaderboardUser.isCurrentUser ? "bg-sky-50" : ""
                }`}
              >
                <div className="col-span-1 flex justify-center items-center">
                  {leaderboardUser.rank === 1 ? (
                    <Crown className="h-6 w-6 text-yellow-500" />
                  ) : leaderboardUser.rank === 2 ? (
                    <Medal className="h-6 w-6 text-gray-400" />
                  ) : leaderboardUser.rank === 3 ? (
                    <Medal className="h-6 w-6 text-amber-600" />
                  ) : (
                    <span className="text-indigo-400">
                      {leaderboardUser.rank}
                    </span>
                  )}
                </div>
                <div className="col-span-7 flex items-center">
                  {leaderboardUser.imageUrl ? (
                    <img
                      src={leaderboardUser.imageUrl}
                      alt={leaderboardUser.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-indigo-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-indigo-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-indigo-900">
                      {leaderboardUser.name}
                    </p>
                    {leaderboardUser.isCurrentUser && (
                      <span className="text-xs text-sky-600 font-semibold">
                        You
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-4 text-right flex items-center justify-end">
                  <span className="font-bold text-sky-600">
                    {leaderboardUser.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100">
        <h2 className="text-xl font-medium mb-4 text-indigo-800">
          How to Increase Your Impact
        </h2>
        <ul className="space-y-3 text-indigo-800">
          <li className="flex items-start">
            <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5">
              <span className="block h-4 w-4 text-center font-bold text-sky-600 text-xs">
                1
              </span>
            </div>
            <span>Report water sources that need attention</span>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5">
              <span className="block h-4 w-4 text-center font-bold text-sky-600 text-xs">
                2
              </span>
            </div>
            <span>Participate in water cleanup activities</span>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5">
              <span className="block h-4 w-4 text-center font-bold text-sky-600 text-xs">
                3
              </span>
            </div>
            <span>Document your conservation efforts with photos</span>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-0.5">
              <span className="block h-4 w-4 text-center font-bold text-sky-600 text-xs">
                4
              </span>
            </div>
            <span>
              Earn impact points and become a water conservation champion!
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

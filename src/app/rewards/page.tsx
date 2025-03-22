"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Gift, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

type Reward = {
  id: number;
  title: string;
  description: string;
  pointsRequired: number;
  imageUrl: string;
  redemptionCode?: string;
};

export default function RewardsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [redeemedRewards, setRedeemedRewards] = useState<number[]>([]);
  const [isRedeeming, setIsRedeeming] = useState<number | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to access this page");
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch rewards and user points
  useEffect(() => {
    const fetchRewardsAndUserData = async () => {
      try {
        // In a real app, you would fetch from your API/database
        // For now, we'll simulate with dummy data

        // Generate random points between 500-2000
        const points = Math.floor(Math.random() * 1500) + 500;
        setUserPoints(points);

        // Dummy rewards
        const dummyRewards: Reward[] = [
          {
            id: 1,
            title: "Water Conservation Certificate",
            description:
              "Receive an official certificate recognizing your contributions to water conservation efforts.",
            pointsRequired: 300,
            imageUrl:
              "https://images.unsplash.com/photo-1535913990033-7512e7be513f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNlcnRpZmljYXRlfGVufDB8fDB8fHww",
          },
          {
            id: 2,
            title: "Reusable Water Bottle",
            description:
              "Eco-friendly stainless steel water bottle with our program logo.",
            pointsRequired: 500,
            imageUrl:
              "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2F0ZXIlMjBib3R0bGV8ZW58MHx8MHx8fDA%3D",
          },
          {
            id: 3,
            title: "Plant a Tree in Your Name",
            description:
              "We'll plant a tree in a water-stressed region in your name.",
            pointsRequired: 750,
            imageUrl:
              "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJlZSUyMHBsYW50aW5nfGVufDB8fDB8fHww",
          },
          {
            id: 4,
            title: "Water Testing Kit",
            description:
              "Professional kit to test water quality in your local streams and lakes.",
            pointsRequired: 1000,
            imageUrl:
              "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2F0ZXIlMjB0ZXN0fGVufDB8fDB8fHww",
          },
          {
            id: 5,
            title: "Online Workshop Session",
            description:
              "Access to an exclusive online workshop about advanced water conservation techniques.",
            pointsRequired: 1200,
            imageUrl:
              "https://images.unsplash.com/photo-1609234656388-0ff363383899?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b25saW5lJTIwd29ya3Nob3B8ZW58MHx8MHx8fDA%3D",
          },
          {
            id: 6,
            title: "Conservation Organization Donation",
            description:
              "We'll donate $50 to a water conservation organization of your choice.",
            pointsRequired: 1800,
            imageUrl:
              "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9uYXRpb258ZW58MHx8MHx8fDA%3D",
          },
        ];

        setRewards(dummyRewards);

        // Random already redeemed rewards simulation
        if (isAuthenticated && user) {
          const redeemed = dummyRewards
            .filter((r) => r.pointsRequired < points / 2)
            .map((r) => r.id);
          setRedeemedRewards(redeemed);
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
        toast.error("Failed to load rewards data.");
      }
    };

    fetchRewardsAndUserData();
  }, [isAuthenticated, user]);

  const handleRedeemReward = async (rewardId: number) => {
    try {
      setIsRedeeming(rewardId);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reward = rewards.find((r) => r.id === rewardId);
      if (!reward) {
        throw new Error("Reward not found");
      }

      if (userPoints < reward.pointsRequired) {
        toast.error("You don't have enough points for this reward");
        setIsRedeeming(null);
        return;
      }

      // In a real app, you would call your API to redeem the reward
      // For now, we'll simulate success

      setRedeemedRewards((prev) => [...prev, rewardId]);
      setUserPoints((prev) => prev - reward.pointsRequired);
      toast.success(`Successfully redeemed: ${reward.title}`);

      setIsRedeeming(null);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error("Failed to redeem reward. Please try again.");
      setIsRedeeming(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader className="animate-spin h-8 w-8 text-sky-600 mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-indigo-900">
        Conservation Rewards
      </h1>

      <div className="bg-indigo-50 p-6 rounded-xl mb-8 border border-indigo-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-medium text-indigo-800">
              Your Impact Points
            </h2>
            <p className="text-4xl font-bold text-sky-600 mt-1">{userPoints}</p>
          </div>

          <div className="mt-4 md:mt-0">
            <p className="text-indigo-700 max-w-md">
              Thank you for your contributions to water conservation! Redeem
              your points for rewards that further our mission or enhance your
              conservation journey.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const isRedeemed = redeemedRewards.includes(reward.id);
          const canAfford = userPoints >= reward.pointsRequired;

          return (
            <div
              key={reward.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                isRedeemed
                  ? "border-indigo-300"
                  : canAfford
                  ? "border-sky-300"
                  : "border-gray-200"
              }`}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={reward.imageUrl}
                  alt={reward.title}
                  className="w-full h-full object-cover"
                />
                {isRedeemed && (
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
                    Redeemed
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-indigo-800">
                    {reward.title}
                  </h3>
                  <div className="flex items-center text-sm font-semibold text-sky-600">
                    <Gift className="w-4 h-4 mr-1" />
                    {reward.pointsRequired} pts
                  </div>
                </div>

                <p className="text-indigo-600 text-sm mb-4">
                  {reward.description}
                </p>

                <Button
                  onClick={() => !isRedeemed && handleRedeemReward(reward.id)}
                  className={`w-full ${
                    isRedeemed
                      ? "bg-indigo-100 text-indigo-500 hover:bg-indigo-100 cursor-default"
                      : canAfford
                      ? "bg-sky-500 hover:bg-sky-600"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                  }`}
                  disabled={isRedeemed || !canAfford || isRedeeming !== null}
                >
                  {isRedeeming === reward.id ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : isRedeemed ? (
                    "Redeemed"
                  ) : !canAfford ? (
                    "Not Enough Points"
                  ) : (
                    "Redeem Reward"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-white p-8 rounded-xl shadow-md border border-indigo-100">
        <h2 className="text-xl font-medium mb-4 text-indigo-800">
          How to Earn More Points
        </h2>
        <ul className="space-y-4">
          <li className="flex">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mr-3">
              <span className="text-sky-600 font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-medium text-indigo-800">
                Report Water Issues
              </h3>
              <p className="text-indigo-600 text-sm">
                Report water sources that need attention. Earn 50 points per
                verified report.
              </p>
            </div>
          </li>
          <li className="flex">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mr-3">
              <span className="text-sky-600 font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-medium text-indigo-800">
                Participate in Cleanup
              </h3>
              <p className="text-indigo-600 text-sm">
                Join organized cleanups or clean water sources on your own. Earn
                100 points per cleanup.
              </p>
            </div>
          </li>
          <li className="flex">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mr-3">
              <span className="text-sky-600 font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-medium text-indigo-800">
                Document Your Impact
              </h3>
              <p className="text-indigo-600 text-sm">
                Share before/after photos of your conservation work. Earn 75
                points per verified documentation.
              </p>
            </div>
          </li>
          <li className="flex">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mr-3">
              <span className="text-sky-600 font-semibold">4</span>
            </div>
            <div>
              <h3 className="font-medium text-indigo-800">Refer Friends</h3>
              <p className="text-indigo-600 text-sm">
                Invite friends to join our water conservation efforts. Earn 200
                points for each friend who joins.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

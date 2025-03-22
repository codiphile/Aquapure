"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Droplet, Database, Award, BarChart3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-5xl w-full text-center">
        <div
          className={`transition-all duration-1000 transform ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-sky-100 rounded-full">
              <Droplet className="h-14 w-14 text-sky-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-indigo-900">
            Water Conservation Initiative
          </h1>
          <p className="text-xl mb-12 text-indigo-700 max-w-2xl mx-auto">
            Join our community effort to protect and preserve water resources.
            Report issues, analyze water quality, and earn rewards for your
            contributions.
          </p>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-300 transform ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white p-8 rounded-2xl shadow-md border border-indigo-100 flex flex-col items-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Droplet className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-indigo-900">
              Report Water Issues
            </h2>
            <p className="text-indigo-600 text-center mb-6">
              Document and report water sources that need attention or appear
              contaminated.
            </p>
            <Link
              href={isAuthenticated ? "/report" : "/sign-in"}
              className="mt-auto"
            >
              <Button className="w-full bg-sky-500 hover:bg-sky-600">
                {isAuthenticated ? "Report Now" : "Sign In to Report"}
              </Button>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-indigo-100 flex flex-col items-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Database className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-indigo-900">
              Contribute to Conservation
            </h2>
            <p className="text-indigo-600 text-center mb-6">
              Help analyze reported water sources and contribute to conservation
              efforts.
            </p>
            <Link
              href={isAuthenticated ? "/collect" : "/sign-in"}
              className="mt-auto"
            >
              <Button className="w-full bg-sky-500 hover:bg-sky-600">
                {isAuthenticated ? "View Reports" : "Sign In to Help"}
              </Button>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-indigo-100 flex flex-col items-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-indigo-900">
              Earn Rewards
            </h2>
            <p className="text-indigo-600 text-center mb-6">
              Earn points and rewards for your contributions to water
              conservation.
            </p>
            <Link
              href={isAuthenticated ? "/rewards" : "/sign-in"}
              className="mt-auto"
            >
              <Button className="w-full bg-sky-500 hover:bg-sky-600">
                {isAuthenticated ? "View Rewards" : "Sign In to Earn"}
              </Button>
            </Link>
          </div>
        </div>

        <div
          className={`mt-16 transition-all duration-1000 delay-600 transform ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-indigo-900 p-8 md:p-12 rounded-3xl shadow-lg text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Join Our Community Impact
                </h2>
                <p className="text-white max-w-md mb-4">
                  Together, we can make a significant difference in preserving
                  and protecting water resources for future generations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-indigo-800 px-4 py-2 rounded-lg">
                    <span className="block text-2xl font-bold text-sky-300">
                      2,500+
                    </span>
                    <span className="text-sm text-white">
                      Reports Submitted
                    </span>
                  </div>
                  <div className="bg-indigo-800 px-4 py-2 rounded-lg">
                    <span className="block text-2xl font-bold text-sky-300">
                      500+
                    </span>
                    <span className="text-sm text-white">Issues Resolved</span>
                  </div>
                  <div className="bg-indigo-800 px-4 py-2 rounded-lg">
                    <span className="block text-2xl font-bold text-sky-300">
                      1,200+
                    </span>
                    <span className="text-sm text-white">
                      Active Contributors
                    </span>
                  </div>
                </div>
              </div>
              <Link href="/leaderboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-indigo-300 text-black hover:bg-indigo-800 hover:text-white"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Impact Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

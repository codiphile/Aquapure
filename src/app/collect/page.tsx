"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader, Droplet, Map, Image, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

type WaterReport = {
  id: string;
  createdAt: string;
  location: string;
  description: string;
  imageUrl: string;
  lat: number;
  lng: number;
  status: "reported" | "collecting" | "collected";
  userId: string;
  userName: string;
};

export default function CollectPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [collectingIds, setCollectingIds] = useState<Set<string>>(new Set());

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to access this page");
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch water reports that need attention
  useEffect(() => {
    const fetchReports = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsLoadingReports(true);
        // In a real app, you would fetch from your API/database
        // For now, we'll simulate with dummy data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const dummyReports: WaterReport[] = [
          {
            id: "1",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            location: "Lake Muskoka, Ontario",
            description:
              "Algae blooms visible near shore, water appears discolored.",
            imageUrl:
              "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWxnYWV8ZW58MHx8MHx8fDA%3D",
            lat: 44.9646,
            lng: -79.5112,
            status: "reported",
            userId: "user1",
            userName: "Sarah Johnson",
          },
          {
            id: "2",
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
            location: "Crystal River, Florida",
            description:
              "Unusual foam on water surface, possibly from detergents.",
            imageUrl:
              "https://images.unsplash.com/photo-1472586662442-3eec04b9dbda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cml2ZXIlMjBmb2FtfGVufDB8fDB8fHww",
            lat: 28.9036,
            lng: -82.579,
            status: "reported",
            userId: "user2",
            userName: "Michael Lee",
          },
          {
            id: "3",
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            location: "Emerald Lake, Yukon",
            description:
              "Unusual sediment after recent rainfall, normally clear water is now murky.",
            imageUrl:
              "https://images.unsplash.com/photo-1591448764514-f4a26907fdd4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxha2UlMjBtdXJreXxlbnwwfHwwfHx8MA%3D%3D",
            lat: 60.1886,
            lng: -134.9826,
            status: "reported",
            userId: "user3",
            userName: "Emma Wilson",
          },
          {
            id: "4",
            createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(), // 12 hours ago
            location: "Fraser River, British Columbia",
            description:
              "Oil slick visible on water surface, approximately 50 meters in length.",
            imageUrl:
              "https://images.unsplash.com/photo-1595344356763-9a713a1de3cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b2lsJTIwc3BpbGx8ZW58MHx8MHx8fDA%3D",
            lat: 49.1165,
            lng: -122.9018,
            status: "reported",
            userId: "user4",
            userName: "James Rodriguez",
          },
        ];

        setReports(dummyReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("Failed to load water reports.");
      } finally {
        setIsLoadingReports(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, user]);

  const handleCollect = async (reportId: string) => {
    if (!user) return;

    // Don't allow multiple collections at once
    if (collectingIds.size > 0) {
      toast.error("Please complete your current analysis first.");
      return;
    }

    try {
      // Add report to collecting set
      setCollectingIds((prev) => new Set(prev).add(reportId));
      toast.loading("Initializing water quality analysis...", { id: reportId });

      // Simulate API call to update report status
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Find the report and update its status
      const updatedReports = reports.map((report) =>
        report.id === reportId
          ? { ...report, status: "collecting" as const }
          : report
      );
      setReports(updatedReports);
      toast.dismiss(reportId);
      toast.success("Analysis in progress. Sampling kit dispatched!");

      // Simulate completion of collection after some time
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Update reports again to mark as collected
      const finalReports = reports.filter((report) => report.id !== reportId);
      setReports(finalReports);
      toast.success(
        "Water quality analysis complete. Thank you for your help!",
        {
          duration: 5000,
        }
      );

      // Remove from collecting set
      setCollectingIds((prev) => {
        const next = new Set(prev);
        next.delete(reportId);
        return next;
      });
    } catch (error) {
      console.error("Error collecting report:", error);
      toast.error("Failed to analyze water source. Please try again.");

      // Remove from collecting set on error
      setCollectingIds((prev) => {
        const next = new Set(prev);
        next.delete(reportId);
        return next;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
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
        Water Quality Analysis
      </h1>

      <div className="bg-indigo-50 p-6 rounded-xl mb-8 border border-indigo-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-indigo-800">
              Reported Water Sources
            </h2>
            <p className="text-indigo-600 mt-1">
              Select a report to initiate water quality analysis
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => router.push("/report")}
              className="bg-sky-500 hover:bg-sky-600"
            >
              <Droplet className="h-4 w-4 mr-2" />
              Report New Water Source
            </Button>
          </div>
        </div>
      </div>

      {isLoadingReports ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin h-8 w-8 text-sky-600 mr-2" />
          <span>Loading water reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-indigo-100">
          <Droplet className="h-16 w-16 mx-auto mb-4 text-indigo-200" />
          <h3 className="text-xl font-medium text-indigo-800 mb-2">
            No Water Sources Needing Analysis
          </h3>
          <p className="text-indigo-600 max-w-md mx-auto">
            There are currently no reported water sources that need analysis.
            Check back later or report a new water source that needs attention.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={report.imageUrl}
                  alt={report.location}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-sm">
                  Reported: {formatDate(report.createdAt)}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-indigo-800 mb-2">
                  {report.location}
                </h3>

                <p className="text-indigo-600 mb-4">{report.description}</p>

                <div className="flex items-center text-sm text-indigo-500 mb-2">
                  <Map className="h-4 w-4 mr-2" />
                  <span>
                    {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-indigo-500 mb-4">
                  <Image className="h-4 w-4 mr-2" />
                  <span>Reported by: {report.userName}</span>
                </div>

                <Button
                  onClick={() => handleCollect(report.id)}
                  disabled={collectingIds.has(report.id)}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                >
                  {collectingIds.has(report.id) ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Analyze Water Quality
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-white p-8 rounded-xl shadow-md border border-indigo-100">
        <h2 className="text-xl font-medium mb-4 text-indigo-800">
          Water Quality Analysis Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              <Droplet className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="font-medium text-indigo-800 mb-1">1. Report</h3>
            <p className="text-indigo-800 text-sm">
              Citizens report water sources that show signs of contamination or
              unusual appearance
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              <Map className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="font-medium text-indigo-800 mb-1">2. Analyze</h3>
            <p className="text-indigo-800 text-sm">
              Water quality specialists collect samples and perform
              comprehensive analysis
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-sky-600" />
            </div>
            <h3 className="font-medium text-indigo-800 mb-1">3. Take Action</h3>
            <p className="text-indigo-800 text-sm">
              Based on results, appropriate conservation or remediation actions
              are implemented
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

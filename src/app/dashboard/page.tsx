"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Droplet, Calendar } from "lucide-react";

// Mock data for recent reports
const mockReports = [
  {
    id: 1,
    location: "Lake Ontario Waterfront",
    waterIssueType: "Water Pollution",
    severity: "High",
    createdAt: "2024-03-20",
    description: "Chemical contamination near the shore",
  },
  {
    id: 2,
    location: "Central Park Pond",
    waterIssueType: "Stagnant Water",
    severity: "Medium",
    createdAt: "2024-03-19",
    description: "Standing water with algae growth",
  },
  {
    id: 3,
    location: "Riverside Walking Path",
    waterIssueType: "Water Leakage",
    severity: "Low",
    createdAt: "2024-03-18",
    description: "Minor pipe leakage near the walking area",
  },
];

export default function DashboardPage() {
  const [reports, setReports] = useState(mockReports);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, you would fetch reports from your API here
  useEffect(() => {
    // For now, we're using mock data
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReports(mockReports);
      setIsLoading(false);
    }, 500);
  }, []);

  // Function to get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Dashboard</h1>
        <p className="text-gray-600 mt-2">
          View and manage your water issue reports
        </p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Recent Reports</h2>
        <Link
          href="/report"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          + New Report
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {report.waterIssueType}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(
                      report.severity
                    )}`}
                  >
                    {report.severity}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{report.location}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{report.createdAt}</span>
                </div>

                <p className="text-gray-600 text-sm border-t pt-3 mt-2">
                  {report.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {reports.length === 0 && !isLoading && (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <Droplet className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-800">No reports yet</h3>
          <p className="text-gray-600 mt-1">
            Start by creating a new water issue report
          </p>
          <Link
            href="/report"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Create Report
          </Link>
        </div>
      )}
    </div>
  );
}

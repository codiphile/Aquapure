import { AlertCircle, Droplet, Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AIAnalysisCardProps {
  analysis: string;
  waterIssueType: string;
  severity: string;
}

export const AIAnalysisCard = ({
  analysis,
  waterIssueType,
  severity,
}: AIAnalysisCardProps) => {
  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-500 bg-red-50";
      case "medium":
        return "text-orange-500 bg-orange-50";
      case "low":
        return "text-green-500 bg-green-50";
      default:
        return "text-blue-500 bg-blue-50";
    }
  };

  return (
    <Card className="mt-4 border-indigo-100">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-indigo-500" />
              AI Analysis
            </h3>
            <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
              {analysis}
            </p>
          </div>

          <div className="flex flex-row justify-between items-center pt-3 border-t">
            <div className="flex items-center gap-1.5">
              <Droplet className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-medium">Issue Type:</span>
              <span className="text-xs text-gray-600">{waterIssueType}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Thermometer className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-medium">Severity:</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(
                  severity
                )}`}
              >
                {severity}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

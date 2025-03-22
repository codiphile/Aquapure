"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createReport } from "@/utils/db/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Script from "next/script";

// Extend the Window interface to include google
declare global {
  interface Window {
    google: any;
  }
}

export default function ReportPage() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapPosition, setMapPosition] = useState({
    lat: 12.817221,
    lng: 80.040004,
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInitError, setMapInitError] = useState(false);

  // Initialize map after Google Maps script is loaded
  const initMap = () => {
    if (window.google && !mapLoaded && !mapInitError) {
      try {
        const mapDiv = document.getElementById("map");
        if (!mapDiv) return;

        const map = new window.google.maps.Map(mapDiv, {
          center: mapPosition,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        let marker = new window.google.maps.Marker({
          position: mapPosition,
          map: map,
          draggable: true,
        });

        // Handle map clicks
        map.addListener("click", (e: any) => {
          const newPos = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          setMapPosition(newPos);
          marker.setPosition(newPos);

          // Try to get address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: newPos },
            (results: any, status: string) => {
              if (status === "OK" && results && results[0]) {
                setLocation(results[0].formatted_address);
              }
            }
          );
        });

        // Handle marker drag end
        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          if (position) {
            const newPos = {
              lat: position.lat(),
              lng: position.lng(),
            };
            setMapPosition(newPos);

            // Try to get address
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: newPos },
              (results: any, status: string) => {
                if (status === "OK" && results && results[0]) {
                  setLocation(results[0].formatted_address);
                }
              }
            );
          }
        });

        setMapLoaded(true);
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapInitError(true);
      }
    }
  };

  // Try to get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapPosition({ lat: latitude, lng: longitude });
          toast.success("Location detected successfully");
        },
        (error) => {
          console.error("Error getting current location:", error);
          toast.error(
            "Could not get your location. You can select it on the map."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  }, []);

  // Initialize map when component mounts and re-initialize when mapPosition changes
  useEffect(() => {
    if (window.google) {
      initMap();
    }
  }, [mapPosition.lat, mapPosition.lng]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if all required fields are filled
      if (!location || !description || !imageUrl) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Submit the report with all information
      await createReport({
        userId: "1", // This should be the actual user ID in a real app
        location,
        description,
        waterIssueType: "Water Issue",
        severity: "Medium",
        coordinates: `${mapPosition.lat},${mapPosition.lng}`,
        imageUrl,
        verificationResult: "Verification pending",
      });

      toast.success("Report submitted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={initMap}
        onError={() => setMapInitError(true)}
      />

      <div className="container max-w-3xl py-6">
        <h1 className="text-2xl font-bold mb-6">Report a Water Issue</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-1"
              >
                Location *
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description *
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the water issue you observed"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Pin Location on Map *
              </label>
              {mapInitError ? (
                <div className="h-64 w-full bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                  <p className="text-red-600 text-center px-4">
                    Unable to load Google Maps. Please check your internet
                    connection or try again later.
                    <br />
                    You can still submit the report by entering the location
                    manually.
                  </p>
                </div>
              ) : (
                <div
                  id="map"
                  className="h-64 w-full rounded-lg border border-indigo-200"
                  style={{ minHeight: "256px" }}
                ></div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: {mapPosition.lat.toFixed(6)},{" "}
                {mapPosition.lng.toFixed(6)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="flex flex-col items-center justify-center gap-1 h-32 cursor-pointer">
                  <span className="text-xs text-gray-500">
                    Click to upload an image
                  </span>
                  <span className="text-xs text-gray-400">Max size: 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImageUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {imageUrl && (
                  <div className="mt-2 text-xs text-green-600">
                    Image uploaded successfully
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

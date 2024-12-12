"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const SpotDetails = ({ spot, onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isOccupied, setIsOccupied] = useState(false);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const currentTime = new Date();
      if (spot.reservation && spot.reservation.endTime > currentTime) {
        const timeRemainingMs =
          new Date(spot.reservation.endTime) - currentTime;
        const minutesRemaining = Math.floor(timeRemainingMs / (1000 * 60));
        const secondsRemaining = Math.floor(
          (timeRemainingMs % (1000 * 60)) / 1000
        );
        setTimeRemaining(`${minutesRemaining}m ${secondsRemaining}s`);
        setIsOccupied(true);
      } else {
        setTimeRemaining("Expired");
        setIsOccupied(false);
      }
    };

    updateTimeRemaining();

    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [spot.reservation]);

  return (
    <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Spot {spot.id} Details</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span
              className={`font-medium ${
                isOccupied ? "text-red-600" : "text-green-600"
              }`}
            >
              {isOccupied ? "Occupied" : "Available"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Type:</span>
            <span className="capitalize">{spot.type}</span>
          </div>
        </div>

        {isOccupied && spot.reservation && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-gray-900">Current Reservation</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{spot.reservation.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle Number:</span>
                <span className="font-medium">
                  {spot.reservation.vehicleNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {spot.reservation.duration} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Time:</span>
                <span className="font-medium">
                  {new Date(spot.reservation.startTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Time:</span>
                <span className="font-medium">
                  {new Date(spot.reservation.endTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Remaining:</span>
                <span className="font-medium text-orange-600">
                  {timeRemaining}
                </span>
              </div>
            </div>
          </div>
        )}

        {!isOccupied && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 text-sm">
              This spot is available for reservation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpotDetails;

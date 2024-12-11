"use client";

import React, { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  SelectTrigger,
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/Select";

const ParkingSpotReservationForm = ({ parkingSpots, onReserveSpot }) => {
  const [formData, setFormData] = useState({
    name: "",
    vehicleNumber: "",
    duration: "",
    spotId: "",
  });
  const [isReservationComplete, setIsReservationComplete] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [error, setError] = useState("");

  const isSpotAvailable = (spot) => {
    if (!spot.reservation && !spot.isOccupied) return true;

    const currentTime = new Date();
    if (spot.reservation && spot.reservation.endTime <= currentTime) {
      return true;
    }

    return false;
  };

  const getAvailableSpots = () => {
    return parkingSpots.filter(isSpotAvailable);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.vehicleNumber ||
      !formData.duration ||
      !formData.spotId
    ) {
      setError("All fields are required");
      return;
    }

    const startTime = new Date();
    const duration = parseInt(formData.duration);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000); // Convert minutes to milliseconds

    const reservationData = {
      ...formData,
      startTime,
      endTime,
      duration,
    };

    onReserveSpot(reservationData);
    setReservationDetails(reservationData);
    setIsReservationComplete(true);
  };

  if (isReservationComplete && reservationDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservation Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-green-800 font-semibold mb-2">
                Reservation Details:
              </h3>
              <div className="space-y-2 text-green-700">
                <p>Name: {reservationDetails.name}</p>
                <p>Vehicle Number: {reservationDetails.vehicleNumber}</p>
                <p>Spot Number: {reservationDetails.spotId}</p>
                <p>Duration: {reservationDetails.duration} minutes</p>
                <p>
                  Start Time: {reservationDetails.startTime.toLocaleString()}
                </p>
                <p>End Time: {reservationDetails.endTime.toLocaleString()}</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setIsReservationComplete(false);
                setFormData({
                  name: "",
                  vehicleNumber: "",
                  duration: "",
                  spotId: "",
                });
              }}
            >
              Make Another Reservation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Available durations in minutes
  const availableDurations = [1, 15, 30, 45, 60, 90, 120, 180, 240, 300, 360];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parking Spot Reservation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <SelectGroup>
              <SelectLabel htmlFor="spotId">
                Available Parking Spots
              </SelectLabel>
              <Select
                value={formData.spotId}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "spotId", value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parking spot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Spots</SelectLabel>
                    {getAvailableSpots().map((spot) => (
                      <SelectItem key={spot.id} value={spot.id.toString()}>
                        Spot {spot.id} - {spot.type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SelectGroup>
          </div>

          <div className="space-y-2">
            <SelectGroup>
              <SelectLabel htmlFor="duration">Duration (Minutes)</SelectLabel>
              <Select
                value={formData.duration}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "duration", value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Durations</SelectLabel>
                    {availableDurations.map((minutes) => (
                      <SelectItem key={minutes} value={minutes.toString()}>
                        {minutes} minutes
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SelectGroup>
          </div>

          <div className="space-y-2">
            <SelectGroup>
              <SelectLabel htmlFor="name">Full Name</SelectLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </SelectGroup>
          </div>

          <div className="space-y-2">
            <SelectGroup>
              <SelectLabel htmlFor="vehicleNumber">Vehicle Number</SelectLabel>
              <Input
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleInputChange}
                placeholder="Enter vehicle number"
              />
            </SelectGroup>
          </div>

          <Button type="submit" className="w-full">
            Reserve Spot
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParkingSpotReservationForm;

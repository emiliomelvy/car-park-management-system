"use client";

import React, { useState } from "react";
import ParkingSpotReservationForm from "@/modules/ParkingSpotReservationForm";
import { Stage, Layer, Rect, Text } from "react-konva";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const INITIAL_PARKING_SPOTS = [
  {
    id: 1,
    x: 50,
    y: 50,
    width: 100,
    height: 70,
    isOccupied: false,
    type: "compact",
    reservation: null,
  },
  {
    id: 2,
    x: 200,
    y: 50,
    width: 100,
    height: 70,
    isOccupied: false,
    type: "standard",
    reservation: null,
  },
  {
    id: 3,
    x: 350,
    y: 50,
    width: 100,
    height: 70,
    isOccupied: false,
    type: "large",
    reservation: null,
  },
  {
    id: 4,
    x: 50,
    y: 150,
    width: 100,
    height: 70,
    isOccupied: false,
    type: "standard",
    reservation: null,
  },
  {
    id: 5,
    x: 200,
    y: 150,
    width: 100,
    height: 70,
    isOccupied: false,
    type: "compact",
    reservation: null,
  },
  {
    id: 6,
    x: 350,
    y: 150,
    width: 100,
    height: 70,
    isOccupied: false,
    type: "large",
    reservation: null,
  },
];

const Home = () => {
  const [parkingSpots, setParkingSpots] = useState(INITIAL_PARKING_SPOTS);

  const handleSpotClick = (spotId) => {
    const spot = parkingSpots.find((s) => s.id === spotId);
    setSelectedSpot(spot);
  };

  const handleReserveSpot = (reservationData) => {
    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + parseInt(reservationData.duration) * 60 * 1000
    );

    setParkingSpots((currentSpots) =>
      currentSpots.map((spot) =>
        spot.id === parseInt(reservationData.spotId)
          ? {
              ...spot,
              isOccupied: true,
              reservation: {
                name: reservationData.name,
                vehicleNumber: reservationData.vehicleNumber,
                startTime: startTime,
                endTime: endTime,
                duration: parseInt(reservationData.duration),
              },
            }
          : spot
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Car Park Management System</span>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
                  Available:
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
                  Occupied:
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Stage width={500} height={300}>
              <Layer>
                {INITIAL_PARKING_SPOTS.map((spot) => (
                  <React.Fragment key={spot.id}>
                    <Rect
                      x={spot.x}
                      y={spot.y}
                      width={spot.width}
                      height={spot.height}
                      fill={spot.isOccupied ? "#FEE2E2" : "#D1FAE5"}
                      stroke={spot.isOccupied ? "#FCA5A5" : "#6EE7B7"}
                      strokeWidth={2}
                      onClick={() => handleSpotClick(spot.id)}
                      onMouseEnter={(e) => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                      }}
                      onMouseLeave={(e) => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "default";
                      }}
                    />
                    <Text
                      x={spot.x + 10}
                      y={spot.y + 10}
                      text={`Spot ${spot.id}\n${
                        spot.type.charAt(0).toUpperCase() + spot.type.slice(1)
                      }`}
                      fontSize={12}
                      fill={spot.isOccupied ? "#7F1D1D" : "#064E3B"}
                      onClick={() => handleSpotClick(spot.id)}
                    />
                    {spot.isOccupied && (
                      <Text
                        x={spot.x + spot.width - 60}
                        y={spot.y + spot.height - 20}
                        text="OCCUPIED"
                        fontSize={10}
                        fill="#7F1D1D"
                      />
                    )}
                  </React.Fragment>
                ))}
              </Layer>
            </Stage>
          </CardContent>
        </Card>
        <ParkingSpotReservationForm
          parkingSpots={parkingSpots}
          onReserveSpot={handleReserveSpot}
        />
      </div>
    </div>
  );
};

export default Home;

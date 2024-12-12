"use client";

import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import ParkingSpotReservationForm from "@/modules/ParkingSpotReservationForm";
import SpotDetails from "@/modules/SpotDetails";
import Search from "@/modules/Search";

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
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [parkingSpots, setParkingSpots] = useState(INITIAL_PARKING_SPOTS);
  const [isClient, setIsClient] = useState(false);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedSpots = localStorage.getItem("parkingSpots");
    if (savedSpots) {
      try {
        const parsed = JSON.parse(savedSpots);
        const restoredSpots = parsed.map((spot) => ({
          ...spot,
          reservation: spot.reservation
            ? {
                ...spot.reservation,
                startTime: new Date(spot.reservation.startTime),
                endTime: new Date(spot.reservation.endTime),
              }
            : null,
        }));
        setParkingSpots(restoredSpots);
      } catch (error) {
        console.error("Error loading saved parking spots:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("parkingSpots", JSON.stringify(parkingSpots));
    }
  }, [parkingSpots, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      const currentTime = new Date();
      setParkingSpots((currentSpots) => {
        let needsUpdate = false;
        const updatedSpots = currentSpots.map((spot) => {
          if (spot.reservation && spot.reservation.endTime <= currentTime) {
            needsUpdate = true;
            return {
              ...spot,
              reservation: null,
              isOccupied: false,
            };
          }
          return spot;
        });

        return needsUpdate ? updatedSpots : currentSpots;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isClient]);

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

  const handleSearchResults = (results) => {
    setFilteredSpots(results);
    setIsSearchActive(true);
  };

  const clearSearch = () => {
    setFilteredSpots([]);
    setIsSearchActive(false);
  };

  const totalSpots = parkingSpots.length;
  const occupiedSpots = parkingSpots.filter((spot) => spot.isOccupied).length;
  const availableSpots = totalSpots - occupiedSpots;

  return (
    <div className="container mx-auto p-4">
      <Search
        parkingSpots={parkingSpots}
        onSearchResults={handleSearchResults}
      />

      {isSearchActive && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Search Results ({filteredSpots.length} spots found)
            </h2>
            <button
              onClick={clearSearch}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Show All Spots
            </button>
          </div>

          {filteredSpots.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p>No parking spots found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSpots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold">Spot #{spot.id}</h3>
                  {spot.reservation ? (
                    <div>
                      <p>Reserved by: {spot.reservation.name}</p>
                      <p>Vehicle: {spot.reservation.vehicleNumber}</p>
                    </div>
                  ) : (
                    <p className="text-green-500">Available</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isSearchActive && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Car Park Management System</span>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
                    Available: {availableSpots}
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
                    Occupied: {occupiedSpots}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Stage width={500} height={300}>
                <Layer>
                  {parkingSpots.map((spot) => (
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
      )}

      {selectedSpot && (
        <div className="fixed inset-0 bg-black bg-opacity-50">
          <SpotDetails
            spot={selectedSpot}
            onClose={() => setSelectedSpot(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Home;

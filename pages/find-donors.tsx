import { useCurrentCordinate, useGoogleMap } from "@/lib/GoogleMap";
import React, { FunctionComponent, useEffect, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";

const Button = ({ children, onClick, loading = false }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-1 mt-2 text-white bg-gray-800"
    >
      {loading && (
        <svg
          className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx={12}
            cy={12}
            r={10}
            stroke="currentColor"
            strokeWidth={4}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      <span>{children}</span>
    </button>
  );
};

const FindDonors = () => {
  const { mapDomRef, setZoom, addMarker, clearMarkers } = useGoogleMap();
  const { getCurrentCordinates, cordinate: currentCordinate } =
    useCurrentCordinate();

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [myLocation, setMyLocation] = useState("");

  const addNewLocation = () => {
    if (!location)
      return alert("Please enter a location cordinate to add marker in map");
    const [lat, lng] = location.split(",");
    addMarker({ lat: parseFloat(lat.trim()), lng: parseFloat(lng.trim()) });
  };

  const findnearestMarkers = async () => {
    if (!myLocation)
      return alert("Please Give a cordinate to find nearest markers");

    setLoading(true);
    const api = await fetch(
      "https://rokto-app.netlify.app/.netlify/functions/find-markers",
      {
        method: "POST",
        body: JSON.stringify({
          location: [
            location.split(",")[0].trim(),
            location.split(",")[1].trim(),
          ],
        }),
      }
    );
    const res = await api.json();

    if (!res.markers.length) alert("No markers found");
    setLoading(false);

    res.markers.forEach((marker) => {
      addMarker({
        lat: marker.location.coordinates[1],
        lng: marker.location.coordinates[0],
      });
    });
  };

  const donorsAroundMe = async () => {
    setLoading(true);
    const api = await fetch(
      "https://rokto-app.netlify.app/.netlify/functions/find-markers",
      {
        method: "POST",
        body: JSON.stringify({
          location: [
            myLocation.split(",")[0].trim(),
            myLocation.split(",")[1].trim(),
          ],
        }),
      }
    );
    const res = await api.json();

    if (!res.markers.length) alert("No markers found");
    setLoading(false);
    res.markers.forEach((marker) => {
      addMarker({
        lat: marker.location.coordinates[1],
        lng: marker.location.coordinates[0],
      });
    });
  };

  const pointMyLocation = () => {
    setLoading(true);
    getCurrentCordinates()
      .then((cordinate) => {
        clearMarkers();
        addMarker(cordinate);
        setLoading(false);
        setMyLocation(`${cordinate.lat},${cordinate.lng}`);
      })
      .catch((e) => {
        setLoading(false);
        alert("Please give location permission");
      });
  };

  return (
    <div className="relative w-screen h-screen">
      <div className=" flex gap-6 flex-col shadow rounded-md w-[300px] bg-white bg-opacity-30 p-6 absolute top-10 left-10 z-50">
        {!myLocation && (
          <div>
            <Button loading={loading} onClick={pointMyLocation}>
              Point my location
            </Button>
          </div>
        )}

        {myLocation && (
          <div>
            <Button loading={loading} onClick={donorsAroundMe}>
              Donors around me
            </Button>
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder="Add a new marker"
            className="max-w-full"
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button onClick={addNewLocation}>Add Marker</Button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Find Donors near me"
            className="max-w-full"
            onChange={(e) => setLocation(e.target.value)}
          />

          <Button loading={loading} onClick={findnearestMarkers}>
            Find Markers
          </Button>
        </div>
        <div>
          <Button onClick={() => setZoom(8)}>Reset ZOOM</Button>
        </div>
      </div>
      <div ref={mapDomRef} className="w-full h-full "></div>
    </div>
  );
};

export default FindDonors;

import { useGoogleMap } from "@/lib/GoogleMap";
import React, { useEffect, useState } from "react";

const LocationSwitcher = ({ onChangeCity }) => {
  const cities = [
    "Barisal",
    "Chittagong",
    "Dhaka",
    "Khulna",
    "Rajshahi",
    "Rangpur",
    "Sylhet",
  ];
  const [city, setCity] = useState("");

  const handleChangeCity = (e: any) => {
    // setCity(e.target.value);
    // onChangeCity(e.target.value);
  };

  return (
    <div className="shadow rounded-md w-[300px] h-[200px] bg-white absolute top-10 left-10 z-50">
      <select value={city} onChange={handleChangeCity}>
        <option value="">Select City</option>
        {cities.map((city) => (
          <option value={city} key={city}>
            {city}
          </option>
        ))}
      </select>

      <h3>Selected city: {city}</h3>
    </div>
  );
};

const FindDonors = () => {
  const { mapDomRef, setZoom, addMarker, google } = useGoogleMap();
  // const [city, setCity] = useState(null);

  const [location, setLocation] = useState("");

  const addNewLocation = () => {
    const [lat, lng] = location.split(",");
    addMarker({ lat: parseFloat(lat.trim()), lng: parseFloat(lng.trim()) });
  };

  useEffect(() => {
    // auto complete
    const autocomplete = new google.maps()?.places.Autocomplete(
      document.getElementById("autocomplete")
    );
    // autocomplete.addListener("place_changed", () => {
    //   // const place = autocomplete.getPlace();
    //   // setLocation(place.formatted_address);
    // });

    console.log(google);
  }, [google]);

  return (
    <div className="relative w-screen h-screen">
      <div className="shadow rounded-md w-[300px] h-[200px] bg-white bg-opacity-30 p-6 absolute top-10 left-10 z-50">
        <input
          type="text"
          placeholder="lat"
          className="max-w-full"
          onChange={(e) => setLocation(e.target.value)}
        />

        <input type="text" id="autocomplete" />

        <button
          onClick={addNewLocation}
          className="px-4 py-1 mt-2 text-white bg-gray-800 rounded"
        >
          Add Marker
        </button>
      </div>
      <div ref={mapDomRef} className="w-full h-full "></div>
    </div>
  );
};

export default FindDonors;

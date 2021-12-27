import { google, Loader } from "google-maps";
import React, { useContext, useEffect, useState } from "react";

export interface GoogleMapCord {
  lat: number;
  lng: number;
}

export interface GoogleMapContextType {
  map: google.maps.Map | null;
  markers?: google.maps.Marker[] | null;
  addMarker: (marker: GoogleMapCord) => void;
  clearMarkers: () => void;
  setCenter: (position: GoogleMapCord, zoom?: number) => void;
  setZoom: (zoom: number) => void;
  mapDomRef: React.RefObject<HTMLDivElement>;
  google: any;
}

const GoogleMapContext = React.createContext<GoogleMapContextType>(null);

export const GoogleMapProvider = ({ children, apiKey }) => {
  if (!apiKey) {
    throw new Error("Google Map API Key is required");
  }

  const mapDomRef = React.useRef<HTMLDivElement>(null);

  // map
  const [map, setMap] = React.useState<google.maps.Map>(null);
  // google
  const [google, setGoogle] = React.useState<google>(null);
  // markers
  const [markers, setMarkers] = React.useState<any[]>([]);

  // initMap
  const initMap = async () => {
    const loader = new Loader(apiKey);
    const google = await loader.load();

    const mapInitial = new google.maps.Map(mapDomRef.current, {
      center: { lat: 23.81800190015246, lng: 90.42104025271799 },
      zoom: 8,
      disableDefaultUI: true,
    });

    setMap(mapInitial);
    setGoogle(google);
  };

  useEffect(() => {
    if (mapDomRef.current) initMap();
  }, [mapDomRef]);

  const addMarker = (cordinate: GoogleMapCord) => {
    const marker = new google.maps.Marker({
      position: {
        lat: cordinate.lat,
        lng: cordinate.lng,
      },
      animation: google.maps.Animation.DROP,
      map,
      // icon: {
      //   url: "https://res.cloudinary.com/techdiary-dev/image/upload/v1640444417/static-assets/e4sdtjofuearwchcaeyk.png",
      //   scaledSize: new google.maps.Size(20, 20),
      // },
    });
    setMarkers((markers) => [...markers, marker]);

    if (markers.length < 2) {
      setCenter(cordinate);
      setZoom(12);
    }
  };

  useEffect(() => {
    if (!map) return;
    if (markers.length > 2) {
      fitBounds();
    }
  }, [markers]);

  const fitBounds = () => {
    const bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getVisible()) {
        bounds.extend(markers[i].getPosition());
      }
    }
    map.fitBounds(bounds);
  };

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const setCenter = (position: GoogleMapCord) => {
    if (map) {
      map.setCenter(position);
      console.log("setCenter");
    }
  };

  const setZoom = (zoom: number) => {
    if (map) {
      map.setZoom(zoom);
      console.log("setZoom");
    }
  };

  return (
    <GoogleMapContext.Provider
      value={{
        map,
        addMarker,
        clearMarkers,
        setCenter,
        setZoom,
        mapDomRef,
        google,
      }}
    >
      {children}
    </GoogleMapContext.Provider>
  );
};

export const useGoogleMap = () => {
  const context = useContext(GoogleMapContext);
  if (!context) {
    throw new Error("useGoogleMap must be used within a GoogleMapProvider");
  }
  return context;
};

export const useCurrentCordinate = () => {
  // cordinates state
  const [cordinate, setCordinate] = useState<GoogleMapCord>({
    lat: 0,
    lng: 0,
  });

  // error state
  const [error, setError] = useState<string>("");

  // get current cordinates
  const getCurrentCordinates = async (): Promise<GoogleMapCord> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser");
        setError("Geolocation is not supported by this browser");
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const cordinate: GoogleMapCord = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCordinate(cordinate);
          resolve(cordinate);
        },
        (error) => {
          setError(error.message);
          reject(error.message);
        }
      );
    });
  };

  return { getCurrentCordinates, cordinate, error };
};

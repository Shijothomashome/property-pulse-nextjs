"use client";
import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl";
import { setDefaults, fromAddress } from "react-geocode";
import Spinner from "./Spinner";
import Image from "next/image";
import pin from "@/assets/images/pin.svg";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null); // latitude
  const [lng, setLng] = useState(null); // longitude
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "500px",
    latitude: 0,
    longitude: 0,
    zoom: 12,
  });

  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  // This sets default values for language and region for geocoding requests.
  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY, // google geolocation API key here.
    language: "en", // Default language for responses.
    region: "in", // Default region for responses.
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        // Check for valid results - wrong invalid addresses.
        if (res.results.length === 0) {
          setGeocodeError(true);
          setLoading(false);
          return;
        }

        const { lat, lng } = res.results[0].geometry.location;

        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
        setLoading(false);
      }
    };

    fetchCoords();
  }, []);

  if (loading) return <Spinner loading={loading} />;

  // Handle case where gecoding failed - invalid addresses
  if (geocodeError) {
    return <div className='text-xl'>No location data found</div>
  }

  return (
    !loading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import("mapbox-gl")}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 15,
        }}
        style={{ width: "100%", height: 500 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker latitude={lat} longitude={lng} anchor="bottom">
          <Image
            src={pin}
            width={40}
            height={40}
            alt="location"
            className="rounded-full"
          />
        </Marker>
      </Map>
    )
  );
};

export default PropertyMap;

// after getting the keys from google geolocation api and mapbox,
// we installed 3 packages -- $ npm i react-map-gl mapbox-gl react-geocode

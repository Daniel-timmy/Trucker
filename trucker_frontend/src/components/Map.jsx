import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Routing from "./Routing";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapCard = ({ positions, entries, trip }) => {
  const [waypoints, setWayPoints] = useState([]);
  const [entryInfo, setEntryInfo] = useState([]);

  const setLatLong = () => {
    setWayPoints(
      entries.map((entry) => L.latLng(Number(entry.lat), Number(entry.long)))
    );
  };
  const addWaypoint = (newWaypoint) => {
    setWayPoints((prevWaypoints) => [...prevWaypoints, newWaypoint]);
  };
  // (16.506, 80.648),
  //       L.latLng(17.384, 78.4866),
  //       L.latLng(12.971, 77.5945)

  const setInfo = () => {
    setEntryInfo(
      entries.map(
        (entry) => `
    <h6 style="font-size: 0.65em;">Duty status: ${entry.duty_status}<h6/>
    <h6 style="font-size: 0.65em;">Start time: ${entry.start_time}<h6/>
    <h6 style="font-size: 0.65em;">Activity: ${entry.activity}<h6/>
    <h6 style="font-size: 0.65em;">Location: ${entry.location}<h6/>
    `
      )
    );
  };

  const addNewInfo = (newEntryInfo) => {
    setEntryInfo((prevEntryInfo) => [...prevEntryInfo, newEntryInfo]);
  };
  useEffect(() => {
    if (entries !== undefined) {
      setLatLong();
    }
  }, [entries]);

  useEffect(() => {
    if (waypoints !== undefined) {
      setInfo();
      console.log(entryInfo);
    }
  }, [waypoints, entries]);

  return (
    <>
      <div style={{ height: "800px", width: "100%" }}>
        <MapContainer
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "80%" }}
          className="text-dark"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          />

          <Routing waypoints={waypoints} entries={entries} info={entryInfo} />
        </MapContainer>
      </div>
    </>
  );
};

export default MapCard;

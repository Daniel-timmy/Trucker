import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

export default function Routing({ waypoints, info }) {
  const map = useMap();
  console.log(waypoints);

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: true,
    }).addTo(map);

    routingControl.on("routeselected", function (e) {
      const waypoints = e.route.waypoints;
      waypoints.forEach((waypoint, index) => {
        L.marker(waypoint.latLng)
          .addTo(map)
          .bindPopup(`Waypoint ${info[index]}`)
          .openPopup();
      });
    });

    return () => map.removeControl(routingControl);
  }, [map, waypoints, info]);

  return null;
}

import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import RouteTask from "@arcgis/core/tasks/RouteTask";
import RouteParameters from "@arcgis/core/tasks/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";

import React from "react";

const MapArc2 = ({ entries, trip }) => {
  const mapRef = useRef(null);
  const graphicsLayer = useRef(new GraphicsLayer());
  const [coordinates, setCoordinates] = useState(null);
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    const tripCoords = {
      start: {
        longitude: -118.2437,
        latitude: 34.0522,
        location: "Los Angeles",
      }, // Los Angeles
      end: {
        longitude: -117.2437,
        latitude: 34.0522,
        location: "100 miles East",
      }, // 100 miles east
    };
    //   const tripCoords = {
    //     start: { longitude: trip.start_coords.longitude, latitude: trip.start_coords.latitude, location: trip.start_coords.location }, // Los Angeles
    //     end: { longitude: trip.end_coords.longitude, latitude: trip.end_coords.latitude, location: trip.end_coords.location }, // 100 miles east
    //   };
    setCoordinates(tripCoords);
  }, [trip]);

  useEffect(() => {
    const entriesCoords = entries.forEach((entry) => ({
      longitude: entry.long,
      latitude: entry.lat,
      duty_status: point.duty_status,
      location: point.location,
      activity: point.activity,
      duration: point.duration,
    }));
    setRouteData(entriesCoords);
  }, [entries]);

  useEffect(() => {
    if (!coordinates) return; // Wait until coordinates are fetched

    // Initialize the map
    const map = new Map({
      basemap: "streets-navigation-vector",
    });
    const mapView = new MapView({
      container: mapRef.current,
      map: map,
      center: [
        (coordinates.start.longitude + coordinates.end.longitude) / 2,
        (coordinates.start.latitude + coordinates.end.latitude) / 2,
      ],
      zoom: 8,
    });

    map.add(graphicsLayer.current);

    const stops = [
      {
        geometry: {
          type: "point",
          x: coordinates.start.longitude,
          y: coordinates.start.latitude,
          spatialReference: { wkid: 4326 },
        },
        attributes: {
          title: "Start Point",
          location: coordinates.start.location,
          description: "Starting location of the route",
        },
      },
      {
        geometry: {
          type: "point",
          x: coordinates.end.longitude,
          y: coordinates.end.latitude,
          spatialReference: { wkid: 4326 },
        },
        attributes: {
          title: "End Point",
          location: coordinates.end.location,
          description: "Ending location of the route",
        },
      },
    ];

    stops.forEach((stop) => {
      const marker = new Graphic({
        geometry: stop.geometry,
        symbol: new SimpleMarkerSymbol({
          color: "red",
          size: "12px",
        }),
        attributes: stop.attributes,
        popupTemplate: new PopupTemplate({
          title: "{title}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "address", label: "Address" },
                { fieldName: "description", label: "Description" },
              ],
            },
          ],
        }),
      });
      graphicsLayer.current.add(marker);
    });

    routeData.forEach((point) => {
      const additionalMarker = new Graphic({
        geometry: {
          type: "point",
          x: point.longitude,
          y: point.latitude,
          spatialReference: { wkid: 4326 },
        },
        symbol: new SimpleMarkerSymbol({
          color: "green", // Different color to distinguish from start/end
          size: "10px",
        }),
        attributes: {
          duty_status: point.duty_status,
          location: point.location,
          activity: point.activity,
          duration: point.duration,
        },
        popupTemplate: new PopupTemplate({
          title: "{duty_status}",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "location", label: "Location" },
                { fieldName: "activity", label: "Activity" },
                { fieldName: "duration", label: "Duration" },
              ],
            },
          ],
        }),
      });
      graphicsLayer.current.add(additionalMarker);
    });

    calculateRoute(stops, graphicsLayer.current);
    return () => mapView.destroy();
  }, [coordinates]);

  const calculateRoute = async (stops, layer) => {
    const routeTask = new RouteTask({
      url: import.meta.env.ARCGIS_URL,
    });

    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: stops.map((stop) => new Graphic({ geometry: stop })),
      }),
      returnRoutes: true,
      apiKey: import.meta.env.ARCGIS_API_KEY,
    });

    try {
      const result = await routeTask.solve(routeParams);
      const routeGraphic = new Graphic({
        geometry: result.routeResults[0].route.geometry,
        symbol: new SimpleLineSymbol({
          color: "blue",
          width: "4px",
        }),
      });

      layer.add(routeGraphic);
    } catch (error) {
      console.error("Routing failed:", error);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default MapArc2;

// useEffect(() => {
//     const fetchRouteData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/geocode/?start_address=${encodeURIComponent(
//             "1600 Pennsylvania Ave NW, Washington, DC"
//           )}&end_address=${encodeURIComponent("1 Capitol Hill, Washington, DC")}`
//         );
//         const data = await response.json();
//         if (data.error) throw new Error(data.error);

//         // Simulate additional points (replace with actual backend data)
//         const additionalPoints = [
//           {
//             longitude: -77.0250,
//             latitude: 38.8950,
//             title: "Midway Point",
//             address: "Midway Stop, Washington, DC",
//             description: "A point of interest along the route",
//           },
//           {
//             longitude: -77.0300,
//             latitude: 38.9000,
//             title: "Landmark",
//             address: "Some Landmark, Washington, DC",
//             description: "A notable location",
//           },
//         ];

//         setRouteData({ ...data, additionalPoints });
//       } catch (error) {
//         console.error("Failed to fetch route data:", error);
//       }
//     };
//     fetchRouteData();
//   }, []);

import api from "../api";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import RouteLayer from "@arcgis/core/layers/RouteLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import esriConfig from "@arcgis/core/config";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import { useRef, useEffect, useState } from "react";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Directions from "@arcgis/core/widgets/Directions";
import Stop from "@arcgis/core/rest/support/Stop";
import Collection from "@arcgis/core/core/Collection";

const API_KEY = import.meta.env.VITE_ARCGIS_API_KEY;

const MapCard = ({ trip }) => {
  const [entries, setEntries] = useState([]);
  const [stops, setStops] = useState([]);
  const [graphics, setGraphics] = useState([]);
  const [routeDetails, setRouteDetails] = useState(null);

  const mapDiv = useRef(null);

  const getEntries = async () => {
    const res = await api.get(`logentries/${trip.id}/trips/`);
    const data = res.data;
    setEntries(data.reverse());
  };
  useEffect(() => {
    getEntries();
  }, [trip]);

  useEffect(() => {
    console.log("APIKEY");
    console.log(API_KEY);
    if (entries.length === 0) {
      return;
    }
    setStops(() => {
      const stops = entries.map((entry) => {
        const point = new Point({
          x: entry.long,
          y: entry.lat,
          spatialReference: { wkid: 4326 },
        });

        return new Stop({
          geometry: point,
          name: entry.location,
        });
      });
      return stops;
    });
  }, [entries]);

  useEffect(() => {
    if (entries.length === 0) {
      return;
    }
    setGraphics(() => {
      const graphics = entries.map((entry) => {
        const point = new Point({
          x: entry.long,
          y: entry.lat,
          spatialReference: { wkid: 4326 },
        });

        return new Graphic({
          geometry: point,
          symbol: {
            type: "simple-marker",
            color: "blue",
            size: "12px",
          },
          attributes: {
            Location: entry.location,
            Activity: entry.activity,
          },
          popupTemplate: new PopupTemplate({
            title: "{Location}",
            content: "{Activity}",
          }),
        });
      });
      return graphics;
    });
  }, [entries]);

  useEffect(() => {
    if (!trip) return;
    esriConfig.apiKey = API_KEY;

    if (mapDiv.current) {
      const webmap = new Map({
        basemap: "dark-gray-vector",
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        center: [-117.149, 32.7353],
        scale: 10000000,
      });

      const routeLayer = new RouteLayer();
      webmap.add(routeLayer);

      view.when(async () => {
        try {
          const startPoint = new Point({
            x: trip.start_coords.longitude,
            y: trip.start_coords.latitude,
            spatialReference: { wkid: 4326 },
          });

          const endPoint = new Point({
            x: trip.end_coords.longitude,
            y: trip.end_coords.latitude,
            spatialReference: { wkid: 4326 },
          });
          const startStop = new Stop({
            geometry: startPoint,
            name: trip.pickup_location,
          });

          const endStop = new Stop({
            geometry: endPoint,
            name: trip.dropoff_location,
          });

          const startGraphic = new Graphic({
            geometry: startPoint,
            symbol: {
              type: "simple-marker",
              color: "green",
              size: "12px",
            },
            attributes: {
              Name: `${trip.pickup_location}`,
              Description: "Starting point of the route",
            },
            popupTemplate: new PopupTemplate({
              title: "{Name}",
              content: "{Description}",
            }),
          });

          const endGraphic = new Graphic({
            geometry: endPoint,
            symbol: {
              type: "simple-marker",
              color: "red",
              size: "12px",
            },
            attributes: {
              Name: `${trip.dropoff_location}`,
              Description: "End point of the route",
            },
            popupTemplate: new PopupTemplate({
              title: "{Name}",
              content: "{Description}",
            }),
          });
          const stopsCollection = new Collection();
          stopsCollection.addMany([startStop, endStop]);
          // const entryCollections = new Collection(stops)

          await routeLayer.load();
          console.log("RouteLayer loaded:", routeLayer.loaded);
          routeLayer.stops = stopsCollection;

          const routeParams = {
            stops: stopsCollection,
            returnDirections: true,
            returnRoutes: true,
            returnStops: true,
            directionLanguage: "en",
          };
          const routeResult = await routeLayer.solve(routeParams);

          if (
            routeResult &&
            routeResult.routeInfo &&
            routeResult.routeInfo.geometry
          ) {
            const routeGeometry = routeResult.routeInfo.geometry;
            const routeGraphic = new Graphic({
              geometry: routeGeometry,
              symbol: {
                type: "simple-line",
                color: "blue",
                width: 2,
              },
            });
            view.graphics.add(routeGraphic);
            view.graphics.addMany([startGraphic, endGraphic]);
            view.graphics.addMany(graphics);
            view.goTo(routeGeometry);

            const directionsWidget = new Directions({
              view: view,
              layer: routeLayer,
            });
            view.ui.add(directionsWidget, "top-right");
            // console.log("Directions widget initialized:", directionsWidget);
          } else {
            console.error(
              "No valid route geometry found in result:",
              routeResult
            );
            console.log("RouteInfo contents:", routeResult.routeInfo);
          }
        } catch (error) {
          console.error("Route error details:", {
            name: error.name,
            message: error.message,
            details: error.details,
            stack: error.stack,
          });
        }
      });

      return () => {
        if (view) {
          view.destroy();
        }
      };
    }
  }, [trip, entries, stops]);

  return (
    <div
      className="mapDiv "
      ref={mapDiv}
      style={{ height: "50vh", width: "100%" }}
    ></div>
  );
};

export default MapCard;

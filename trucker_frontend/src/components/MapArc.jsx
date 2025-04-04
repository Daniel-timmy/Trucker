import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import { useRef, useEffect } from "react";

const MapComponent = () => {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      const webmap = new Map({
        basemap: "dark-gray-vector",
      });

      const view = new MapView({
        container: mapDiv.current, // The id or node representing the DOM element containing the view.
        map: webmap, // An instance of a Map object to display in the view.
        center: [-117.149, 32.7353],
        scale: 10000000, // Represents the map scale at the center of the view.
      });

      return () => view && view.destroy();
    }
  }, []);

  return (
    <div
      className="mapDiv"
      ref={mapDiv}
      style={{ height: "50vh", width: "50%" }}
    ></div>
  );
};

export default MapComponent;

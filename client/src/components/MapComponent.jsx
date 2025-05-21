import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import LayerToggles from "./ToggleLayers.jsx";
import DocsInfo from "./DocsInfo.jsx";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/MapStyles.css";

const MAPBOX_MAP_STYLES = import.meta.env.VITE_MAPBOX_MAP_STYLES;
const API_URL = import.meta.env.VITE_API_URL;

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [checkedField, setCheckedField] = useState(null);

  // handleLotsSelection by getting the tiles for selected lot
  function handleLotsSelection() {
    map.current.on("load", () => {
      // Add Field Polygon Fill Layer

      map.current.addSource("lot_selection", {
        type: "vector",
        tiles: [`${API_URL}lots/${checkedField}/{z}/{x}/{y}.pbf`],
      });

      map.current.addLayer({
        id: "fields-fill-layer",
        type: "fill",
        source: "lot_selection",
        "source-layer": "fields",
        paint: {
          "fill-color": "#88c877", // Green color for the fill
          "fill-opacity": 0.3, // Set to 0.3 for a semi-transparent fill
        },
      });

      // Add Field Polygon Border Layer
      map.current.addLayer({
        id: "fields-border-layer",
        type: "line",
        source: "lot_selection",
        "source-layer": "fields",
        paint: {
          "line-color": "#FF0000", // Red color for the border
          "line-width": 3, // Thick border width
        },
      });

      map.current.addLayer({
        id: "line-layer",
        type: "line",
        source: "lot_selection",
        "source-layer": "tree_lines",
        minzoom: 18, // Layer visible at zoom level 16.5 and higher
        paint: {
          "line-color": "#2b2a2a", // Gray color for the line
          "line-opacity": 0.8, // 50% opacity for the line
          "line-width": 2,
        },
      });

      // Add Line Labels Layer
      map.current.addLayer({
        id: "line-label-layer",
        type: "symbol",
        source: "lot_selection",
        "source-layer": "tree_lines",
        minzoom: 16.5, // Labels visible at zoom level 16.5 and higher
        layout: {
          "symbol-placement": "line", // Place label along the line
          "text-field": ["get", "t_line_id"], // Use the "F" field as the label text
          "text-size": 12, // Font size for the label
        },
        paint: {
          "text-color": "#000000", // Black color for label text
          "text-halo-color": "#ffffff", // White halo for readability
          "text-halo-width": 1, // Width of the halo around text
        },
      });

      // Add Tree Points Layer 1
      map.current.addSource("trees", {
        type: "vector",
        tiles: ["http://localhost:3001/tiles/trees/{z}/{x}/{y}.pbf"],
      });

      map.current.addLayer({
        id: "trees-layer-1",
        type: "circle",
        source: "lot_selection",
        "source-layer": "trees",
        minzoom: 18, // Layer only visible at zoom level 18 and higher
        paint: {
          "circle-radius": 5,
          "circle-color": [
            "match",
            ["get", "status"],
            "Aprovechar",
            "#0000ff",
            "En riesgo",
            "#FFFF00",
            "Faltante",
            "#ff0000",
            "Injerto",
            "#800080",
            "Productivo",
            "#00ff00",
            "#cccccc",
          ],
        },
      });
    });
  }

  // handleCompleteView by getting the tiles for each layer

  //TODO: improve and refactor this
  function handleLoadAll() {
    map.current.on("load", () => {
      // Add Field Polygon Fill Layer

      map.current.addSource("fields", {
        type: "vector",
        tiles: [`${API_URL}tiles/fields/{z}/{x}/{y}.pbf`],
      });

      map.current.addLayer({
        id: "fields-fill-layer",
        type: "fill",
        source: "fields",
        "source-layer": "fields",
        paint: {
          "fill-color": "#88c877", // Green color for the fill
          "fill-opacity": 0.3, // Set to 0.3 for a semi-transparent fill
        },
      });

      // Add Field Polygon Border Layer
      map.current.addLayer({
        id: "fields-border-layer",
        type: "line",
        source: "fields",
        "source-layer": "fields",
        paint: {
          "line-color": "#FF0000", // Red color for the border
          "line-width": 3, // Thick border width
        },
      });

      // Add Line Layer
      map.current.addSource("tree_lines", {
        type: "vector",
        tiles: [`${API_URL}tiles/tree_lines/{z}/{x}/{y}.pbf`],
      });

      map.current.addLayer({
        id: "line-layer",
        type: "line",
        source: "tree_lines",
        "source-layer": "tree_lines",
        minzoom: 18, // Layer visible at zoom level 16.5 and higher
        paint: {
          "line-color": "#2b2a2a", // Gray color for the line
          "line-opacity": 0.8, // 50% opacity for the line
          "line-width": 2,
        },
      });

      // Add Line Labels Layer
      map.current.addLayer({
        id: "line-label-layer",
        type: "symbol",
        source: "tree_lines",
        "source-layer": "tree_lines",
        minzoom: 16.5, // Labels visible at zoom level 16.5 and higher
        layout: {
          "symbol-placement": "line", // Place label along the line
          "text-field": ["get", "t_line_id"], // Use the "F" field as the label text
          "text-size": 12, // Font size for the label
        },
        paint: {
          "text-color": "#000000", // Black color for label text
          "text-halo-color": "#ffffff", // White halo for readability
          "text-halo-width": 1, // Width of the halo around text
        },
      });

      // Add Tree Points Layer 1
      map.current.addSource("trees", {
        type: "vector",
        tiles: [`${API_URL}tiles/trees/{z}/{x}/{y}.pbf`],
      });

      map.current.addLayer({
        id: "trees-layer-1",
        type: "circle",
        source: "trees",
        "source-layer": "trees",
        minzoom: 18, // Layer only visible at zoom level 18 and higher
        paint: {
          "circle-radius": 5,
          "circle-color": [
            "match",
            ["get", "status"],
            "Aprovechar",
            "#0000ff",
            "En riesgo",
            "#FFFF00",
            "Faltante",
            "#ff0000",
            "Injerto",
            "#800080",
            "Productivo",
            "#00ff00",
            "#cccccc",
          ],
        },
      });
    });
  }

  function initializeMap() {
    // Initialize Mapbox with your access token
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const bounds = [
      [-76.11, 6.32], // Southwest corner
      [-76.01, 6.33], // Northeast corner
    ];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `${MAPBOX_MAP_STYLES}`,
      center: [-76.439, 3.872],
      zoom: 16.5,
      minZoom: 10.5, // Minimum zoom level
      maxBounds: bounds, // Restrict map to specified bounds
    });

    map.current.on("sourcedata", function (e) {
      if (e.isSourceLoaded) {
        console.log("Fuente cargada:", e.sourceId);
      }
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-left");

    // Initialize Popup
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
    });

    if (checkedField) {
      handleLotsSelection();
    } else {
      handleLoadAll();
    }

    map.current.on("sourcedataloading", function (e) {
      console.log("Cargando fuente:", e.sourceId);
    });

    map.current.on("error", function (e) {
      console.error("Error en el mapa:", e.error);
    });

    // Add click event for popups

    map.current.on("click", (e) => {
      const layers = ["trees-layer-1", "line-layer", "fields-fill-layer"];
      const features = map.current.queryRenderedFeatures(e.point, { layers });

      if (features.length > 0) {
        const feature = features[0];
        let htmlContent = "<table>";
        let title = "";

        // Determine the layer type and display corresponding properties with a title
        if (feature.layer.id === "trees-layer-1") {
          title = "<h3>Tree</h3>";
          htmlContent += `<tr><td><strong>Estado:</strong></td><td>${feature?.properties.status}</td></tr>`;
          htmlContent += `<tr><td><strong>Lote:</strong></td><td>${feature?.properties.lot_name}</td></tr>`;
          htmlContent += `<tr><td><strong>Nombre:</strong></td><td>${feature?.properties.name}</td></tr>`;
          htmlContent += `<tr><td><strong>Posicion:</strong></td><td>${feature?.properties.longitude}, ${feature?.properties.latitude}</td></tr>`;
          htmlContent += `<tr><td><strong>Productivo:</strong></td><td>${feature?.properties.flowering}</td></tr>`;
          //add edit button
          // htmlContent += `<tr><td colspan="2" style="text-align: center; padding-top: 10px;"><button class="popup-edit-btn">Edit Tree</button></td></tr>`
        } else if (feature.layer.id === "line-layer") {
          title = "<h3>Tree Line</h3>";
          htmlContent += `<tr><td><strong>Lote:</strong></td><td>${feature?.properties.lot_name}</td></tr>`;
          htmlContent += `<tr><td><strong>Nombre fila:</strong></td><td>${feature?.properties.name}</td></tr>`;
          htmlContent += `<tr><td><strong>Num fila:</strong></td><td>${feature?.properties.t_line_id}</td></tr>`;
          htmlContent += `<tr><td><strong>Faltante:</strong></td><td>${
            feature?.properties?.missing_trees_count
              ? feature?.properties?.missing_trees_count
              : "N/A"
          }</td></tr>`;
          htmlContent += `<tr><td><strong>Árboles x estado productivo:</strong></td><td>${feature?.properties.productive_trees_count}</td></tr>`;
        } else if (feature.layer.id === "fields-fill-layer") {
          title = "<h3>Field</h3>";
          htmlContent += `<tr><td><strong>Nombre:</strong></td><td>${feature?.properties.lot_name}</td></tr>`;
          htmlContent += `<tr><td><strong>Area:</strong></td><td>${feature?.properties.area}</td></tr>`;
          htmlContent += `<tr><td><strong>Perímetro:</strong></td><td>${feature?.properties.perimeter} Km</td></tr>`;
          htmlContent += `<tr><td><strong>Árboles x estado productivo:</strong></td><td>${feature?.properties.amount_productive_trees}</td></tr>`;
        }

        htmlContent = title + htmlContent + "</table>";

        // Set popup content and location
        popup.setLngLat(e.lngLat).setHTML(htmlContent).addTo(map.current);
      }
    });
  }

  useEffect(() => {
    if (map.current) return;
    try {
      initializeMap();
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  useEffect(() => {
    initializeMap();
  }, [checkedField]);

  return (
    <div>
      <LayerToggles
        map={map}
        setCheckedField={setCheckedField}
        checkedField={checkedField}
      />
      <DocsInfo />
      <div ref={mapContainer} className="map-container" id="map" />
    </div>
  );
};

export default MapComponent;

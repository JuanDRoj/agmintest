import { useEffect, useState } from "react";
import { getFields } from "../api/useFieldsData";
import "../styles/MapStyles.css";

const layerConfigs = [
  {
    id: "fields",
    label: "Fields Layer",
    layerIds: ["fields-fill-layer", "fields-border-layer"],
  },
  {
    id: "lines",
    label: "Lines Layer",
    layerIds: ["line-layer", "line-label-layer"],
  },
  {
    id: "trees",
    label: "Tree Points",
    layerIds: ["trees-layer-1"],
  },
];

const LayerToggles = ({ map, setCheckedField, checkedField }) => {
  const [checkedLayers, setCheckedLayers] = useState(() =>
    Object.fromEntries(layerConfigs.map((layer) => [layer.id, true]))
  );

  const [fieldsData, setFiedsData] = useState([]);

  useEffect(() => {
    if (!map || !map.current) return;

    layerConfigs.forEach(({ id, layerIds }) => {
      const visible = checkedLayers[id];
      layerIds.forEach((layerId) => {
        const layer = map.current.getLayer(layerId);
        if (layer) {
          map.current.setLayoutProperty(
            layerId,
            "visibility",
            visible ? "visible" : "none"
          );
        }
      });
    });
  }, [checkedLayers, map]);

  useEffect(() => {
    getFields()
      .then((fields) => {
        setFiedsData(fields);
      })
      .catch(console.error);
  }, []);

  const toggleLayer = (id) => {
    setCheckedLayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div id="menu">
      <h3>Toggle Lots</h3>
      <div id="fields-container">
        {fieldsData.map(({ id, lot_name }) => (
          <label
            key={id}
            htmlFor={id}
            style={{ display: "block", marginBottom: "4px" }}
          >
            <input
              type="checkbox"
              id={id}
              checked={checkedField === id}
              onChange={() =>
                setCheckedField((prev) => (prev === id ? null : id))
              }
            />
            <span style={{ marginLeft: "8px" }}>{lot_name}</span>
          </label>
        ))}
      </div>

      <h3>Toggle Layers</h3>
      {layerConfigs.map(({ id, label }) => (
        <label
          key={id}
          htmlFor={id}
          style={{ display: "block", marginBottom: "4px" }}
        >
          <input
            type="checkbox"
            id={id}
            checked={checkedLayers[id]}
            onChange={() => toggleLayer(id)}
          />
          <span style={{ marginLeft: "8px" }}>{label}</span>
        </label>
      ))}
    </div>
  );
};

export default LayerToggles;

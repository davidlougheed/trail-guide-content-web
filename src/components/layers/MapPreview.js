import React from "react";
import {GeoJSON, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Link} from "react-router-dom";

import {transformCoords} from "../../utils";

const MapPreview = ({layers, stations}) => {
  return <MapContainer center={[44.4727488, -76.4295608]} zoom={14} style={{height: 400}}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {layers.filter(layer => layer.enabled).map(layer =>
      <GeoJSON
        key={layer.id}
        data={layer.geojson}
        style={feature => ({
          color: feature.properties.stroke ?? feature.properties.color ?? "#000",
        })}
      />
    )}
    {(stations ?? []).filter(station => station.enabled).map(station => {
      const t = transformCoords(station.coordinates_utm);
      return <Marker position={[t.latitude, t.longitude]}>
        <Popup>
          <Link to={`/stations/detail/${station.id}`}>{station.title}</Link>
        </Popup>
      </Marker>;
    })}
  </MapContainer>;
};

export default MapPreview;

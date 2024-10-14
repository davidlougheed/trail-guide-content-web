// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import React from "react";
import {GeoJSON, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Link} from "react-router-dom";
import {Icon} from "leaflet";

// import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import iconPng from "leaflet/dist/images/marker-icon.png";
import icon2XPng from "leaflet/dist/images/marker-icon-2x.png";
import iconShadowPng from "leaflet/dist/images/marker-shadow.png";

const icon = new Icon({
  iconUrl: iconPng,
  iconRetinaUrl: icon2XPng,
  iconSize: {x: 25, y: 41},
  iconAnchor: {x: 12, y: 41},
  popupAnchor: {x: 1, y: -41},
  shadowUrl: iconShadowPng,
});

import {transformCoords} from "../../utils";

import ErrorBoundary from "../ErrorBoundary";

const styles = {
  mapContainer: {height: 400},
};

const MapPreview = React.memo(({layers, stations}) => {
  // noinspection JSValidateTypes
  // TODO: Configurable centre, boundaries

  const centre = [44.4727488, -76.4295608];

  // noinspection JSValidateTypes
  return <ErrorBoundary>
      <MapContainer center={centre} zoom={14} style={styles.mapContainer}>
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
        return <Marker icon={icon} position={[t.latitude, t.longitude]} key={station.id}>
          <Popup>
            <Link to={`/stations/detail/${station.id}`}>{station.title}</Link>
          </Popup>
        </Marker>;
      })}
    </MapContainer>
  </ErrorBoundary>;
});

export default MapPreview;

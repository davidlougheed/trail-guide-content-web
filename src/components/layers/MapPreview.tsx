// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2025  David Lougheed
// See NOTICE for more information.

import React, {CSSProperties, useRef} from "react";
import {GeoJSON, MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Link} from "react-router-dom";
import {Icon, LatLngExpression, Map, Point} from "leaflet";

import "leaflet/dist/leaflet.css";

// @ts-ignore
import iconPng from "leaflet/dist/images/marker-icon.png";
// @ts-ignore
import icon2XPng from "leaflet/dist/images/marker-icon-2x.png";
// @ts-ignore
import iconShadowPng from "leaflet/dist/images/marker-shadow.png";

const icon = new Icon({
  iconUrl: iconPng,
  iconRetinaUrl: icon2XPng,
  iconSize: new Point(25, 41),
  iconAnchor: new Point(12, 41),
  popupAnchor: new Point(1, -41),
  shadowUrl: iconShadowPng,
});

import {Layer} from "../../modules/layers/types";
import {Station} from "../../modules/stations/types";
import {transformCoords} from "../../utils";

import ErrorBoundary from "../ErrorBoundary";

const styles: Record<string, CSSProperties> = {
  mapContainer: {height: 400},
};

const MapPreview = React.memo(({layers, stations}: {layers: Layer[], stations: Station[]}) => {
  const mapRef = useRef<Map>();
  const fittedBounds = useRef<boolean>();

  const centre: LatLngExpression = [0, 0];  // Dummy centre - to be updated by add(...) event handler below

  return <ErrorBoundary>
      <MapContainer ref={mapRef} center={centre} zoom={14} style={styles.mapContainer}>
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
          eventHandlers={{
            add: (e) => {
              // When we add the first layer to the map, we fit the bounds of the map to the bounding box of that layer.
              // This is an imperfect method for multiple layers; in the future we could calculate the bounding box of
              // all bounding boxes via getBounds() on each layer and then fitting at the end.
              if (!mapRef.current) return;
              if (fittedBounds.current) return;
              mapRef.current.fitBounds(e.target.getBounds());
              fittedBounds.current = true;
            },
          }}
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

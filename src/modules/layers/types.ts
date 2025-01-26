import type {GeoJsonObject} from 'geojson';

export type Layer = {
  id: string;
  name: string;
  geojson: GeoJsonObject;
  enabled: boolean;
  rank: number;
};

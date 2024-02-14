import type {AssetType} from "../asset_types/types";

export interface Asset {
  id: string;
  asset_type: AssetType;
  file_name: string;
  file_size: number;
  sha1_checksum: string;
  times_used_by_all: number;
  times_used_by_enabled: number;
}

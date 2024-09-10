import type {ServerConfig} from "./types";
import {useEffect, useMemo, useState} from "react";

import {useAppSelector} from "../../hooks";
import {getLocalStorageJSON, setLocalStorageJSON} from "../../utils";

const LS_SERVER_CONFIG_KEY = "tgcw:server:config";

type ServerConfigData = {
  isFetching: boolean;
  initialFetchDone: boolean;
  config: ServerConfig | {};
};

export const useCachedServerConfig = (): ServerConfigData => {
  const {isFetching, initialFetchDone, data: fetchedServerConfig} = useAppSelector(state => state.server.config);
  const [storedThisSession, setStoredThisSession] = useState(false);

  const serverConfig = useMemo<ServerConfig | {}>(() => {
    if (!storedThisSession) {
      return getLocalStorageJSON(LS_SERVER_CONFIG_KEY) as ServerConfig | {};
    } else {
      return fetchedServerConfig;
    }
  }, [storedThisSession]);

  useEffect(() => {
    if (fetchedServerConfig && Object.keys(fetchedServerConfig).length) {
      setLocalStorageJSON(LS_SERVER_CONFIG_KEY, fetchedServerConfig);
      setStoredThisSession(true);
    }
  }, [fetchedServerConfig]);

  return {isFetching, initialFetchDone, config: serverConfig};
};

export const useSiteTitle = () => {
  const {initialFetchDone, config} = useCachedServerConfig();
  return useMemo(
    () => {
      if ("APP_NAME" in config) {
        return config.APP_NAME;
      } else {
        return initialFetchDone ? "Trail Guide" : "";
      }
    },
    [initialFetchDone, config]);
};

import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

import type {ServerConfig, ServerInfo} from "./types";

export const FETCH_SERVER_INFO = networkActionTypes("FETCH_SERVER_INFO");
export const FETCH_SERVER_CONFIG = networkActionTypes("FETCH_SERVER_CONFIG");

const fetchServerInfo = networkAction<{}, ServerInfo>(FETCH_SERVER_INFO, "/info");
export const fetchServerInfoIfNeeded = makeIfNeededAction(fetchServerInfo, "serverInfo");

const fetchServerConfig = networkAction<{}, ServerConfig>(FETCH_SERVER_CONFIG, "/config");
export const fetchServerConfigIfNeeded = makeIfNeededAction(fetchServerConfig, "serverConfig");

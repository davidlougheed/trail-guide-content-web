import {makeIfNeededAction, networkAction, networkActionTypes} from "../../utils";

export const FETCH_SERVER_CONFIG = networkActionTypes("FETCH_SERVER_CONFIG");

const fetchServerConfig = networkAction(FETCH_SERVER_CONFIG, "/config");
export const fetchServerConfigIfNeeded = makeIfNeededAction(fetchServerConfig, "serverConfig");

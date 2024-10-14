// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import {combineReducers} from "redux";

import {FETCH_SERVER_CONFIG, FETCH_SERVER_INFO} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

import type {ServerInfo, ServerConfig} from "./types";

const serverInfoReducer = makeGenericNetworkReducer<ServerInfo>(
  FETCH_SERVER_INFO,
  undefined,
  undefined,
  undefined,
  undefined,
  false,
);

const serverConfigReducer = makeGenericNetworkReducer<ServerConfig>(
  FETCH_SERVER_CONFIG,
  undefined,
  undefined,
  undefined,
  undefined,
  false,
);

export default combineReducers({
  info: serverInfoReducer,
  config: serverConfigReducer,
});

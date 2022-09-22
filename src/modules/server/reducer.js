// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import {combineReducers} from "redux";

import {FETCH_SERVER_CONFIG, FETCH_SERVER_INFO} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

const serverInfoReducer = makeGenericNetworkReducer(
  FETCH_SERVER_INFO,
  undefined,
  undefined,
  undefined,
  undefined,
  false,
);

const serverConfigReducer = makeGenericNetworkReducer(
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

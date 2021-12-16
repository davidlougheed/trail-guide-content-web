// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021  David Lougheed
// See NOTICE for more information.

import {ADD_RELEASE, FETCH_RELEASES, UPDATE_RELEASE} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";

export default makeGenericNetworkReducer(FETCH_RELEASES, ADD_RELEASE, UPDATE_RELEASE, "version");

// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

import {ADD_PAGE, FETCH_PAGES, UPDATE_PAGE} from "./actions";
import {makeGenericNetworkReducer} from "../../utils";
import {Page} from "./types";

export default makeGenericNetworkReducer<Page>(FETCH_PAGES, ADD_PAGE, UPDATE_PAGE);

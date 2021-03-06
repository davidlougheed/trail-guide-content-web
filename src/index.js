// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import "./wdyr";

import React from "react";
import {render} from "react-dom";

import {applyMiddleware, createStore} from "redux";
import thunkMiddleware from "redux-thunk";

import {Provider} from "react-redux";
import {Auth0Provider} from "@auth0/auth0-react";
import {BrowserRouter} from "react-router-dom";

import {AUTH_AUDIENCE, AUTH_DOMAIN, AUTH_CLIENT_ID} from "./config";
import rootReducer from "./reducers";
import App from "./components/App";

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

document.addEventListener("DOMContentLoaded", () => render(
  <Provider store={store}>
    <Auth0Provider domain={AUTH_DOMAIN}
                   clientId={AUTH_CLIENT_ID}
                   redirectUri={window.location.origin}
                   audience={AUTH_AUDIENCE}
                   scope="read:content manage:content">
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Auth0Provider>
  </Provider>,
  document.getElementById("root")
));

// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2024  David Lougheed
// See NOTICE for more information.

// import "./wdyr";

import React from "react";
import {createRoot} from "react-dom/client";

import {Provider} from "react-redux";
import {Auth0Provider} from "@auth0/auth0-react";
import {BrowserRouter} from "react-router-dom";

import {AUTH_AUDIENCE, AUTH_DOMAIN, AUTH_CLIENT_ID} from "./config";
import {store} from "./store";
import App from "./components/App";

document.addEventListener("DOMContentLoaded", () => {
  const root = createRoot(document.getElementById("root"));

  root.render(
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
    </Provider>
  );
});

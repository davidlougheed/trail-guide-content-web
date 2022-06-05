// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import {message} from "antd";
import proj4 from "proj4";

import {AUTH_AUDIENCE, API_BASE_URL} from "./config";

export const ACCESS_TOKEN_READ = {
  audience: AUTH_AUDIENCE,
  scope: "read:content",
};

export const ACCESS_TOKEN_MANAGE = {
  audience: AUTH_AUDIENCE,
  scope: "manage:content",
};

export const fetchOtt = async accessToken => {
  const req = await fetch(`${API_BASE_URL}/ott`, {
    method: "POST",
    headers: {"Authorization": `Bearer ${accessToken}`},
  });

  if (req.ok) {
    return await req.json();
  } else {
    console.error("Failed to get OTT", req);
  }
};

export const downloadVersionBundle = (version, isAuthenticated, getAccessTokenSilently) => async () => {
  if (!isAuthenticated) return;

  const accessToken = await getAccessTokenSilently({
    audience: AUTH_AUDIENCE,
    scope: "read:content",
  });

  /**
   * @type {{token: string}|undefined}
   */
  const ott = await fetchOtt(accessToken);

  if (!ott) return;
  window.location.href = `${API_BASE_URL}/releases/${version ?? ""}/bundle?ott=${ott.token}`;
};

export const assetIdToBytesUrl = assetId => `${API_BASE_URL}/assets/${assetId}/bytes`;

export const networkActionTypes = name => ({
  REQUEST: `${name}.REQUEST`,
  RECEIVE: `${name}.RECEIVE`,
  ERROR: `${name}.ERROR`,
});

export const networkAction = (types, url, method = "GET", multipart = false) =>
  (body = {}, params = {}, accessToken = "") => async dispatch => {
    await dispatch({params, type: types.REQUEST});

    const authHeaders = accessToken === "" ? {} : {
      "Authorization": `Bearer ${accessToken}`,
    };

    const urlParams = Object.keys(params).length ? new URLSearchParams(params) : null;

    try {
      const r = await fetch(API_BASE_URL + url + (urlParams ? `?${urlParams.toString()}` : ""),
        {
          method,
          ...(multipart ? {
            // Don't set content type manually for uploading multipart/form-data
            headers: authHeaders,
            body,
          } : {
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            ...(Object.keys(body).length ? {body: JSON.stringify(body)} : {}),
          }),
        });

      const data = await r.json();

      if (r.ok) {
        dispatch({type: types.RECEIVE, data, params});
        return {error: false, data};
      } else {
        const err = `Request to ${url} encountered error status: ${data.message}`;
        message.error(err);
        dispatch({
          params,
          type: types.ERROR,
          message: err,
        });
        return {error: true, message: err};
      }
    } catch (error) {
      const err = `Request to ${url} encountered thrown error: ${error.toString()}`;
      message.error(err);
      dispatch({type: types.ERROR, message: err});
      return {error: true, message: err};
    }
  };

export const makeIfNeededAction = (action, reducer) => (...args) => (dispatch, getState) => {
  if (getState()[reducer]?.isFetching) return;
  return dispatch(action(...args));
};

export const makeGenericNetworkReducer = (
  fetchTypes,
  addTypes=undefined,
  updateTypes=undefined,
  idKey="id",
  isArrayData=true,
) => (
  state = {
    isFetching: false,
    isAdding: false,
    isUpdating: false,
    ...(isArrayData ? {items: []} : {data: null}),
    error: "",
  },
  action,
) => {
  switch (action.type) {
    case fetchTypes.REQUEST:
      return {...state, isFetching: true};
    case fetchTypes.RECEIVE:
      return {
        ...state,
        isFetching: false,
        ...(isArrayData
          ? {items: action.data}
          : {data: action.data}
        ),
        error: "",
      };
    case fetchTypes.ERROR:
      return {...state, isFetching: false, error: action.message};
  }

  if (addTypes) {
    switch (action.type) {
      case addTypes.REQUEST:
        return {...state, isAdding: true};
      case addTypes.RECEIVE:
        return {
          ...state,
          isAdding: false,
          ...(isArrayData
            ? {items: [...state.items, action.data]}
            : {data: action.data}
          ),
          error: "",
        };
      case addTypes.ERROR:
        return {...state, isAdding: false, error: action.message};
    }
  }

  if (updateTypes) {
    switch (action.type) {
      case updateTypes.REQUEST:
        return {...state, isUpdating: true};
      case updateTypes.RECEIVE:
        return {
          ...state,
          isUpdating: false,
          ...(isArrayData
            ? {items: state.items.map(i => i[idKey] === action.data[idKey] ? action.data : i)}
            : {data: action.data}
          ),
          error: "",
        };
      case updateTypes.ERROR:
        return {...state, isUpdating: false, error: action.message};
    }
  }

  return state;
};


export const findItemByID = (items, id, idKey="id") =>
  items.find(obj => obj[idKey].toString() === id.toString());


// TODO: Dedup with app
export const transformCoords = ({zone, east, north}) => {
  const [longitude, latitude] = proj4(
    `+proj=utm +zone=${zone}`,
    "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
    [east, north]
  );

  return {longitude, latitude};
};

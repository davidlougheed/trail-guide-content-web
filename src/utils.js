// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React from "react";

import {message} from "antd";
import proj4 from "proj4";

import {AUTH_AUDIENCE, API_BASE_URL} from "./config";

export const id = x => x;
export const nop = () => {};
export const getFalse = () => false;

export const timestampToString = timestamp => timestamp ? (new Date(timestamp)).toLocaleString() : undefined;

export const detailTitle = (prefix, titleProp) => (obj, initialFetchDone, isFetching) =>
  (!initialFetchDone && isFetching)
    ? "Loading..."
    : (obj
      ? <span>{prefix ? `${prefix}: ${obj?.[titleProp]}` : obj?.[titleProp]}</span>
      : `${prefix} not found`);

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

    const urlParams = method === "GET" ? (Object.keys(params).length ? new URLSearchParams(params) : null) : null;

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
  if (
    getState()[reducer]?.isFetching ||
    getState()[reducer]?.isAdding ||
    getState()[reducer]?.isUpdating ||
    getState()[reducer]?.isDeleting
  ) return;
  return dispatch(action(...args));
};

export const makeGenericNetworkReducer = (
  fetchTypes,
  addTypes=undefined,
  updateTypes=undefined,
  deleteTypes=undefined,
  idKey="id",
  isArrayData=true,
) => (
  state = {
    initialFetchDone: false,
    isFetching: false,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
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
        initialFetchDone: true,
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

  if (deleteTypes) {
    switch (action.type) {
      case deleteTypes.REQUEST:
        return {...state, isDeleting: true};
      case deleteTypes.RECEIVE:
        return {
          ...state,
          isDeleting: false,
          ...(isArrayData
              ? {items: state.items.filter(i => i[idKey] !== action.params.id)}
              : {data: null}
          ),
          error: "",
        };
      case deleteTypes.ERROR:
        return {...state, isDeleting: false, error: action.message};
    }
  }

  return state;
};


export const findItemByID = (items, id, idKey="id") =>
  items.find(obj => obj[idKey].toString() === id.toString());


// TODO: Dedup with app
export const transformCoords = ({zone, east, north, crs="WGS84"}) => {
  const [longitude, latitude] = proj4(
    `+proj=utm +zone=${zone}`,
    `+proj=longlat +ellps=${crs} +datum=${crs} +no_defs`,
    [east, north]
  );

  return {longitude, latitude};
};

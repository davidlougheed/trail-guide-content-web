// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

import React from "react";
import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";

import {message} from "antd";
import proj4 from "proj4";

import {AUTH_AUDIENCE, API_BASE_URL} from "./config";
import {RootState} from "./store";
import {UTMCoordinates} from "./modules/stations/types";

export const id = <T,>(x: T) => x;
export const nop = () => {};
export const getFalse = () => false;

export const timestampToString = (timestamp: string | undefined) =>
  timestamp ? (new Date(timestamp)).toLocaleString() : undefined;

export const detailTitle = (prefix: string, titleProp: string) =>
  (obj, initialFetchDone: boolean, isFetching: boolean): JSX.Element | string =>
    (!initialFetchDone && isFetching)
      ? "Loading..."
      : (obj
        ? <span>{prefix ? `${prefix}: ${obj?.[titleProp]}` : obj?.[titleProp]}</span>
        : `${prefix} not found`);

interface TGCSTokenOptions {
  audience: string;
  scope: "read:content" | "manage:content";
}

export const ACCESS_TOKEN_READ: TGCSTokenOptions = {
  audience: AUTH_AUDIENCE,
  scope: "read:content",
};

export const ACCESS_TOKEN_MANAGE: TGCSTokenOptions = {
  audience: AUTH_AUDIENCE,
  scope: "manage:content",
};

interface OTTResponse {
  token: string;
  scope: string;
  expiry: string;  // ISO datetime string
}

export const fetchOtt = async (accessToken: string): Promise<OTTResponse | null> => {
  const req = await fetch(`${API_BASE_URL}/ott`, {
    method: "POST",
    headers: {"Authorization": `Bearer ${accessToken}`},
  });

  if (req.ok) {
    return await req.json();
  } else {
    console.error("Failed to get OTT", req);
    return null;
  }
};

export const fetchRevision = (objectsType: string) =>
  async (objectID: string, revisionID: number, accessToken: string): Promise<object | null> => {
    const req = await fetch(`${API_BASE_URL}/${objectsType}/${objectID}/revision/${revisionID}`, {
      headers: {"Authorization": `Bearer ${accessToken}`},
    });

    if (req.ok) {
      return await req.json();
    } else {
      console.error("Failed to get revision", req);
      return null;
    }
  };
export const fetchStationRevision = fetchRevision("stations");

export const downloadVersionBundle = (version: number, isAuthenticated: boolean, getAccessTokenSilently) =>
  async () => {
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

export const assetIdToBytesUrl = (assetId: string): string => `${API_BASE_URL}/assets/${assetId}/bytes`;


interface NetworkActionTypes {
  REQUEST: string;
  RECEIVE: string;
  ERROR: string;
}

export const networkActionTypes = (name: string): NetworkActionTypes => ({
  REQUEST: `${name}.REQUEST`,
  RECEIVE: `${name}.RECEIVE`,
  ERROR: `${name}.ERROR`,
});


export interface NetworkActionResponse<T> {
  error: boolean;
  data?: T;
  message?: string;
}

export const networkAction = <ReturnType, BodyType = {}>(
  types: NetworkActionTypes,
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
) => (
  body: BodyType,
  params: Record<string, string> = {},
  accessToken: string = "",
): ThunkAction<Promise<NetworkActionResponse<ReturnType>>, RootState, unknown, AnyAction> =>
  async dispatch => {
    dispatch({params, type: types.REQUEST});

    const authHeaders = accessToken === "" ? {} : {
      "Authorization": `Bearer ${accessToken}`,
    };

    const urlParams = method === "GET" ? (Object.keys(params).length ? new URLSearchParams(params) : null) : null;

    try {
      const r = await fetch(API_BASE_URL + url + (urlParams ? `?${urlParams.toString()}` : ""),
        {
          method,
          ...(body instanceof FormData ? {
            // Don't set content type manually for uploading multipart/form-data
            headers: authHeaders,
            body,
          } : {
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            ...(body && Object.keys(body).length ? {body: JSON.stringify(body)} : {}),
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

// TODO: proper types for reducer - keys of getState
export const makeIfNeededAction = <ReturnType,>(
  action: (...args: any[]) => ThunkAction<Promise<NetworkActionResponse<ReturnType>>, RootState, unknown, AnyAction>,
  reducer: string,
) => (...args): ThunkAction<Promise<NetworkActionResponse<ReturnType>>, RootState, unknown, AnyAction> =>
  (dispatch, getState) => {
    if (
      getState()[reducer]?.isFetching ||
      getState()[reducer]?.isAdding ||
      getState()[reducer]?.isUpdating ||
      getState()[reducer]?.isDeleting
    ) return;
    return dispatch(action(...args));
  };


export type GenericNetworkReducerState<DataType, IDType extends string | number = string> = {
  initialFetchDone: boolean;
  isFetching: boolean;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  // TODO: how to express items/data
  items?: DataType[];
  itemsByID?: Record<IDType, DataType>;
  data?: DataType | null;
  error: string;
}


// interface GenericNetworkReducerState {
//   initialFetchDone: boolean;
//   isFetching: boolean;
//   isAdding: boolean;
//   isUpdating: boolean;
//   isDeleting: boolean;
//   // TODO: how to express items/data
//   items?: object[];
//   data?: object;
//   error: string;
// }

export const makeGenericNetworkReducer = <DataType, IDType extends string | number = string>(
  fetchTypes: NetworkActionTypes,
  addTypes: NetworkActionTypes | undefined = undefined,
  updateTypes: NetworkActionTypes | undefined = undefined,
  deleteTypes: NetworkActionTypes | undefined = undefined,
  idKey: string = "id",
  isArrayData: boolean = true,
) => (
  state: GenericNetworkReducerState<DataType, IDType> = {
    initialFetchDone: false,
    isFetching: false,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
    ...(isArrayData ? {items: [], itemsByID: {} as Record<IDType, DataType>} : {data: null}),
    error: "",
  },
  action,
): GenericNetworkReducerState<DataType, IDType> => {
  switch (action.type) {
    case fetchTypes.REQUEST:
      return {...state, isFetching: true};
    case fetchTypes.RECEIVE:
      return {
        ...state,
        isFetching: false,
        initialFetchDone: true,
        ...(isArrayData
          ? (
            {
              items: action.data as DataType[],
              itemsByID: Object.fromEntries((action.data as DataType[]).map((d) => [d[idKey], d]))
            }
          ) : {data: action.data as DataType}
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
            ? (
              {
                items: [...state.items, action.data],
                itemsByID: {...state.itemsByID, [action.data[idKey]]: action.data },
              }
            ) : {data: action.data}
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
            ? (
              {
                items: state.items.map(i => i[idKey] === action.data[idKey] ? action.data : i),
                itemsByID: {...state.itemsByID, [action.data[idKey]]: action.data},
              }
            ) : {data: action.data}
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
              ? (
                {
                  items: state.items.filter(i => i[idKey] !== action.params.id),
                  itemsByID: Object.fromEntries(Object.entries(state.itemsByID)
                    .filter((e) => e[0] !== action.params.id)) as Record<IDType, DataType>,
                }
              ) : {data: null}
          ),
          error: "",
        };
      case deleteTypes.ERROR:
        return {...state, isDeleting: false, error: action.message};
    }
  }

  return state;
};


export const findItemByID = <Type,>(items: Type[], id: string | number, idKey: string = "id"): Type | undefined =>
  items.find(obj => (obj[idKey] ?? "").toString() === id.toString());


// TODO: Dedup with app

interface LongLat {
  longitude: number;
  latitude: number;
}

export const transformCoords = ({zone, east, north, crs="WGS84"}: UTMCoordinates): LongLat => {
  const [longitude, latitude] = proj4(
    `+proj=utm +zone=${zone}`,
    `+proj=longlat +ellps=${crs} +datum=${crs} +no_defs`,
    [east, north]
  );

  return {longitude, latitude};
};

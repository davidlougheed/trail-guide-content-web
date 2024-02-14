// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

export const API_BASE_URL: string | undefined = globalThis.GLOBAL_TGCW_CONFIG?.API_BASE_URL ||
  process.env.TGCW_API_BASE_URL;
export const APP_BASE_URL: string | undefined = globalThis.GLOBAL_TGCW_CONFIG?.APP_BASE_URL ||
  process.env.TGCW_APP_BASE_URL;
export const AUTH_AUDIENCE: string | undefined = globalThis.GLOBAL_TGCW_CONFIG?.AUTH_AUDIENCE ||
  process.env.TGCW_AUTH_AUDIENCE;
export const AUTH_DOMAIN: string | undefined = globalThis.GLOBAL_TGCW_CONFIG?.AUTH_DOMAIN ||
  process.env.TGCW_AUTH_DOMAIN;
export const AUTH_CLIENT_ID: string | undefined = globalThis.GLOBAL_TGCW_CONFIG?.AUTH_CLIENT_ID ||
  process.env.TGCW_AUTH_CLIENT_ID;

// A web interface to manage a trail guide mobile app's content and data.
// Copyright (C) 2021-2022  David Lougheed
// See NOTICE for more information.

export const BASE_URL = GLOBAL_TGCW_CONFIG?.BASE_URL || process.env.TGCW_BASE_URL;
export const AUTH_AUDIENCE = GLOBAL_TGCW_CONFIG?.AUTH_AUDIENCE || process.env.TGCW_AUTH_AUDIENCE;
export const AUTH_DOMAIN = GLOBAL_TGCW_CONFIG?.AUTH_DOMAIN || process.env.TGCW_AUTH_DOMAIN;
export const AUTH_CLIENT_ID = GLOBAL_TGCW_CONFIG?.AUTH_CLIENT_ID || process.env.TGCW_AUTH_CLIENT_ID;

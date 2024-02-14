export type ServerInfo = {
  version: string;
};

export type ServerConfig = {
  MAX_CONTENT_LENGTH: string;
  AUTH_AUDIENCE: string;
  AUTH_ISSUER: string;
  BASE_URL: string;
  APP_BASE_URL: string;
  APP_NAME: string;
  APP_SLUG: string;
  APPLE_APP_ID: string;
  ANDROID_PACKAGE_NAME: string;
  ANDROID_CERT_FINGERPRINT: string;
};

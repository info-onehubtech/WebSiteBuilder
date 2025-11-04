// src/config.js
console.log(`${process.env.NODE_ENV}`);
const NODE_ENV = process.env.REACT_APP_NODE_ENV;
const PRODUCTION_URL = process.env.REACT_APP_PRODUCTION_URL;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const API_BASE_URL =
  NODE_ENV === 'production' ? PRODUCTION_URL : BACKEND_URL;

const BASE_URL =
  process.env.NODE_ENV.trim() === "development"
    ? process.env.REACT_APP_API_URI_DEV
    : process.env.REACT_APP_API_URI;

export default BASE_URL;
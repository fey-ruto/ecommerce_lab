import axios from "axios";

// Decide baseURL. In CRA, env vars must start with REACT_APP_
const baseURL = "https://ecommerce-lab-z26a.vercel.app";

console.log(baseURL);

const http = axios.create({
  baseURL,
  withCredentials: true, // if you use cookies (auth)
});

// Log the FULL URL for every request
http.interceptors.request.use((config) => {
  const fullUrl = axios.getUri(config); // resolves baseURL + url + params
  console.debug("AXIOS →", (config.method || "get").toUpperCase(), fullUrl);
  return config;
});

export default http;

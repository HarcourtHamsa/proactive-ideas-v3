import axios from "axios";

const http = axios.create({
  // baseURL: "http://localhost:8000/api/",
  baseURL: "https://proactive-ideas-backup-6ef9825a1d26.herokuapp.com/api/",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-Requested-With, Content-Type",
  },
});

export default http;

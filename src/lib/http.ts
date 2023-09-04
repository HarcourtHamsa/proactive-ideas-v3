import axios from "axios";

const http = axios.create({
  // baseURL: "http://localhost:8000/api/",
  baseURL: 'https://shielded-cliffs-15232-110fd52a9c2c.herokuapp.com/api/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type'
  }
});

export default http;


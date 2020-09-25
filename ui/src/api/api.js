import axios from "axios";
import { handleResponse, handleError } from "./ApiUtils";

const baseUrl = process.env.REACT_APP_DEV_API_URL + "/api/";

export function authenticateApi(newInfo) {
  return axios
    .post(baseUrl + "authenticate", newInfo, {
      timeout: 5000,
    })
    .then(handleResponse)
    .catch(handleError);
}

export function checkTokenApi() {
  return axios
    .get(baseUrl + "checkToken", {
      method: "GET",
    })
    .then(handleResponse)
    .catch(handleError);
}

export function authenticateJudgeApi(newInfo) {
  return axios
    .post(baseUrl + "authenticateJudge", newInfo, {
      timeout: 5000,
    })
    .then(handleResponse)
    .catch(handleError);
}

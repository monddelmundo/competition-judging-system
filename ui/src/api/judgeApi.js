import axios from "axios";
import { handleResponse, handleError } from "./ApiUtils";

const baseUrl = process.env.REACT_APP_DEV_API_URL + "/judges/";

export function getJudgesApi() {
  return axios.get(baseUrl).then(handleResponse).catch(handleError);
}

export function getJudgeApi(id) {
  return axios
    .get(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function getJudgesEventApi(id) {
  return axios
    .get(`${baseUrl}event_id/${id}`)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteJudgeApi(id) {
  return axios
    .delete(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function createJudgeApi(newEvent) {
  return axios
    .post(baseUrl + "add", newEvent)
    .then(handleResponse)
    .catch(handleError);
}

export function updateJudgeApi(id, updatedEvent) {
  return axios
    .post(baseUrl + `update/${id}`, updatedEvent)
    .then(handleResponse)
    .catch(handleError);
}

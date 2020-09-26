import axios from "axios";
import { handleResponse, handleError } from "./ApiUtils";

const baseUrl = process.env.REACT_APP_DEV_API_URL + "/events/";

export function getEventsApi() {
  return axios.get(baseUrl).then(handleResponse).catch(handleError);
}

export function getEventApi(id) {
  return axios
    .get(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteEventApi(id) {
  return axios
    .delete(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function createEventApi(newEvent) {
  return axios
    .post(baseUrl + "add", newEvent)
    .then(handleResponse)
    .catch(handleError);
}

export function updateEventApi(id, updatedEvent) {
  return axios
    .post(baseUrl + `update/${id}`, updatedEvent)
    .then(handleResponse)
    .catch(handleError);
}

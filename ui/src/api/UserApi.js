import axios from "axios";
import { handleResponse, handleError } from "./ApiUtils";

const baseUrl = process.env.REACT_APP_DEV_API_URL + "/users/";

export function getUsersApi() {
  return axios.get(baseUrl).then(handleResponse).catch(handleError);
}

export function getUserApi(id) {
  return axios
    .get(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteUserApi(id) {
  return axios
    .delete(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function createUserApi(newEvent) {
  return axios
    .post(baseUrl + "add", newEvent)
    .then(handleResponse)
    .catch(handleError);
}

export function updateUserApi(id, updatedEvent) {
  return axios
    .post(baseUrl + `update/${id}`, updatedEvent)
    .then(handleResponse)
    .catch(handleError);
}

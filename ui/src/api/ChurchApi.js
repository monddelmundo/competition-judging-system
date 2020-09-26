import axios from "axios";
import { handleResponse, handleError } from "./ApiUtils";

const baseUrl = process.env.REACT_APP_DEV_API_URL + "/churches/";

export function getChurchesApi() {
  return axios.get(baseUrl).then(handleResponse).catch(handleError);
}

export function getChurchApi(id) {
  return axios
    .get(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function getChurchIDNumberNameApi() {
  return axios
    .get(`${baseUrl}getIDNumberName`)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteChurchApi(id) {
  return axios
    .delete(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function createChurchApi(newEvent) {
  return axios
    .post(baseUrl + "add", newEvent)
    .then(handleResponse)
    .catch(handleError);
}

export function updateChurchApi(id, updatedEvent) {
  return axios
    .post(baseUrl + `update/${id}`, updatedEvent)
    .then(handleResponse)
    .catch(handleError);
}

export function createParticipantApi(id, newParticipant) {
  return axios
    .post(baseUrl + `${id}/add`, newParticipant)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteParticipantApi(churchID, participantID) {
  return axios
    .delete(baseUrl + `${churchID}/delete/${participantID}`)
    .then(handleResponse)
    .catch(handleError);
}

export function updateParticipantApi(
  churchID,
  participantID,
  updatedParticipant
) {
  return axios
    .post(`${baseUrl}${churchID}/update/${participantID}`, updatedParticipant)
    .then(handleResponse)
    .catch(handleError);
}

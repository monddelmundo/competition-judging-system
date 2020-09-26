import axios from "axios";
import { handleResponse, handleError } from "./ApiUtils";

const baseUrl = process.env.REACT_APP_DEV_API_URL + "/competitions/";

export function getCompetitionsApi() {
  return axios.get(baseUrl).then(handleResponse).catch(handleError);
}

export function getCompetitionApi(id) {
  return axios
    .get(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function getCompetitionsEventApi(eventID) {
  return axios
    .get(`${baseUrl}event_id/${eventID}`)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteCompetitionApi(id) {
  return axios
    .delete(baseUrl + id)
    .then(handleResponse)
    .catch(handleError);
}

export function createCompetitionApi(newCompetition) {
  return axios
    .post(baseUrl + "add", newCompetition)
    .then(handleResponse)
    .catch(handleError);
}

export function updateCompetitionApi(id, updatedEvent) {
  return axios
    .post(baseUrl + `update/${id}`, updatedEvent)
    .then(handleResponse)
    .catch(handleError);
}

export function getCriteriaApi(compID, criteriaID) {
  return axios
    .get(`${baseUrl}${compID}/criteria_id/${criteriaID}`)
    .then(handleResponse)
    .catch(handleError);
}

export function createCriteriaApi(id, newCriteria) {
  return axios
    .post(baseUrl + `${id}/add`, newCriteria)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteCriteriaApi(compID, criteriaID) {
  return axios
    .delete(baseUrl + `${compID}/delete/${criteriaID}`)
    .then(handleResponse)
    .catch(handleError);
}

export function updateCriteriaApi(compID, criteriaID, updatedCriteria) {
  return axios
    .post(`${baseUrl}${compID}/update/${criteriaID}`, updatedCriteria)
    .then(handleResponse)
    .catch(handleError);
}

export function getScoresheetsApi(eventID) {
  return axios
    .get(`${baseUrl}/scoresheet/${eventID}`)
    .then(handleResponse)
    .catch(handleError);
}

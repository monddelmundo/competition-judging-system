import * as types from "./ActionTypes";
import {
  createChurchApi,
  getChurchesApi,
  deleteChurchApi,
  updateChurchApi,
  createParticipantApi,
  deleteParticipantApi,
  updateParticipantApi,
} from "../../api/ChurchApi";

export function loadChurchesAction(dispatch) {
  dispatch({ type: types.BEGIN_API_CALL });
  return getChurchesApi()
    .then((res) => {
      dispatch({
        type: types.LOAD_CHURCHES_SUCCESS,
        churches: res.data,
      });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function addChurchAction(dispatch, newComp) {
  dispatch({ type: types.BEGIN_API_CALL });
  return createChurchApi(newComp)
    .then((res) => {
      dispatch({ type: types.ADD_CHURCH_SUCCESS, church: res.data });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function deleteChurchAction(dispatch, id) {
  dispatch({ type: types.BEGIN_API_CALL });
  return deleteChurchApi(id)
    .then(() => dispatch({ type: types.DELETE_CHURCH_SUCCESS, id }))
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function editChurchAction(dispatch, _id, updatedComp) {
  dispatch({ type: types.BEGIN_API_CALL });
  return updateChurchApi(_id, updatedComp)
    .then(() => {
      dispatch({
        type: types.EDIT_CHURCH_SUCCESS,
        church: { _id, ...updatedComp },
      });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function deleteParticipantAction(dispatch, churchID, participantID) {
  dispatch({ type: types.BEGIN_API_CALL });
  return deleteParticipantApi(churchID, participantID)
    .then(() =>
      dispatch({
        type: types.DELETE_PARTICIPANT_SUCCESS,
        churchID,
        participantID,
      })
    )
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function addParticipantAction(
  dispatch,
  churchID,
  newParticipant,
  maxNoOfPerson
) {
  console.log("Participant Action:", newParticipant, maxNoOfPerson);
  dispatch({ type: types.BEGIN_API_CALL });
  return createParticipantApi(churchID, newParticipant, maxNoOfPerson)
    .then((res) => {
      dispatch({
        type: types.ADD_PARTICIPANT_SUCCESS,
        churchID,
        participant: res.data.participants[res.data.participants.length - 1],
      });

      return Promise.resolve(res);
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function editParticipantAction(
  dispatch,
  churchID,
  participantID,
  updatedParticipant
) {
  dispatch({ type: types.BEGIN_API_CALL });
  return updateParticipantApi(churchID, participantID, updatedParticipant)
    .then((res) => {
      dispatch({
        type: types.EDIT_PARTICIPANT_SUCCESS,
        churchID,
        participantID,
        participant: { _id: participantID, ...updatedParticipant },
      });

      return Promise.resolve(res);
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

import * as types from "./ActionTypes";
import {
  createEventApi,
  getEventsApi,
  deleteEventApi,
  updateEventApi,
} from "../../api/EventApi";

export function loadEventsAction(dispatch) {
  dispatch({ type: types.BEGIN_API_CALL });
  return getEventsApi()
    .then((res) => {
      dispatch({ type: types.LOAD_EVENTS_SUCCESS, events: res.data });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function deleteEventAction(dispatch, id) {
  dispatch({ type: types.BEGIN_API_CALL });
  return deleteEventApi(id)
    .then(() => dispatch({ type: types.DELETE_EVENT_SUCCESS, id }))
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function addEventAction(dispatch, newEvent) {
  dispatch({ type: types.BEGIN_API_CALL });
  return createEventApi(newEvent)
    .then((res) => {
      dispatch({ type: types.ADD_EVENT_SUCCESS, event: res.data });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function editEventAction(dispatch, _id, updatedEvent) {
  dispatch({ type: types.BEGIN_API_CALL });
  return updateEventApi(_id, updatedEvent)
    .then(() => {
      dispatch({
        type: types.EDIT_EVENT_SUCCESS,
        event: { _id, ...updatedEvent },
      });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

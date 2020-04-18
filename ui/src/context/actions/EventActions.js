import React, { useContext } from "react";
import axios from "axios";
import * as types from "./ActionTypes";
import { store } from "../../context/Store";
import { getEventsApi, deleteEventApi } from "../../api/EventApi";

export function loadEventsAction(dispatch) {
  return getEventsApi().then((res) => {
    dispatch({ type: types.LOAD_EVENTS_SUCCESS, events: res.data });
  });
}

export function deleteEventAction(dispatch, id) {
  return deleteEventApi(id).then(() => {
    dispatch({ type: types.DELETE_EVENT_SUCCESS, id });
  });
}

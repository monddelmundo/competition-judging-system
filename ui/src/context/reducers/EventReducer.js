import initialState from "./InitialState";
import * as types from "../actions/ActionTypes";

export default function eventReducer(state = initialState.events, action) {
  switch (action.type) {
    case types.ADD_EVENT_SUCCESS:
      return [...state, { ...action.event }];
    case types.LOAD_EVENTS_SUCCESS:
      return action.events;
    case types.EDIT_EVENT_SUCCESS:
      return state.map((event) =>
        event._id === action.event._id ? action.event : event
      );
    case types.DELETE_EVENT_SUCCESS:
      return state.filter((event) => event._id !== action.id);
    default:
      return state;
  }
}

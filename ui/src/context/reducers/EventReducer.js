import initialState from "./InitialState";
import * as types from "../actions/ActionTypes";

export default function eventReducer(state = initialState.events, action) {
  switch (action.type) {
    case types.LOAD_EVENTS_SUCCESS:
      return action.events;
    case types.DELETE_EVENT_SUCCESS:
      return state.filter((event) => event._id !== action.id);
    default:
      return state;
  }
}

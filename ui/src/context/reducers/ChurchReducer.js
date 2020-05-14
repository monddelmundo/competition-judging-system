import initialState from "./InitialState";
import * as types from "../actions/ActionTypes";

export default function churchReducer(state = initialState.churches, action) {
  switch (action.type) {
    case types.ADD_CHURCH_SUCCESS:
      return [...state, { ...action.church }];
    case types.LOAD_CHURCHES_SUCCESS:
      return action.churches;
    case types.EDIT_CHURCH_SUCCESS:
      return state.map((church) =>
        church._id === action.church._id ? action.church : church
      );
    case types.DELETE_CHURCH_SUCCESS:
      return state.filter((church) => church._id !== action.id);
    case types.DELETE_PARTICIPANT_SUCCESS:
      return state.map((church) => {
        if (church._id === action.churchID) {
          let updated = { ...church };
          updated.participants = updated.participants.filter(
            (participant) => participant._id !== action.participantID
          );
          return updated;
        } else {
          return church;
        }
      });
    default:
      return state;
  }
}

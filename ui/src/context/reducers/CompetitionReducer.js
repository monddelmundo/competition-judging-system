import initialState from "./InitialState";
import * as types from "../actions/ActionTypes";

export default function competitionReducer(
  state = initialState.competitions,
  action
) {
  switch (action.type) {
    case types.ADD_COMPETITION_SUCCESS:
      return [...state, { ...action.competition }];
    case types.LOAD_COMPETITIONS_SUCCESS:
      return action.competitions;
    case types.EDIT_COMPETITION_SUCCESS:
      return state.map((competition) =>
        competition._id === action.competition._id
          ? action.competition
          : competition
      );
    case types.DELETE_COMPETITION_SUCCESS:
      return state.filter((competition) => competition._id !== action.id);
    default:
      return state;
  }
}

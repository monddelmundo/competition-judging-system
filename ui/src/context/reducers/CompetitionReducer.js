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
    case types.DELETE_CRITERIA_SUCCESS:
      //return state.filter((competition) => competition._id !== action.id);
      return state.map((competition) => {
        if (competition._id === action.compId) {
          let updated = { ...competition };
          updated.criterias = updated.criterias.filter(
            (criteria) => criteria._id !== action.critId
          );
          return updated;
        } else {
          return competition;
        }
      });
    case types.EDIT_CRITERIA_SUCCESS:
      return state.map((competition) => {
        if (competition._id === action.compId) {
          let updated = { ...competition };
          updated.criterias = updated.criterias.map((criteria) =>
            criteria._id === action.critId ? action.criteria : criteria
          );
          return updated;
        } else {
          return competition;
        }
      });
    case types.ADD_CRITERIA_SUCCESS:
      return state.map((competition) => {
        if (competition._id === action.compId) {
          let updated = { ...competition };
          updated.criterias = updated.criterias.concat(action.criteria);
          return updated;
        } else {
          return competition;
        }
      });
    default:
      return state;
  }
}

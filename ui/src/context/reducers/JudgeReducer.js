import initialState from "./InitialState";
import * as types from "../actions/ActionTypes";

export default function judgeReducer(state = initialState.judges, action) {
  switch (action.type) {
    case types.ADD_JUDGE_SUCCESS:
      return [...state, { ...action.judge }];
    case types.LOAD_JUDGES_SUCCESS:
      return action.judges;
    case types.EDIT_JUDGE_SUCCESS:
      return state.map((judge) =>
        judge._id === action.judge._id ? action.judge : judge
      );
    case types.DELETE_JUDGE_SUCCESS:
      return state.filter((judge) => judge._id !== action.id);
    default:
      return state;
  }
}

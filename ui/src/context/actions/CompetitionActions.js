import * as types from "./ActionTypes";
import {
  createCompetitionApi,
  getCompetitionsApi,
  deleteCompetitionApi,
  updateCompetitionApi,
} from "../../api/CompetitionApi";

export function loadCompetitionsAction(dispatch) {
  dispatch({ type: types.BEGIN_API_CALL });
  return getCompetitionsApi()
    .then((res) => {
      dispatch({
        type: types.LOAD_COMPETITIONS_SUCCESS,
        competitions: res.data,
      });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function addCompetitionAction(dispatch, newComp) {
  return createCompetitionApi(newComp).then((res) => {
    dispatch({ type: types.ADD_COMPETITION_SUCCESS, competition: res.data });
  });
}

export function deleteCompetitionAction(dispatch, id) {
  return deleteCompetitionApi(id).then(() =>
    dispatch({ type: types.DELETE_COMPETITION_SUCCESS, id })
  );
}

export function editCompetitionAction(dispatch, _id, updatedComp) {
  return updateCompetitionApi(_id, updatedComp).then(() => {
    dispatch({
      type: types.EDIT_COMPETITION_SUCCESS,
      competition: { _id, ...updatedComp },
    });
  });
}

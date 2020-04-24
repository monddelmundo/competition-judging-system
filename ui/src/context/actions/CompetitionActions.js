import * as types from "./ActionTypes";
import {
  createCompetitionApi,
  getCompetitionsApi,
  deleteCompetitionApi,
  updateCompetitionApi,
  deleteCriteriaApi,
  createCriteriaApi,
  updateCriteriaApi,
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
  dispatch({ type: types.BEGIN_API_CALL });
  return createCompetitionApi(newComp)
    .then((res) => {
      dispatch({ type: types.ADD_COMPETITION_SUCCESS, competition: res.data });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function deleteCompetitionAction(dispatch, id) {
  dispatch({ type: types.BEGIN_API_CALL });
  return deleteCompetitionApi(id)
    .then(() => dispatch({ type: types.DELETE_COMPETITION_SUCCESS, id }))
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function editCompetitionAction(dispatch, _id, updatedComp) {
  dispatch({ type: types.BEGIN_API_CALL });
  return updateCompetitionApi(_id, updatedComp)
    .then(() => {
      dispatch({
        type: types.EDIT_COMPETITION_SUCCESS,
        competition: { _id, ...updatedComp },
      });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function deleteCriteriaAction(dispatch, compId, critId) {
  dispatch({ type: types.BEGIN_API_CALL });
  return deleteCriteriaApi(compId, critId)
    .then(() =>
      dispatch({ type: types.DELETE_CRITERIA_SUCCESS, compId, critId })
    )
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function addCriteriaAction(dispatch, compId, newCriteria) {
  dispatch({ type: types.BEGIN_API_CALL });
  return createCriteriaApi(compId, newCriteria)
    .then((res) => {
      dispatch({
        type: types.ADD_CRITERIA_SUCCESS,
        compId,
        criteria: res.data.criterias[res.data.criterias.length - 1],
      });

      return Promise.resolve(res);
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function editCriteriaAction(dispatch, compId, critId, updatedCriteria) {
  dispatch({ type: types.BEGIN_API_CALL });
  return updateCriteriaApi(compId, critId, updatedCriteria)
    .then((res) => {
      dispatch({
        type: types.EDIT_CRITERIA_SUCCESS,
        compId,
        critId,
        criteria: { _id: critId, ...updatedCriteria },
      });

      return Promise.resolve(res);
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

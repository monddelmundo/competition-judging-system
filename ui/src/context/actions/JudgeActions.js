import * as types from "./ActionTypes";
import {
  createJudgeApi,
  getJudgesApi,
  deleteJudgeApi,
  updateJudgeApi,
} from "../../api/JudgeApi";

export function loadJudgesAction(dispatch) {
  dispatch({ type: types.BEGIN_API_CALL });
  return getJudgesApi()
    .then((res) => {
      dispatch({
        type: types.LOAD_JUDGES_SUCCESS,
        judges: res.data,
      });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function addJudgeAction(dispatch, newJudge) {
  dispatch({ type: types.BEGIN_API_CALL });
  return createJudgeApi(newJudge)
    .then((res) => {
      dispatch({ type: types.ADD_JUDGE_SUCCESS, judge: res.data });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function deleteJudgeAction(dispatch, id) {
  dispatch({ type: types.BEGIN_API_CALL });
  return deleteJudgeApi(id)
    .then(() => dispatch({ type: types.DELETE_JUDGE_SUCCESS, id }))
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

export function editJudgeAction(dispatch, _id, updatedJudge) {
  dispatch({ type: types.BEGIN_API_CALL });
  return updateJudgeApi(_id, updatedJudge)
    .then(() => {
      dispatch({
        type: types.EDIT_JUDGE_SUCCESS,
        judge: { _id, ...updatedJudge },
      });
    })
    .catch((err) => {
      dispatch({ type: types.API_CALL_ERROR });
      throw err;
    });
}

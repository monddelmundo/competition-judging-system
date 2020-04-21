import * as types from "./ActionTypes";

export function beginApiCall(dispatch) {
  return dispatch({ type: types.BEGIN_API_CALL });
}

export function apiCallError(dispatch) {
  return dispatch({ type: types.API_CALL_ERROR });
}

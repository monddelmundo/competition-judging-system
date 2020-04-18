import initialState from "./InitialState";

export default function userReducer(state = initialState.users, action) {
  switch (action.type) {
    case "SAMPLE_ACTION":
      const newState = [...action.users, { username: "Chelle" }];
      return newState;
    default:
      return state;
  }
}

import React, { createContext, useReducer, useEffect } from "react";
import useCombinedReducers from "use-combined-reducers";
import userReducer from "./reducers/UserReducer";
import eventReducer from "./reducers/EventReducer";
import competitionReducer from "./reducers/CompetitionReducer";
import judgeReducer from "./reducers/JudgeReducer";
import apiStatusReducer from "./reducers/ApiStatusReducer";
import initialState from "./reducers/InitialState";

const store = createContext({});
const { Provider } = store;

// const contextToLocalStorage = (action, value = "") => {
//   switch (action) {
//     case "get":
//       return localStorage.getItem("context");
//     case "set":
//       return localStorage.setItem("context", JSON.stringify(value));
//     case "del":
//       return localStorage.removeItem("context");
//     default:
//       return;
//   }
// };

// const localState = contextToLocalStorage("get")
//   ? JSON.parse(contextToLocalStorage("get"))
//   : initialState;

//reload other tabs when something changes
//on the local storage
// window.addEventListener(
//   "storage",
//   function () {
//     window.location.reload();
//   },
//   false
// );

const StateProvider = ({ children }) => {
  const [state, dispatch] = useCombinedReducers({
    apiCallsInProgress: useReducer(
      apiStatusReducer,
      initialState.apiCallsInProgress
    ),
    users: useReducer(userReducer, initialState.users),
    events: useReducer(eventReducer, initialState.events),
    competitions: useReducer(competitionReducer, initialState.competitions),
    judges: useReducer(judgeReducer, initialState.judges),
  });

  // useEffect(() => {
  //   contextToLocalStorage("set", { ...localState, ...state });
  // }, [state]);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };

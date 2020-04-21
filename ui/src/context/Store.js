import React, { createContext, useReducer } from "react";
import useCombinedReducers from "use-combined-reducers";
import userReducer from "./reducers/UserReducer";
import eventReducer from "./reducers/EventReducer";
import competitionReducer from "./reducers/CompetitionReducer";
import apiStatusReducer from "./reducers/ApiStatusReducer";
import initialState from "./reducers/InitialState";

const store = createContext({});
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useCombinedReducers({
    users: useReducer(userReducer, initialState.users),
    events: useReducer(eventReducer, initialState.events),
    competitions: useReducer(competitionReducer, initialState.competitions),
    apiCallsInProgress: useReducer(
      apiStatusReducer,
      initialState.apiCallsInProgress
    ),
  });

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };

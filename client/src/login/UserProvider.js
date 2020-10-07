import React, { createContext, useReducer } from "react";

let initialUser;
try {
  initialUser = JSON.parse(sessionStorage.getItem("gmm.user")) || {};
} catch {
  // Their session variable probably got messed up
  sessionStorage.removeItem("gmm.user");
  initialUser = {};
}
const userStore = createContext(initialUser);
const { Provider } = userStore;

export const LOGIN_SUCCESS = "login.success";
export const LOGOUT_SUCCESS = "logout.success";

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        const { user } = action.payload;
        sessionStorage.setItem("gmm.user", JSON.stringify(user));
        return action.payload;
      case LOGOUT_SUCCESS:
        sessionStorage.removeItem("gmm.user");
        return {};
      default:
        throw new Error();
    }
  }, initialUser);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { userStore, UserProvider };

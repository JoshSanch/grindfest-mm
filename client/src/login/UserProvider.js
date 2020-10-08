import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

let initialUser;
try {
  const token = localStorage.getItem("gmm.token");
  const user = jwtDecode(token);
  initialUser = {token, user};
} catch {
  // Their local variable probably got messed up
  localStorage.removeItem("gmm.token");
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
        const { token } = action.payload;
        localStorage.setItem("gmm.token", token);
        return action.payload;
      case LOGOUT_SUCCESS:
        localStorage.removeItem("gmm.token");
        return {};
      default:
        throw new Error();
    }
  }, initialUser);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { userStore, UserProvider };

import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoutes = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  return !currentUser ? (
    <Route {...rest}>{(props) => <Component {...props} />}</Route>
  ) : (
    <Redirect to="/" />
  );
};

export default PublicRoutes;

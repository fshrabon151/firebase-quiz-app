import React from "react";
import "../styles/App.css";
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <PublicRoutes exact path="/signup" component={Signup} />
            <PublicRoutes exact path="/login" component={Login} />
            <PrivateRoutes exact path="/quiz/:id" component={Quiz} />
            <PrivateRoutes exact path="/result/:id" component={Result} />
          </Switch>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;

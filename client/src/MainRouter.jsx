
import React from "react";
import {
  createBrowserHistory
} from "history";
import {
  Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import PrivateRoute from "components/Auth/PrivateRoute"

import HomeLayout from "layouts/Home";
import LoginPage from "layouts/Login"
import SignUpPage from "layouts/SignUp"

const history = createBrowserHistory();

const mainRouter = () => (
  <Router history = { history }>
    <Switch>
      <Route path = "/login" render = { props => <LoginPage { ...props }/>}/>
      <Route path = "/signup" render = { props => <SignUpPage { ...props }/>}/>
      <PrivateRoute path = "/home" component = { props => <HomeLayout { ...props }/>}/>
      <Redirect from = "/" to = "/home/main"/>
    </Switch>
  </Router>
);

export default mainRouter;
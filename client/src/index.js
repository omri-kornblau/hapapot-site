import React from "react";
import ReactDOM from "react-dom";
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

import "assets/scss/black-dashboard-react.scss";
import "assets/css/custom-grid.css";
import "assets/css/main.css";
import "assets/css/nucleo-icons.css";

const history = createBrowserHistory();

ReactDOM.render( <
    Router history = {
      history
    } >
    <
    Switch >
    <
    Route path = "/login"
    render = {
      props => < LoginPage {
        ...props
      }
      />} / >
      <
      Route path = "/signup"
      render = {
        props => < SignUpPage {
          ...props
        }
        />} / >
        <
        PrivateRoute path = "/home"
        component = {
          props => < HomeLayout {
            ...props
          }
          />} / >
          <
          Redirect from = "/"
          to = "/home" / >
          <
          /Switch> < /
          Router > ,
          document.getElementById("root")
        );
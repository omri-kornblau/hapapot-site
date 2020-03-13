import React from "react";
import { Route, Redirect } from "react-router";

import Auther from "../../requests/authentication";

class PrivateRoute extends React.Component {
  state = {
    haveAccess: false,
    loadedData: false
  };

  componentDidMount() {
    this.checkToken();
  }

  checkToken = async () => {
    const isAuth = await Auther.checkToken();
    this.setState({
      haveAccess: isAuth,
      loadedData: true
    });
  };

  render() {
    const { loadedData, haveAccess } = this.state;
    const { component: Component } = this.props;
    if (!loadedData) {
      return null;
    }
    return (
      <Route
        render={props =>
          haveAccess ? <Component {...props} /> : <Redirect to="/login" />
        }
      />
    );
  }
}

export default PrivateRoute;

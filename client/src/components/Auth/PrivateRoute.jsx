import React from 'react';
import { Route, Redirect } from "react-router";

import Auther from '../../authentication';

class PrivateRoute extends Route {
  state = {
    haveAccess: false,
    loadedData: false
  }

  componentDidMount() {
    this.checkToken();
  }

  checkToken = async () => {
    const isAuth = await Auther.checkToken();
    this.setState({
      haveAccess: isAuth,
      loadedData: true
    });
  }

  render() {
    const { loadedData, haveAccess } = this.state;
    if (!loadedData) { return null }
    return (haveAccess ?
        this.props.component(this.props)
        : <Redirect to='/login' />
    );
  }
}

export default PrivateRoute
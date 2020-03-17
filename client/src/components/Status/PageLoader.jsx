import React from "react";
import Loader from "react-loader-spinner";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class PageLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: props.isLoading };
  }
  componentWillReceiveProps(props) {
    this.setState({ isLoading: props.isLoading })
  }

  render() {
    return (
    !this.state.isLoading ? this.props.children :
      <Loader
        type="TailSpin"
        color="#304ffe"
        className="text-center"
      />
    );
  }
}

export default PageLoader;
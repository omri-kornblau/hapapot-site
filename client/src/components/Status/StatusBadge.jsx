import React from "react";
import { Badge } from "reactstrap";

class StatusBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: props.success,
      show: props.show,
      message: props.message
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      show: props.show,
      success: props.success,
      message: props.message
    });
  }

  render() {
    return (
      this.state.show ?
      <Badge color={this.state.success ? "success" : "danger"}>
        {this.state.message}
      </Badge>
      : ""
    );
  }
}

export default StatusBadge;

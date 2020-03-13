import React from "react";
import { Badge } from "reactstrap";

class StatusBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = { success: props.success };
  }
  componentWillReceiveProps(props) {
    this.setState({ success: props.success });
  }

  render() {
    return (
      <Badge color={this.state.success ? "success" : "danger"}>
        {this.state.success ? "" : "נכשלת"}
      </Badge>
    );
  }
}

export default StatusBadge;

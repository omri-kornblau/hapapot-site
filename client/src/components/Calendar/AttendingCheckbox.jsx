import React from "react";
import {
  FormGroup,
  Input,
  Label
} from "reactstrap";
import _ from "lodash";

const defaultTexts = {
  attending: "אני מגיע ",
  absent: "אני מגיע ",
}

class AttendingCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.texts = props.texts || defaultTexts;
    this.state = { attending: props.attending };
  }
  componentWillReceiveProps(props) {
    this.setState({ attending: props.attending });
  }
  onAttendingChange = async e => {
    const { checked } = e.target;
    await this.props.onChange(checked);
  }

  render() {
    return (
      <FormGroup check>
        <Label check>
          <p>{this.state.attending ? this.texts.attending : this.texts.absent}</p>
          <Input
            onChange={this.onAttendingChange}
            checked={this.state.attending}
            name="attending"
            type="checkbox"
          />
          <span className="form-check-sign">
            <span className="check" />
          </span>
        </Label>
      </FormGroup>
    );
  }
}

export default AttendingCheckbox
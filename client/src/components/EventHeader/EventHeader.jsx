import _ from "lodash";
import React from "react";
import {
  Row,
  Button,
  Input,
  Col
} from "reactstrap"
import Utils from "../../utils"
import DatePicker from "../Calendar/CustomDatePicker";

const readMoreTexts = {
  more: "קרא עוד",
  less: "קרא פחות"
};

class EventHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name : props.name,
        time: props.time,
        description: props.description,
        date: props.date,
      },
      isReadMore: false,
      isEditMode: false,
      edit: {},
      error: ""
    };

    this.updateEvent = props.updateEvent;

    this.shortDescriptionLength = props.shortDescriptionLength ? props.shortDescriptionLength : 50;
  }
  componentWillReceiveProps(props) {
    this.setState({
      data: {
        name : props.name,
        time: props.time,
        description: props.description,
        date: props.date
      }
    });
  }
  goToDay = () => {
    this.props.history.push(`/home/day/${this.state.data.date}`);
  }
  toggleReadMore = () => {
    this.setState({ isReadMore: !this.state.isReadMore });
  }
  renderDescription = () => {
    if (this.state.data.description.length < this.shortDescriptionLength) {
      return (
        <p className="m-0 event-description">{this.state.data.description}</p>
      );
    }

    const currentDescription = this.state.isReadMore ? (
      this.state.data.description
    ) : (
      this.state.data.description.slice(0, this.shortDescriptionLength)
    );
    const readMoreText = this.state.isReadMore ? readMoreTexts.less : readMoreTexts.more;

    return (
      <>
        <p className="m-0 event-description">
          {currentDescription}
        </p>
        <p onClick={this.toggleReadMore} className="text-primary m-0">
          {readMoreText}
        </p>
      </>
    )
  }
  onInputChange = event => {
    const newData = this.state.edit;
    const { value, name } = event.target;
    newData[name] = value;
    this.setState({edit: newData});
  };
  onTimeChange = time => {
    const newData = this.state.edit;
    newData.time = time;
    this.setState({ edit: newData });
  }
  onDateChange = date => {
    const newData = this.state.edit;
    newData.date = date;
    this.setState({ edit: newData });
  }
  enterEditMode = () => {
    const edit = _.cloneDeep(this.state.data);
    this.setState({
      isEditMode: true,
      edit
    });
  }
  saveEdit = async () => {
    const { name, date, time, description } = this.state.edit;
    if (await this.updateEvent(name, date, time, description)) {
      this.setState({ isEditMode: false, error: "" });
    } else {
      this.setState({ error: "Failed to update event"});
    }
  }
  cancelEdit = () => {
    this.setState({ isEditMode: false });
  }

  render() {
    if (this.state.isEditMode) {
      return (
        <div className="text-center title">
          <Row className="justify-content-center">
            <Button onClick={this.cancelEdit} className="btn-icon btn-round" color="link">
              <i className="text-danger tim-icons icon-simple-remove"/>
            </Button>
            <Button onClick={this.saveEdit} className="btn-icon btn-round mr-3" color="success">
              <i className="tim-icons icon-check-2"/>
            </Button>
          </Row>
          {this.state.error !== "" ? <p style={{color: "red"}}>{this.state.error}</p> : <></>}
          <Row>
            <Col>
              <Input onChange={this.onInputChange} name="name" value={this.state.edit.name}/>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <DatePicker
                onChange={this.onTimeChange}
                value={Utils.formatTime(this.state.edit.time)}
                showTimeSelect
                showTimeSelectOnly
                timeCaption="שעה"
              />
            </Col>
            <Col xs="6">
              <DatePicker
                onChange={this.onDateChange}
                value={Utils.formatDate(this.state.edit.date)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
            <Input type="textarea" onChange={this.onInputChange} name="description" value={this.state.edit.description}/>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div className="text-center title">
          <Row className="justify-content-center">
            <i className="tim-icons icon-pencil m-2" onClick={this.enterEditMode}/>
            <h3 className="m-1 justify-content-center">
              {this.state.data.name}
            </h3>
          </Row>
          <h5 onClick={this.goToDay} className="m-1">
            {Utils.formatTime(this.state.data.time) + " - " + Utils.formatDate(this.state.data.time)}
          </h5>
          {this.renderDescription()}
        </div>
      );
    }
  }
}

export default EventHeader;

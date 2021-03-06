import _ from "lodash";
import React from "react";
import {
  Row,
  Button,
  Input,
  Form,
  Col,
  Jumbotron
} from "reactstrap"
import Linkify from 'react-linkify';

import Utils from "../../utils"
import DatePicker from "../Calendar/CustomDatePicker";
import AttendingCheckbox from "../Calendar/AttendingCheckbox";

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
        location: props.location
      },
      attending: props.attending,
      isReadMore: false,
      isEditMode: false,
      edit: {},
      error: ""
    };

    this.updateEvent = props.updateEvent;
    this.onAttendingChange = props.onAttendingChange

    this.shortDescriptionLength = props.shortDescriptionLength ? props.shortDescriptionLength : 50;
  }
  componentWillReceiveProps(props) {
    this.setState({
      data: {
        name : props.name,
        time: props.time,
        description: props.description,
        date: props.date,
        location: props.location,
      },
      attending: props.attending
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
        <Linkify className="m-0 event-description">
          <div className="m-0 event-description">
            {this.state.data.description}
          </div>
        </Linkify>
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
        <Linkify>
          <div className="m-0 event-description">
            {currentDescription}
            {this.state.isReadMore ? <br/> : "... "}
            <a onClick={this.toggleReadMore} className="text-info m-0">
              {readMoreText}
            </a>
          </div>
        </Linkify>
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
    const { name, date, time, description, location } = this.state.edit;
    if (await this.updateEvent(name, date, time, location, description)) {
      this.setState({ isEditMode: false, error: "" });
    } else {
      this.setState({ error: "Failed to update event"});
    }
  }
  cancelEdit = () => {
    this.setState({ isEditMode: false });
  }
  shareEvent = async () => {
    const messageBody =`שותפת באירוע ${this.state.data.name} ` +
    `באמצעות האתר של הפאפות:\n${this.state.data.description}`;

    await navigator.share({
      title: "Hapapot Site",
      url: window.location.href,
      text: messageBody
    });
  }

  render() {
    if (this.state.isEditMode) {
      return (
        <Jumbotron className="text-center">
          <Form>
            <Row className="justify-content-center mb-2">
              <Button onClick={this.cancelEdit} className="btn-icon btn-round" color="link">
                <i className="text-danger tim-icons icon-simple-remove"/>
              </Button>
              <Button onClick={this.saveEdit} className="btn-icon btn-round mr-3" color="success">
                <i className="tim-icons icon-check-2"/>
              </Button>
            </Row>
            {this.state.error !== "" ? <p className="text-danger">}>{this.state.error}</p> : <></>}
            <Row>
              <Col md="6">
                <Input
                  onChange={this.onInputChange}
                  name="name"
                  value={this.state.edit.name}
                  placeholder="הכנס שם"
                />
              </Col>
              <Col md="6">
                <Input
                  onChange={this.onInputChange}
                  className="mt-3"
                  name="location"
                  value={this.state.edit.location}
                  placeholder="הכנס מיקום"
                />
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
            <Input
              type="textarea"
              className="mt-1 mb-2"
              placeholder="הכנס תיאור"
              onChange={this.onInputChange}
              name="description"
              value={this.state.edit.description}
            />
          </Form>
        </Jumbotron>
      );
    } else {
      return (
        <div className="text-center">
          <h3 className="m-1">
            {this.state.data.name}
          </h3>
          <h5  className="m-1">
            {Utils.formatTime(this.state.data.time) + " - " + Utils.formatDate(this.state.data.time)}
              <i
                onClick={this.goToDay}
                className="mr-2 mb-1 tim-icons icon-minimal-left"
              />
          </h5>
          <h5 className="m-1">
            מיקום: {this.state.data.location}
          </h5>
          {this.renderDescription()}
          <Row className="justify-content-center mt-1 mb-3">
            <AttendingCheckbox
              onChange={this.onAttendingChange}
              attending={this.state.attending}
            />
            <Button
              onClick={this.enterEditMode}
              color="link"
              className="btn-icon btn-sm mddt-0 mr-4"
            >
              <i className="tim-icons icon-pencil text-black"/>
            </Button>
            { navigator.share ?
              <Button
                onClick={this.shareEvent}
                color="link"
                className="btn-icon btn-sm mr-1 ml-1"
              >
                <i className="tim-icons icon-forward"/>
              </Button>
              : ""
            }
          </Row>
        </div>
      );
    }
  }
}

export default EventHeader;

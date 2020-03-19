import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Input,
  Row,
  Col,
} from "reactstrap";

import Utils from "../utils";
import EventModel from "../defaults/models/event";
import mapError from "../defaults/errorsMapping";

import DatePicker from "../components/Calendar/CustomDatePicker";
import StatusMessage from "components/Status/StatusBadge"

import EventHelper from "../helpers/event";


class NewEvent extends React.Component {
  constructor(props) {
    super(props);
    const wantedDate = props.location.search.split("=")[1];
    this.state = {
      newEventData: EventModel.data,
      triedAdd: true,
      addSucceeded: false,
      addMessage: "",
    };
    this.state.newEventData.time = wantedDate || new Date();
  }
  onInputChange = event => {
    const newEventData = this.state.newEventData;
    const { value, name } = event.target;
    newEventData[name] = value;
    this.setState({ newEventData });
  }
  onDateChange = date => {
    const newEventData = this.state.newEventData;
    newEventData.time = Utils.mergeDateAndTime(date, newEventData.time);
    this.setState({ newEventData });
  }
  onTimeChange = time => {
    const newEventData = this.state.newEventData;
    newEventData.time = Utils.mergeDateAndTime(newEventData.time, time);
    this.setState({ newEventData });
  }
  onSubmit = async e => {
    e.preventDefault();
    try {
      const eventDate = Utils.formatDateLikeDb(this.state.newEventData.time);
      const eventName = this.state.newEventData.name;
      await EventHelper.postNewEvent(eventDate, eventName, this.state.newEventData);
      this.setState({ addSucceeded: true });
      return this.props.history.push(`event/${eventDate}/${eventName}`);
    } catch (err) {
      this.setState({
        addSucceeded: false,
        addMessage: mapError(err)
      });
    }
    this.setState({ triedAdd: true })
  }

  render() {
    return (
      <div className="content text-right">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">מלא פרטים על האירוע החדש </h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.onSubmit}>
                  <label>מה עושים?</label>
                  <Input
                    onChange={this.onInputChange}
                    name="name"
                    placeholder="האירוע"
                    type="text"
                    required
                  />
                  <Row>
                    <Col xs="6">
                      <DatePicker
                        onChange={this.onTimeChange}
                        value={Utils.formatTime(this.state.newEventData.time)}
                        name="שעה"
                        showTimeSelect
                        showTimeSelectOnly
                        timeCaption="שעה"
                      />
                    </Col>
                    <Col xs="6">
                      <DatePicker
                        onChange={this.onDateChange}
                        value={Utils.formatDate(this.state.newEventData.time)}
                        name="תאריך"
                      />
                    </Col>
                  </Row>
                  <FormGroup>
                    <label>מיקום</label>
                    <Input
                      onChange={this.onInputChange}
                      name="location"
                      placeholder="איפה האירוע"
                      type="location"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>תיאור (זה גם המקום להוסיף קישור)</label>
                    <Input
                      onChange={this.onInputChange}
                      name="description"
                      placeholder="תיאור האירוע"
                      type="textarea"
                      rows="2"
                    />
                  </FormGroup>
                  <Row className="justify-content-center">
                    <Button
                      type="submit"
                      className="btn-fill"
                      color="success"
                    >
                      הוסף
                    </Button>
                  </Row>
                  <Row className="justify-content-center mt-3">
                    <StatusMessage
                      show={this.state.triedAdd}
                      success={this.state.addSucceeded}
                      message={this.state.addMessage}
                    />
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default NewEvent;

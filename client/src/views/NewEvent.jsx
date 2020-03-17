import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";


import Utils from "../utils";
import EventModel from "../defaults/models/event";

import DatePicker from "../components/Calendar/CustomDatePicker";
import StatusMessage from "components/Status/StatusBadge"

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    const wantedDate = props.location.search.split("=")[1];
    this.state = {
      newEventData: EventModel.data
    };
    this.state.newEventData.date = Utils.formatDate(wantedDate);
  }
  onInputChange = event => {
    const newEventData = this.state.newEventData;
    const { value, name } = event.target;
    newEventData[name] = value;
    this.setState({ newEventData });
  };
  onDateChange = date => {
    const newEventData = this.state.newEventData;
    newEventData.date = Utils.formatDate(date);
    this.setState({ newEventData });
  };
  onTimeChange = time => {
    const newEventData = this.state.newEventData;
    newEventData.time = Utils.formatTime(time);
    this.setState({ newEventData });
  };
  postChanges = async () => {
    try {
      await
      this.setState({ updateSucceeded: true });
    } catch (err) {
      this.setState({ updateSucceeded: false });
    }
    this.setState({ triedUpdate: true })
  };
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
                <Form>
                  <label>מה עושים?</label>
                  <Input
                    onChange={this.onInputChange}
                    name="username"
                    placeholder="האירוע"
                    type="text"
                  />
                  <Row>
                    <Col xs="6">
                      <DatePicker
                        onChange={this.onDateChange}
                        value={this.state.newEventData.date}
                        name="תאריך"
                      />
                    </Col>
                    <Col xs="6">
                      <DatePicker
                        onChange={this.onTimeChange}
                        value={this.state.newEventData.time}
                        name="שעה"
                        showTimeSelect
                        showTimeSelectOnly
                        timeCaption="שעה"
                      />
                    </Col>
                  </Row>
                  <label>מיקום</label>
                  <Input
                    onChange={this.onInputChange}
                    name="location"
                    placeholder="איפה האירוע"
                    type="location"
                  />
                  <label>תיאור (זה גם המקום להוסיף קישור)</label>
                  <Input
                    onChange={this.onInputChange}
                    name="description"
                    placeholder="תיאור האירוע"
                    type="textarea"
                    rows="2"
                  />
                  <Row className="justify-content-center">
                    <Button
                      className="btn-fill"
                      color="success"
                      onClick={this.postChanges}
                    >
                      הוסף
                    </Button>
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
export default UserProfile;

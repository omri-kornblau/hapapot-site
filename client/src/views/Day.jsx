import React from "react";
import {
  Table,
  CardHeader,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap";

import Utils from "../utils";
import DayModel from "../defaults/models/day";

import PageLoader from "components/Status/PageLoader";
import AttendingCheckbox from "components/Calendar/AttendingCheckbox";

import DayHelper from "../helpers/day";

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: DayModel.data,
      isLoading: true
    };
    // TODO: understand why this variable is needed
    this.state.date = this.props.location.pathname.split("/")[3]
  }
  componentDidMount = async () => {
    await this.fetchDay();
    this.fetchInterval = setInterval(this.fetchDay, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.fetchInterval);
  }
  fetchDay = async () => {
    const res = await DayHelper.getDay(this.state.date);
    this.setState({
      day: res.data.day,
      attending: res.data.attending,
      isLoading: false
    });
  }
  peopleFromCars = cars => {
    return Object.values(cars).reduce((sum, car) => sum + 1 + car.length, 0);
  };
  renderUsersTable = () => {
    return this.state.day.users.map(user => (
      <tr>
        <td>{Utils.pickNickName(user)}</td>
        <td>בעתיד תמונה</td>
      </tr>
    ));
  };
  renderEventsTable = () => {
    return this.state.day.events.map(event => (
      <tr onClick={
          () => this.props.history.push(`/home/event/${this.state.day.date}/${event.name}`)
          }>
        <td>
          {event.name} <i className={event.icon} />
        </td>
        <td>{this.peopleFromCars(event.cars)}</td>
        <td>{Object.values(event.cars).length}</td>
        <td>{Utils.formatTime(event.time)}</td>
      </tr>
    ));
  };
  onAttendingChange = async attending => {
    this.setState({ attending });
    await DayHelper.postAttendance(this.state.day.date, attending);
    await this.fetchDay();
  }

  render() {
    return (
      <div className="content text-right">
      <PageLoader isLoading={this.state.isLoading}>
        <Row className="justify-content-around">
            <AttendingCheckbox
              onChange={this.onAttendingChange}
              attending={this.state.attending}
            />
            <h4 className="text-center title">
              {Utils.formatDate(this.state.day.date)}
            </h4>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <h5 className="title">בבית</h5>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>שם</th>
                      <th>תמונה</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderUsersTable()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <CardHeader>
                <h5 className="title">ארועים</h5>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>שם</th>
                      <th>חברים</th>
                      <th>רכבים</th>
                      <th>זמן</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderEventsTable()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </PageLoader>
      </div>
    );
  }
}

export default Day;

import React from "react";
import {
  Button,
  Table,
  CardHeader,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap";
import Axios from "axios";

import Utils from "../utils";
import Defaults from "../defaults/defaults";

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: Defaults.Day
    };
    this.state.date = this.props.location.pathname
      .split("/")
      .slice(2)
      .join("/");
  }
  async componentDidMount() {
    try {
      await this.fetchDay();
    } catch (err) {
      console.log(err);
    }
  }
  async fetchDay() {
    const res = await Axios.get(`/api/${this.state.date}`);
    this.setState({
      day: res.data
    });
  }
  peopleFromCars = cars => {
    return Object.values(cars).reduce((sum, car) => sum + 1 + car.length, 0);
  };
  renderUserTable = () => {
    return this.state.day.users.map(user => {
      return (
        <tr>
          <td>{user}</td>
          <td>בעתיד תמונה</td>
        </tr>
      );
    });
  };
  renderEventsTable = () => {
    return this.state.day.events.map(event => (
      <tr>
        <td>
          {event.name} <i className={event.icon} />
        </td>
        <td>{this.peopleFromCars(event.cars)}</td>
        <td>{Object.values(event.cars).length}</td>
        <td>{Utils.formatTime(event.time)}</td>
      </tr>
    ));
  };

  render() {
    return (
      <div className="content text-right">
        <h4 className="text-center title">
          {Utils.formatDate(this.state.day.date)}
        </h4>
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
                  <tbody>{this.renderUserTable()}</tbody>
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
        <Row>
          <Col className="text-center" xs="6">
            <Button
              className="btn-sm btn-success"
              onClick={async () => {
                await Axios.get(`/api/attend/day/${this.state.day.date}`);
                await this.fetchDay();
              }}
            >
              <i className="tim-icons icon-check-2"></i>
            </Button>
          </Col>
          <Col className="text-center" xs="6">
            <Button
              className="btn-sm btn-danger"
              onClick={async () => {
                await Axios.get(`/api/absent/day/${this.state.day.date}`);
                await this.fetchDay();
              }}
            >
              <i className="tim-icons icon-simple-remove"></i>
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Day;

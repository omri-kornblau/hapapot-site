import React from "react";
import {
  Button,
  Table,
  CardHeader,
  Row,
  Col,
  Card,
  CardFooter,
  CardBody,
  CardText
} from "reactstrap";
import Axios from "axios";

import Utils from "../utils";
import Defaults from "../defaults/defaults";

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dayData: Defaults.Day
    };
  }
  async componentDidMount() {
    try {
      const pathFromDay = this.props.location.pathname
        .split("/")
        .slice(2)
        .join("/");
      const res = await Axios.get(`/api/${pathFromDay}`);
      this.setState({
        dayData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
  peopleFromCars = cars => {
    return Object.values(cars).reduce((sum, car) => sum + 1 + car.length, 0);
  };
  renderUserTable = () => {
    return this.state.dayData.users.map(user => {
      console.log(user);
      return (
        <tr>
          <td>{user}</td>
          <td>בעתיד תמונה</td>
        </tr>
      );
    });
  };
  renderEventsTable = () => {
    return this.state.dayData.events.map(event => (
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
          {Utils.formatDate(this.state.dayData.date)}
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
            <Button className="btn-success">
              <i className="tim-icons icon-check-2" />
            </Button>
          </Col>
          <Col className="text-center" xs="6">
            <Button className="btn-warning">
              <i className="tim-icons icon-simple-remove" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Day;

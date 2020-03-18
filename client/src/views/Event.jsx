import _ from "lodash";
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
import DropdownItemsUsers from "../components/Dropdown/DropDown";

import Utils from "../utils";
import EventModel from "../defaults/models/event";

import EventHelper from "../helpers/event";

class Event extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.location.pathname.split("/").slice(2);
    this.name = path[2];
    this.date = path[1];
    this.state = {
      eventData: EventModel.data
    };
  }
  async componentDidMount() {
    try {
      const res = EventHelper.getEvent(this.date, this.name);
      this.setState({
        eventData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
  renderCarTable = () => {
    return this.state.eventData.cars.map(car => {
      return (
        <tr>
          <Button className="btn-icon btn-round" color="success" size="sm">
            <i className="tim-icons icon-simple-add" />
          </Button>
          <td>{car["driver"]}</td>
          <td>{car["passengers"]}</td>
          <Button className="btn-icon btn-round" color="warning" size="sm">
            <i className="tim-icons icon-simple-delete" />
          </Button>
        </tr>
      );
    });
  };

  addOne = item => async () => {
    try {
      const { date, name } = this;
      const res = await EventHelper.addOneItemToUser(item, date, name);
      this.setState({
        eventData: res.data.event
      });
    } catch (err) {
      console.log(err);
    }
  };

  subOne = item => async () => {
    try {
      const { date, name } = this;
      const res = await EventHelper.addOneItemToUser(item, date, name);
      this.setState({
        eventData: res.data.event
      });
    } catch (err) {
      console.log(err);
    }
  };

  renderItemsTable = () => {
    return this.state.eventData.items.map(item => (
      <tr>
        <td>{item.name}</td>
        <td>
          {item.users.reduce((sum, user) => (sum + user.amount), 0)}
          /{item.neededamount}
        </td>
        <td>
          <DropdownItemsUsers
            color="green"
            users={
              item.users.map(user => {
                const currentUser = _.find(this.state.eventData.users, "username", user.name);
                currentUser.amount = user.amount;
                return currentUser;
              })
            }
          />
        </td>
        <td>
          <Button
            className="m-1 btn-icon btn-round"
            color="success"
            size="sm"
            onClick={this.addOne(item.name)}
          >
            <i className="tim-icons icon-simple-add"> </i>
          </Button>
          <Button
            className="m-1 btn-icon btn-round"
            color="warning"
            size="sm"
            onClick={this.subOne(item.name)}
          >
            <i className="tim-icons icon-simple-delete" />
          </Button>
        </td>
      </tr>
    ));
  };

  render() {
    return (
      <div className="content text-right">
        <h4 className="text-center title">
          {this.state.eventData.name + "   "}
          {Utils.formatTime(this.state.eventData.time)}
        </h4>
        <Row>
          <Col md="6">
            <Card>
              <CardHeader>
                <h5 className="title">רכבים</h5>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>שם</th>
                      <th>תמונה</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderCarTable()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <CardHeader>
                <h5 className="title">ציוד</h5>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>פריט</th>
                      <th>כמות</th>
                      <th>אנשים</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderItemsTable()}</tbody>
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

export default Event;

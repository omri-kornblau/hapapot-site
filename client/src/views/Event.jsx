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
import Axios from "axios";

import Utils from "../utils";
import Defaults from "../defaults/defaults";

class Event extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.location.pathname.split("/").slice(2);
    console.log(path);
    this.name = path[2];
    this.date = path[1];
    this.state = {
      eventData: Defaults.event
    };
  }
  async componentDidMount() {
    try {
      const res = await Axios.get(`/api/event/${this.date}/${this.name}`);
      this.setState({
        eventData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
  peopleFromCars = cars => {
    return Object.values(cars).reduce((sum, car) => sum + 1 + car.length, 0);
  };
  renderCarTable = () => {
    return Object.keys(this.state.eventData.cars).map(driver => {
      return (
        <tr>
          <Button className="btn-icon btn-round" color="success" size="sm">
            <i className="tim-icons icon-simple-add" />
          </Button>
          <td>{driver}</td>
          <td>{this.state.eventData.cars[driver]}</td>
          <Button className="btn-icon btn-round" color="warning" size="sm">
            <i className="tim-icons icon-simple-delete" />
          </Button>
        </tr>
      );
    });
  };

  addOne = item => async () => {
    try {
      const eventDate = this.date;
      const eventName = this.name;
      const res = await Axios.get("/api/event/item/add-one", {
        params: {
          item,
          eventDate,
          eventName
        }
      });

      this.setState({
        eventData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  };

  subOne = item => async () => {
    try {
      const eventDate = this.date;
      const eventName = this.name;
      const res = await Axios.get("/api/event/item/sub-one", {
        params: {
          item,
          eventDate,
          eventName
        }
      });

      this.setState({
        eventData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  };

  renderItemsTable = () => {
    return Object.keys(this.state.eventData.items).map(itemName => (
      <tr>
        <td>{itemName}</td>
        <td>
          {_.sumBy(
            Object.keys(this.state.eventData.items[itemName].users),
            username => {
              return this.state.eventData.items[itemName].users[username];
            }
          )}
          /{this.state.eventData.items[itemName].neededamount}
        </td>
        <td>
          <DropdownItemsUsers
            color="green"
            users={this.state.eventData.items[itemName].users}
          />
        </td>
        <td>
          <Button
            className="m-1 btn-icon btn-round"
            color="success"
            size="sm"
            onClick={this.addOne(itemName)}
          >
            <i className="tim-icons icon-simple-add"> </i>
          </Button>
          <Button
            className="m-1 btn-icon btn-round"
            color="warning"
            size="sm"
            onClick={this.subOne(itemName)}
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

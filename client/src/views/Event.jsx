import _ from "lodash";
import React from "react";
import {
  Button,
  Table,
  CardHeader,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Modal
} from "reactstrap";

import Popup from "reactjs-popup";

import AttendingCheckbox from "../components/Calendar/AttendingCheckbox";
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
      eventData: EventModel.data,
      newItem: {
        name: "",
        amount: 0
      },
      isDeleting: false
    };
  }
  async componentDidMount() {
    try {
      const res = await EventHelper.getEvent(this.date, this.name);
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
        eventData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  };
  subOne = item => async () => {
    try {
      const { date, name } = this;
      const res = await EventHelper.subOneItemToUser(item, date, name);
      this.setState({
        eventData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  };
  onInputChange = event => {
    const newNewItem = this.state.newItem;
    const { value, name } = event.target;
    newNewItem[name] = value;
    this.setState({newItem: newNewItem });
  };
  onAttendingChange = async attending => {
    const { eventData } = this.state;
    eventData.attending = attending;
    this.setState({ eventData });
    try {
      const res = await EventHelper.postAttendance(this.date, this.name , attending);
      this.setState({ eventData: res.data });
    } catch(err) {
      console.error(err);
    }
  }
  AddItem = async () => {
    try {
      const res = await EventHelper.addItem(
        this.state.newItem.name,
        this.state.newItem.amount,
        this.state.eventData.time,
        this.state.eventData.name
      )
      this.setState({
        eventData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
  renderExistsItemsTable = () => {
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
                const currentUser = _.find(this.state.eventData.users, {username: user.name});
                if (!!currentUser) {
                  currentUser.amount = user.amount;
                  return currentUser;
                }
                return {};
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
  }
  renderItemsTable = () => {
    return <>
      <this.renderExistsItemsTable/>
      <tr>
        <td>
          <Input placeholder="פריט חדש" onChange={this.onInputChange} name="name"></Input>
        </td>
        <td>
          <Input placeholder="כמות רצויה" type="number" onChange={this.onInputChange} name="amount" min="1"></Input>
        </td>
        <td></td>
        <td>
          <a className="text-success" onClick={this.AddItem}>
            +
          </a>
        </td>
      </tr>
    </>
  };

  openDeletePopup = () => {
    this.setState({isDeleting: true})
  };

  closeDeletePopup = () => {
    this.setState({isDeleting: false})
  }

  deleteEvent = async () => {
    await EventHelper.deleteEvent(this.date, this.state.eventData.name);
    this.props.history.push(`/home/day/${this.date}`);
  }

  render() {
    return (
      <>
      <Popup open={this.state.isDeleting} closeOnDocumentClick onClose={this.closeDeletePopup}>
        <p className="text-center">
        גבר, אתה בטוח שאתה רוצה למחוק את האירוע: "{this.state.eventData.name}"?
        </p>
        <Row className="justify-content-center">
          <Button className="btn-danger btn-sm ml-3" onClick={this.deleteEvent}>כן</Button>
          <Button className="btn-success btn-sm mr-3" onClick={this.closeDeletePopup}>לא</Button>
        </Row>
      </Popup>
      <div className="content text-right">
        <h4 className="text-center title">
          {this.state.eventData.name + "   "}
          {Utils.formatTime(this.state.eventData.time)}
        </h4>
        <Row className="justify-content-center mb-2">
          <AttendingCheckbox
            onChange={this.onAttendingChange}
            attending={this.state.eventData.attending}
          />
        </Row>
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
                  <tbody>
                    {this.renderItemsTable()}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
            <Button className="btn-danger" onClick={this.openDeletePopup}>
              מחק
            </Button>
        </Row>
      </div>
      </>
    );
  }
}

export default Event;

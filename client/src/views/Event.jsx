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
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Form
} from "reactstrap";

import Popup from "reactjs-popup";

import AttendingCheckbox from "../components/Calendar/AttendingCheckbox";
import EventItemDropDown from "../components/Dropdown/EventItemDropDown";
import UserItemsDropDown from "../components/Dropdown/UserItemsDropDown";
import PageLoader from "../components/Status/PageLoader";

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
      eventDataOnEdit: {},
      newItem: {
        name: "",
        amount: 0
      },
      isDeletingMode: false,
      isEditMode: false,
      currentUser: "",
      isLoading: true
    };
  }
  componentDidMount = async () => {
    try {
      const res = await EventHelper.getEvent(this.date, this.name);
      this.setState({
        eventData: res.data.event,
        currentUser: res.data.username,
        isLoading: false
      });
    } catch (err) {
      console.log(err);
    }
  }
  changeItemUserAmount = async (amount, item) => {
    if (!this.state.eventData.attending) {
      return this.openAttendPopup();
    }
    const changeAmount = amount > 0 ?
      EventHelper.addOneItemToUser : EventHelper.subOneItemToUser;

    try {
      const { date, name } = this;
      const res = await changeAmount(item, date, name);
      this.setState({
        eventData: res.data
      });
    } catch(err) {
      console.error(err);
    }
  }
  onInputChange = event => {
    const newNewItem = this.state.newItem;
    const { value, name } = event.target;
    newNewItem[name] = value;
    this.setState({newItem: newNewItem });
  };
  onEditedItemInput = e => {
    const { eventDataOnEdit } = this.state;
    const { name, value } = e.target;
    eventDataOnEdit.items.forEach(item => {
      if (item.name === name) {
        item.neededamount = value;
      }
    });
    this.setState({ eventDataOnEdit });
  }
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
  onAddItemSubmit = async e => {
    e.preventDefault();
    e.target.reset();
    try {
      const { name, amount } = this.state.newItem;
      const res = await EventHelper.addItem(name, amount, this.date, this.name);
      this.setState({
        eventData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }
  enterItemsEditMode = () => {
    const eventDataOnEdit = _.cloneDeep(this.state.eventData);
    this.setState({ isEditMode: true, eventDataOnEdit });
  }
  leaveItemsEditModeNoChanges = () => {
    this.setState({ isEditMode: false });
  }
  leaveItemsEditModeSaveChanges = async () => {
    const eventData = this.state.eventDataOnEdit;
    try {
      const res = await EventHelper.updateItems(this.date, this.name, eventData.items);
      this.setState({ isEditMode: false, eventData: res.data });
    } catch(err) {
      console.error(err);
    }
  }
  deleteEditedItem = itemName => () => {
    const { eventDataOnEdit } = this.state;
    _.remove(eventDataOnEdit.items, item => item.name === itemName);
    this.setState({ eventDataOnEdit });
  }
  openDeletePopup = () => {
    this.setState({isDeletingMode: true})
  };
  closeDeletePopup = () => {
    this.setState({isDeletingMode: false})
  }
  deleteEvent = async () => {
    await EventHelper.deleteEvent(this.date, this.state.eventData.name);
    this.props.history.push(`/home/day/${this.date}`);
  }
  openAttendPopup = () => {
    this.setState({isAttendMode: true});
  }
  closeAttendPopup = () => {
    this.setState({isAttendMode: false})
  }
  renderEditModeItemsRows = () => {
    return this.state.eventDataOnEdit.items.map(item =>
      <tr>
        <td>{item.name}</td>
        <td><Input onInput={this.onEditedItemInput} name={item.name} type="number" min={1} value={item.neededamount}/></td>
        <td></td>
        <td>
          <Button onClick={this.deleteEditedItem(item.name)} color="link" className="btn-sm btn-round">
            <i className="text-danger tim-icons icon-trash-simple" />
          </Button>
        </td>
      </tr>
    );
  }
  renderExistsItemsRows = () => {
    return this.state.eventData.items.map(item => (
      <tr>
        <td>{item.name}</td>
        <td>
          {item.neededamount} / {_.sumBy(item.users, user => user.amount)}
        </td>
        <td>
          <EventItemDropDown
            color="green"
            users={
              item.users.map(user => {
                const currentUser = _.find(this.state.eventData.users, {username: user.name})
                return _.assign(_.clone(currentUser), user);
              })
            }
          />
        </td>
        <td>
          <Button className="m-1 btn-icon btn-round" color="success" size="sm" onClick={() => this.changeItemUserAmount(1, item.name)}>
            <i className="tim-icons icon-simple-add"> </i>
          </Button>
          <Button className="m-1 btn-icon btn-round" color="danger" size="sm" onClick={() => this.changeItemUserAmount(-1, item.name)}>
            <i className="tim-icons icon-simple-delete"/>
          </Button>
        </td>
      </tr>
    ));
  }
  renderItemsCard = () => {
    return (
      <Card>
        <CardHeader>
          <Row className="justify-content-between mr-2 ml-2">
            <h5 className="title">ציוד</h5>
            <Row>
              <UserItemsDropDown items={this.state.eventData.items} user={this.state.currentUser}/>
              <Button onClick={this.enterItemsEditMode} className="btn-icon btn-round" color="link">
                <i className="tim-icons icon-pencil"/>
              </Button>
            </Row>
          </Row>
        </CardHeader>
        <CardBody>
          <Form onSubmit={this.onAddItemSubmit}>
          <Table className="tablesorter text-center" responsive>
            <thead className="text-primary">
              <tr>
                <th>פריט</th>
                <th>כמות</th>
                <th>אנשים</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              <this.renderExistsItemsRows/>
              <tr>
                <td>
                  <Input required placeholder="פריט חדש" onChange={this.onInputChange} name="name"></Input>
                </td>
                <td colSpan="2">
                  <Input required className="text-center" placeholder="כמות רצויה" type="number" onChange={this.onInputChange} name="amount" min="1"></Input>
                </td>
                <td>
                  <Button color="link" className="text-success btn-icon" type="submit">
                    <i className="tim-icons icon-simple-add" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
          </Form>
        </CardBody>
      </Card>
    );
  }
  renderEditItemsCard = () => {
    return (
      <Card>
        <CardHeader>
          <Row className="justify-content-between mr-2 ml-2">
            <h5 className="title">עריכת ציוד</h5>
            <Row>
              <Button onClick={this.leaveItemsEditModeNoChanges} className="btn-icon btn-round" color="link">
                <i className="text-danger tim-icons icon-simple-remove"/>
              </Button>
              <Button onClick={this.leaveItemsEditModeSaveChanges} className="btn-icon btn-round mr-3" color="success">
                <i className="tim-icons icon-check-2"/>
              </Button>
            </Row>
          </Row>
        </CardHeader>
        <CardBody>
          <Table className="tablesorter text-center" responsive>
            <thead className="text-primary">
              <tr>
                <th>פריט</th>
                <th>כמות רצויה</th>
                <th/>
                <th/>
              </tr>
            </thead>
            <tbody>
              <this.renderEditModeItemsRows/>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
  renderCarTable = () => {
    return this.state.eventData.cars.map(car => {
      return (
        <tr>
          <Button  className="btn-icon btn-round" color="success" size="sm">
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

  render() {
    return (
      <>
      <Popup open={this.state.isDeletingMode} closeOnDocumentClick onClose={this.closeDeletePopup}>
        <p className="text-center">
        אתה בטוח שאתה רוצה למחוק את האירוע {this.state.eventData.name} ?
        </p>
        <Row className="justify-content-center mt-4 mb-2">
          <Button className="btn-danger btn-sm ml-3" onClick={this.deleteEvent}>כן</Button>
          <Button className="btn-success btn-sm mr-3" onClick={this.closeDeletePopup}>לא</Button>
        </Row>
      </Popup>
      <Popup open={this.state.isAttendMode} closeOnDocumentClick onClose={this.closeAttendPopup}>
        <p className="text-center">
        בשביל להביא דברים צריך להגיע לאירוע, אתה מגיע?
        </p>
        <Row className="justify-content-center mt-4 mb-2">
          <Button className="btn-primary btn-icon btn-round ml-3" onClick={() => {
            this.onAttendingChange(true);
            this.closeAttendPopup();
          }}>
            כן
          </Button>
          <Button className="btn-danger btn-icon btn-round mr-3" onClick={() => {
            this.onAttendingChange(false);
            this.closeAttendPopup();
          }}>
            לא
          </Button>
        </Row>
      </Popup>
      <div className="content text-right">
        <PageLoader isLoading={this.state.isLoading}>
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
                  <Table className="tablesorter table-sm table-striped" responsive>
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
              { this.state.isEditMode ?
                <this.renderEditItemsCard/> :
                <this.renderItemsCard/>
              }
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Button className="btn-danger btn-rounded btn-sm" onClick={this.openDeletePopup}>
              מחק
            </Button>
          </Row>
        </PageLoader>
      </div>
      </>
    );
  }
}

export default Event;

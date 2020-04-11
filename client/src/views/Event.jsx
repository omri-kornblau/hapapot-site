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
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Form
} from "reactstrap";

import Popup from "reactjs-popup";

import EventHeader from "../components/EventHeader/EventHeader";
import EventCars from "../components/EventCars/EventCars";
import EventItemDropDown from "../components/Dropdown/EventItemDropDown";
import UserItemsDropDown from "../components/Dropdown/UserItemsDropDown";
import PageLoader from "../components/Status/PageLoader";

import EventModel from "../defaults/models/event";

import Utils from "../utils";
import EventHelper from "../helpers/event";

class Event extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.location.pathname.split("/").slice(2);
    this._id = path[1];
    this.state = {
      eventData: EventModel.data,
      eventDataOnEdit: {},
      newItem: {
        name: "",
        amount: 0
      },
      isDeletingMode: false,
      isEditMode: false,
      isItemsSorted: true,
      currentUser: "",
      isLoading: true,
      error: ""
    };
  }
  componentDidMount = () => {
    this.fetchEventData();
    this.fetchInterval = setInterval(this.fetchEventData, 2000);
  }
  componentWillUnmount = () => {
    clearInterval(this.fetchInterval);
  }
  fetchEventData = async () => {
    try {
      const res = await EventHelper.getEvent(this._id);
      const newEventData = res.data.event;
      const oldEventData = this.state.eventData;
      newEventData.items.forEach(item => {
        item.broughtAmount = Utils.getBroughtAmount(item);
        item.isMissing = item.broughtAmount < item.neededamount;
      });
      newEventData.items = this.state.isItemsSorted ?
        Utils.sortItemsByMissing(newEventData.items)
        : Utils.sortItemsByOldItems(newEventData.items, oldEventData.items);
      newEventData.isItemsMissing = _.some(newEventData.items, item =>
        item.broughtAmount < item.neededamount
      );

      this.setState({
        eventData: newEventData,
        currentUser: res.data.username,
        isLoading: false,
        error: ""
      });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        this.setState({ isLoading: false, error: "האירוע לא קיים אחי" });
      } else {
        console.log(err);
      }
    }
  }
  changeItemUserAmount = async (amount, item) => {
    if (!this.state.eventData.attending) {
      return this.openAttendPopup();
    }

    const changeAmount = amount > 0 ?
      EventHelper.addOneItemToUser : EventHelper.subOneItemToUser;

    this.setState({ isItemsSorted: false });

    try {
      await changeAmount(this._id, item.name);
      this.fetchEventData();
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
      await EventHelper.postAttendance(this._id , attending);
      this.fetchEventData();
    } catch(err) {
      console.error(err);
    }
  }
  updateEventHeader = async (name, date, time, location, description) => {
    const finalTime = Utils.mergeDateAndTime(date, time);
    try {
      await EventHelper.updateEventHeader(this._id, name, finalTime, location, description);
      this.fetchEventData();
      return true;
    } catch(err) {
      console.error(err);
      return false;
    }
  }
  addCar = async maxPassengers => {
    try {
      await EventHelper.addCar(this._id, maxPassengers);
      await this.fetchEventData();
      return true;
    } catch(err) {
      console.error(err);
      return false;
    }
  }
  movePassenger = async (passenger, destCarId, isDriver) => {
    try {
      await EventHelper.movePassenger(this._id, passenger, destCarId, isDriver);
      await this.fetchEventData();
      return true;
    } catch(err) {
      console.error(err);
      return false;
    }
  }
  updateCars = async actions => {
    try {
      await EventHelper.updateCars(this._id, actions);
      await this.fetchEventData();
      return true;
    } catch(err) {
      console.error(err);
      return false;
    }
  }
  onAddItemSubmit = async e => {
    e.preventDefault();
    e.target.reset();
    try {
      const { name, amount } = this.state.newItem;
      await EventHelper.addItem(this._id, name, amount);
      this.setState({ isItemsSorted: false });
      this.fetchEventData();
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
      await EventHelper.updateItems(this._id, eventData.items);
      await this.fetchEventData();
      this.setState({ isEditMode: false });
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
    await EventHelper.deleteEvent(this._id);
    this.props.history.push(`/home/day/${Utils.formatDateLikeDb(this.state.eventData.time)}`);
  }
  openAttendPopup = () => {
    this.setState({isAttendMode: true});
  }
  closeAttendPopup = () => {
    this.setState({isAttendMode: false})
  }
  sortItemsByMissing = () => {
    const { eventData } = this.state;
    eventData.items = Utils.sortItemsByMissing(eventData.items);
    this.setState({ eventData, isItemsSorted: true });
  }
  renderEditModeItemsRows = () => {
    return this.state.eventDataOnEdit.items.map(item =>
      <tr key={item.name}>
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
    const { eventData } = this.state;

    return eventData.items.map((item, idx) => (
      <tr key={item.name}>
        <td>
          {item.name}
        </td>
        <td>
          <div className={item.isMissing ? "text-danger" : ""}>
            {item.neededamount} / {item.broughtAmount}
          </div>
        </td>
        <td>
          <EventItemDropDown
            item={item}
            idx={idx}
            users={item.users.map(user => {
              const currentUser = _.find(eventData.users, {username: user.name})
              return _.assign(_.clone(currentUser), user);
            })}
          />
        </td>
        <td>
          <Button className="m-1 btn-icon btn-round" color="success" size="sm" onClick={() => this.changeItemUserAmount(1, item)}>
            <i className="tim-icons icon-simple-add"> </i>
          </Button>
          <Button className="m-1 btn-icon btn-round" color="danger" size="sm" onClick={() => this.changeItemUserAmount(-1, item)}>
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
            <h5 className="title">
              ציוד
              <i className={`mr-3 tim-icons
                ${this.state.eventData.isItemsMissing ?
                  "text-danger icon-thumbs-down-1"
                  : "text-success icon-thumbs-up-1"
                } `}
              />
            </h5>
            <Row>
              <span id="sort-btn"> {/* Wrap to enable tooltip on disabled button */}
                <Button
                  disabled={this.state.isItemsSorted}
                  onClick={this.sortItemsByMissing}
                  className="btn-icon btn-round" color="link">
                  ↓
                </Button>
              </span>
              {this.state.isItemsSorted ?
                <UncontrolledTooltip target="sort-btn">
                  הפריטים כבר ממוינים
                </UncontrolledTooltip>
              : ""}
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
                <th>
                  כמות
                  {this.state.isItemsSorted ? " ↓ " : ""} {/* ↑*/}
                </th>
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

  render() {
    return (
    <>
      <Popup open={this.state.isDeletingMode} closeOnDocumentClick onClose={this.closeDeletePopup}>
        <>
          <p className="text-center">
          גבר, אתה בטוח שאתה רוצה למחוק את האירוע: "{this.state.eventData.name}"?
          </p>
          <Row className="justify-content-center mt-4 mb-2">
            <Button className="btn-danger btn-sm ml-3" onClick={this.deleteEvent}>כן</Button>
            <Button className="btn-success btn-sm mr-3" onClick={this.closeDeletePopup}>לא</Button>
          </Row>
        </>
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
          { this.state.error === "" ?
            <>
              <EventHeader
                name={this.state.eventData.name}
                time={this.state.eventData.time}
                description={this.state.eventData.description}
                date={Utils.formatDateLikeDb(this.state.eventData.time)}
                location={this.state.eventData.location}
                updateEvent={this.updateEventHeader}
                history={this.props.history}
                onAttendingChange={this.onAttendingChange}
                attending={this.state.eventData.attending}
              />
              <Row>
                <Col md="6">
                  <EventCars
                    passengers={this.state.eventData.users}
                    cars={this.state.eventData.cars}
                    onCarAdded={this.addCar}
                    onPassengerMoved={this.movePassenger}
                    onCarUpdated={this.updateCars}
                   />
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
            </>
            :
              <div className="text-center justify-content-center">
                <h3 style={{color: "red"}}>{this.state.error}</h3>
              </div>
            }
        </PageLoader>
      </div>
    </>);
  }
}

export default Event;

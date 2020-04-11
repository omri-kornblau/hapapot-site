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
import Popup from "reactjs-popup";

import EventHeader from "../components/EventHeader/EventHeader";
import EventCars from "../components/EventCars/EventCars";
import PageLoader from "../components/Status/PageLoader";
import EventItems from "../components/EventItems/EventItems";

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
      isDeletingMode: false,
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

      this.setState({
        eventData: res.data.event,
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
  onChangeItemUserAmount = async (item, amount) => {
    if (!this.state.eventData.attending) {
      return this.openAttendPopup();
    }

    const changeAmount = amount > 0 ?
      EventHelper.addOneItemToUser : EventHelper.subOneItemToUser;

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
      this.fetchEventData();
      return true;
    } catch(err) {
      console.error(err);
      return false;
    }
  }
  movePassenger = async (passenger, destCarId, isDriver) => {
    try {
      await EventHelper.movePassenger(this._id, passenger, destCarId, isDriver);
      this.fetchEventData();
      return true;
    } catch(err) {
      console.error(err);
      return false;
    }

  }
  onAddItem = async e => {
    try {
      await EventHelper.addItem(this._id, name, amountNeeded);
      this.fetchEventData();
    } catch (err) {
      console.log(err);
    }
  }
  onItemsEditSave = async editedItems => {
    try {
      const { eventData } = this.state;
      eventData.items = editedItems;
      this.setState({ eventData });
      await EventHelper.updateItems(this._id, editedItems);
      this.fetchEventData();
    } catch(err) {
      console.error(err);
    }
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

  render() {
    const { eventData } = this.state;
    return (
    <>
      <Popup open={this.state.isDeletingMode} closeOnDocumentClick onClose={this.closeDeletePopup}>
        <>
          <p className="text-center">
          אתה בטוח שאתה רוצה למחוק את האירוע: "{eventData.name}"?
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
          { this.state.error === "" ?
            <>
              <PageLoader isLoading={this.state.isLoading}>
                <EventHeader
                  name={eventData.name}
                  time={eventData.time}
                  description={eventData.description}
                  date={Utils.formatDateLikeDb(eventData.time)}
                  location={eventData.location}
                  updateEvent={this.updateEventHeader}
                  history={this.props.history}
                  onAttendingChange={this.onAttendingChange}
                  attending={eventData.attending}
                />
              </PageLoader>
              <Row>
                <Col md="6">
                  <EventCars
                    passengers={this.state.eventData.users}
                    cars={this.state.eventData.cars}
                    addCar={this.addCar}
                    movePassenger={this.movePassenger}
                   />
                </Col>
                <Col md="6">
                  <EventItems
                    items={eventData.items}
                    users={eventData.users}
                    user={this.state.currentUser}
                    onChangeItemUserAmount={this.onChangeItemUserAmount}
                    onEditSave={this.onItemsEditSave}
                    onAddItem={this.onAddItem}
                  />
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
      </div>
    </>);
  }
}

export default Event;

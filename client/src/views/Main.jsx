import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container,
  Jumbotron,
  Button,
  Badge,
  UncontrolledTooltip
} from "reactstrap";
import _ from "lodash";

import Utils from "../utils";

import PageLoader from "components/Status/PageLoader";
import DayBlob from "components/Calendar/DayBlob";
import AttendingCheckbox from "components/Calendar/AttendingCheckbox";

import CalendarHelper from "../helpers/calendar";
import DayHelper from "../helpers/day";

class Main extends React.Component {
  constructor(props) {
    super(props);
    const wantedDate = props.location.search.split("=")[1];
    const selectedDate = Utils.formatDateLikeDb(wantedDate || new Date());
    this.state = {
      days: [],
      selectedDay: { date: selectedDate },
      chunk: 0,
      isLoading: true
    };
  }
  componentDidMount = async () => {
    await this.fetchCalendar();
    this.fetchInterval = setInterval(this.fetchCalendar, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.fetchInterval);
  }
  fetchCalendar = async () => {
    const res = await CalendarHelper.getCalendarChunk(this.state.chunk);
    this.setState({
      days: res.data,
      isLoading: false
    });
    this.forceUpdate();
  }
  getDayBlobsRows() {
    return this.state.days.map((week, weekIdx) => (
      <Row key={`week-${weekIdx}`} className="justify-content-around">
        {week.map((day, dayIdx) => {
          const isSelected = this.state.selectedDay.date === day.date;
          if (isSelected) (this.state.selectedDay = day)
          return (
            <Col key={`day-${day.date}`} sm="7th" className="center">
              <DayBlob
                onClick={() => {
                  if (isSelected) { return this.openSelectedDay() }
                  this.setState({ selectedDay: day});
                }}
                key={`dayblob-${day.date}-${day.attendance}`}
                attendance={day.attendance}
                events={day.events}
                date={day.date}
                selected={isSelected}
                showMonth={dayIdx === 0 && weekIdx === 0}
              />
            </Col>
          );
        })}
      </Row>
    ));
  }
  onAttendingChange = async attending => {
    const { selectedDay } = this.state;
    selectedDay.attending = attending;
    this.setState({ selectedDay });
    await DayHelper.postAttendance(this.state.selectedDay.date, attending);
    await this.fetchCalendar();
  }
  openSelectedDay = () => {
    this.props.history.push(`day/${this.state.selectedDay.date}`);
  }
  openEvent = event => {
    this.props.history.push(`event/${event._id}`);
  }
  openNewEvent = () => {
    this.props.history.push(`newevent?date=${this.state.selectedDay.date}`);
  }
  renderUsersInDay = () => {
    return this.state.selectedDay.attendance > 0 ?
      this.state.selectedDay.nicknames.map(nickName =>
        <Badge key={nickName} className="m-1" color="primary">{Utils.pickNickName(nickName)}</Badge>
      )
      : "אף אחד לא נמצא"
  }
  renderEventsInDay = () => {
    const { events } = this.state.selectedDay;
    return !events ? "" : events.map((event, idx) =>
      <div key={event.name}>
        <UncontrolledTooltip onClick={() => this.openEvent(event)} placement="bottom" target={`event_${idx}`}>
         בשעה {Utils.formatTime(event.time)}
         <h5 className="mb-0"/>
         <i className="mb-1 tim-icons icon-zoom-split"></i>
        </UncontrolledTooltip>
        <Badge id={`event_${idx}`} className="m-1" color="danger">{event.name}</Badge>
      </div>
    );
  }

  render() {
    return (
      <div className="content text-right">
        <Card>
          <CardHeader>
            <Container className="mt-4">
              <h4 className="text-center title">
                {Utils.formatDate(this.state.selectedDay.date)}
              </h4>
              <h5 className="text-center mb-1">
                מי בבית:
              </h5>
              <Row className="justify-content-center">
                <this.renderUsersInDay/>
              </Row>
              <div className="divider mt-3 mb-3"/>
              <h5 className="text-center mb-1">
                מה עושים:
              </h5>
              <Row className="justify-content-center">
                <this.renderEventsInDay/>
                <a className="text-success ml-3 mr-3" color="link" onClick={this.openNewEvent}>
                  +
                </a>
              </Row>
              <div className="divider mt-3 mb-3"/>
            </Container>
            <Row className="justify-content-center">
              <AttendingCheckbox
                onChange={this.onAttendingChange}
                attending={this.state.selectedDay.attending}
              />
            </Row>
          </CardHeader>
          <CardBody>
            <Container>
              <PageLoader isLoading={this.state.isLoading}>
                <CardHeader>
                  <Row>
                    <Col className="text-center" sm="7th">
                      א
                    </Col>
                    <Col className="text-center" sm="7th">
                      ב
                    </Col>
                    <Col className="text-center" sm="7th">
                      ג
                    </Col>
                    <Col className="text-center" sm="7th">
                      ד
                    </Col>
                    <Col className="text-center" sm="7th">
                      ה
                    </Col>
                    <Col className="text-center" sm="7th">
                      ו
                    </Col>
                    <Col className="text-center" sm="7th">
                      ש
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="day-blobs-container">{this.getDayBlobsRows()}</CardBody>
              </PageLoader>
                <Row className="justify-content-center">
                  <Button
                    className="btn-sm btn-link"
                    onClick={() => this.setState({ chunk: this.state.chunk + 1})}>
                    {"▲"}
                  </Button>
                  <Button
                    className="btn-sm btn-link"
                    onClick={() => this.setState({ chunk: this.state.chunk - 1})}>
                    {"▼"}
                  </Button>
                </Row>
            </Container>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Main;

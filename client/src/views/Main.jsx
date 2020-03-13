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
  Pagination
} from "reactstrap";
import Axios from "axios";

import DayBlob from "components/Calendar/DayBlob";
import Utils from "../utils";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: [],
      selectedDay: {},
      chunk: 0
    };
  }
  async componentDidMount() {
    try {
      await this.fetchCalendar();
      this.setState({ selectedDay: this.state.days[0] });
    } catch (err) {
      console.log(err);
    }
  }
  async fetchCalendar() {
    const res = await Axios.get(`/api/calendar/${this.state.chunk}`);
    this.setState({ days: res.data });
  }
  getSelectedLinkPath() {
    return this.state.selectedDay.date
      ? this.state.selectedDay.date.split("T")[0]
      : "";
  }
  getDayBlobsRows() {
    return this.state.days.map((week, weekIdx) => (
      <Row key={`week-${weekIdx}`} className="justify-content-between">
        {week.map(day => {
          const isSelected = this.state.selectedDay.date === day.date;
          return (
            <Col key={`day-${day.date}`} sm="7th">
              <DayBlob
                onClick={() => {
                  this.setState({ selectedDay: day });
                }}
                attendance={day.attendance}
                events={day.events}
                date={day.date}
                selected={isSelected}
              />
            </Col>
          );
        })}
      </Row>
    ));
  }

  render() {
    return (
      <div className="content text-right">
        <Card>
          <CardHeader>
            <Jumbotron>
              <Container>
                <h4 className="text-center title">
                  {Utils.formatDate(this.state.selectedDay.date)}
                </h4>
                <Row className="justify-content-between">
                  <Button
                    className="btn-sm btn-success"
                    onClick={async () => {
                      await Axios.get(
                        `/api/attend/day/${this.getSelectedLinkPath()}`
                      );
                      await this.fetchCalendar();
                    }}
                  >
                    <i className="tim-icons icon-check-2"></i>
                  </Button>
                  <Button
                    className="btn-sm btn-primary"
                    onClick={() => {
                      this.props.history.push(
                        `day/${this.getSelectedLinkPath()}`
                      );
                    }}
                  >
                    <i className="tim-icons icon-components"></i>
                  </Button>
                  <Button
                    className="btn-sm btn-danger"
                    onClick={async () => {
                      await Axios.get(
                        `/api/absent/day/${this.getSelectedLinkPath()}`
                      );
                      await this.fetchCalendar();
                    }}
                  >
                    <i className="tim-icons icon-simple-remove"></i>
                  </Button>
                </Row>
              </Container>
            </Jumbotron>
          </CardHeader>
          <CardBody>
            <Card>
              <Container>
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
                <CardBody>{this.getDayBlobsRows()}</CardBody>
              </Container>
            </Card>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Main;

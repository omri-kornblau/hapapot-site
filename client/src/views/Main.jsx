
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container,
  Jumbotron
} from "reactstrap";
import Axios from 'axios';

import DayBlob from "components/Calendar/DayBlob"
import { Redirect } from "react-router";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: [],
      selectedDay: {}
    }
  }
  async componentDidMount() {
    try {
      const res = await Axios.get("/api/calendar/0");
      this.setState({ days: res.data, selectedDay: res.data[0] });
    } catch (err) {

    }
  }
  getSelectedLinkPath() {
    return this.state.selectedDay.date
      ? this.state.selectedDay.date.split('T')[0] : "";
  }
  getDayBlobsRows(blobsInARow) {
    return this.state.days.reduce((rows, day, idx) => {
      const rowIdx = Math.floor(idx / blobsInARow);
      if (!rows[rowIdx]) {
        rows.push([]);
      }
      rows[rowIdx].push(
        <Col sm="7th">
          <DayBlob
          onClick={() =>  {
            this.setState({ selectedDay: day });
          }}
          attendance={day.attendance}
          events={day.events}
          date={day.date}/>
        </Col>
      );
      return rows;
    }, [[]]);
  }

  render() {
    const blobsInARow = 7
    return (
      <>
        <div className="content text-right">
          <Card>
            <CardHeader>
              <Row className="justify-content-center">
                <Col sm="4" md="3" xs="8">
                  <DayBlob
                    attendance={this.state.selectedDay.attendance}
                    events={this.state.selectedDay.events}
                    date={this.state.selectedDay.date}
                    onClick={() => {
                      this.props.history.push(
                        `day/${this.getSelectedLinkPath()}`
                      );
                    }}
                  />
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Jumbotron>
                <Container>
                  {this.getDayBlobsRows(blobsInARow).map(row => (
                    <Row className="justify-content-center">
                      {row}
                    </Row>
                  ))}
                </Container>
              </Jumbotron>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}
export default Main;

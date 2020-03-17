import React from "react";
import Axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label
} from "reactstrap";

import DatePicker from "../components/Calendar/CustomDatePicker";

import Utils from "../utils";
import UserCard from "components/Cards/UserCard";
import StatusMessage from "components/Status/StatusBadge"
import UserModel from "../defaults/models/user";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: UserModel.data,
      triedUpdate: false,
      updateSucceeded: false
    };
  }
  async componentDidMount() {
    try {
      const res = await Axios.get("/api/user");
      this.setState({
        userData: res.data
      });
    } catch (err) {}
  }
  onNicknamesChange = event => {
    const userData = this.state.userData;
    const { value, name } = event.target;
    userData[name] = value.split(",");
    this.setState({
      userData
    });
  };
  onCheckboxChange = event => {
    const userData = this.state.userData;
    const { checked, name } = event.target;
    userData[name] = checked;
    this.setState({ userData });
  };
  onInputChange = event => {
    const userData = this.state.userData;
    const { value, name } = event.target;
    userData[name] = value;
    this.setState({ userData });
  };
  handleDateChange = date => {
    const userData = this.state.userData;
    userData.birthday = new Date(date);
    this.setState({ userData });
  };
  postChanges = async () => {
    try {
      const res = await Axios.post("/api/user", this.state.userData);
      this.setState({ updateSucceeded: true });
    } catch (err) {
      this.setState({ updateSucceeded: false });
    }
    this.setState({ triedUpdate: true })
  };
  render() {
    return (
      <>
        <div className="content text-right">
          <Row>
            <Col md="8">
              <Card>
                <CardHeader>
                  <h5 className="title">הפרופיל שלי</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="px-md-1" md="6">
                        <FormGroup>
                          <label>שם משתמש</label>
                          <Input
                            value={this.state.userData.username}
                            onChange={this.onInputChange}
                            name="username"
                            placeholder="השם של המשתמש"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-md-1" md="6">
                        <FormGroup>
                          <label>ססימה</label>
                          <Input
                            name="password"
                            value=""
                            onChange={this.onInputChange}
                            placeholder="זה סוד"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="6">
                        <FormGroup>
                          <label>שם פרטי</label>
                          <Input
                            name="firstname"
                            value={this.state.userData.firstname}
                            onChange={this.onInputChange}
                            placeholder="איך שאמא קוראת לך שהיא כועסת"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-md-1" md="6">
                        <FormGroup>
                          <label>שם משפחה</label>
                          <Input
                            name="lastname"
                            value={this.state.userData.lastname}
                            onChange={this.onInputChange}
                            placeholder="שם משפחה"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="6">
                        <FormGroup>
                          <label>
                            כינויים ( יש לשים פסיק בין כינוי לכינוי)
                          </label>
                          <Input
                            value={this.state.userData.nicknames.join(",")}
                            onChange={this.onNicknamesChange}
                            name="nicknames"
                            placeholder="דוגי זה יהיה השמות שלך באתר"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-md-1" md="6">
                        <FormGroup>
                          <DatePicker
                            name="יום הולדת"
                            value={Utils.formatDate(this.state.userData.birthday)}
                            selected={new Date(this.state.userData.birthday)}
                            onChange={this.handleDateChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup check>
                          <Label check>
                            <p>רווק?</p>
                            <Input
                              onChange={this.onCheckboxChange}
                              checked={this.state.userData.single}
                              name="single"
                              type="checkbox"
                            />
                            <span className="form-check-sign">
                              <span className="check" />
                            </span>
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="8">
                        <FormGroup>
                          <label>קצת עלי</label>
                          <Input
                            cols="80"
                            name="aboutme"
                            value={this.state.userData.aboutme}
                            onChange={this.onInputChange}
                            placeholder="היי שלום ספר לי על עצמך"
                            rows="4"
                            type="textarea"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Row>
                    <Col className="text-center" sm="12">
                      <Button
                        className="btn-fill"
                        color="primary"
                        onClick={this.postChanges}
                      >
                        שמור
                      </Button>
                    </Col>
                    <Col className="text-center" sm="12">
                      { this.state.triedUpdate ?
                          <StatusMessage success={this.state.updateSucceeded}/>
                          : ""}
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
            <Col md="4">
              <UserCard userdata={this.state.userData}></UserCard>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default UserProfile;

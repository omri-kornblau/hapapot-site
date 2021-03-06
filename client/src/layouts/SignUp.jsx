import React from "react";
import _ from "lodash";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Input,
  Row,
  Col,
  Form,
  Container,
  Jumbotron,
  Label
} from "reactstrap";

import DatePicker from "components/Calendar/CustomDatePicker";
import StatusMessage from "components/Status/StatusBadge"

import Utils from "../utils";
import UserModel from "../defaults/models/user";
import mapError from "../defaults/errorsMapping";

import UserHelper from "../helpers/user";

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: UserModel.data,
      triedSignUp: false,
      signUpSucceeded: false,
      signUpMessage: ""
    };
    this.state.userData.passwordConfirmation = "";
    this.origin = props.location.search.split("=")[1] || "/home/main";
  }
  componentDidMount() {
    document.body.classList.add("rtl", "menu-on-right");
    document.body.classList.add("white-content");
  }
  onInputChange = event => {
    const userData = this.state.userData;
    const { value, name } = event.target;
    userData[name] = value;
    this.setState({ userData });
  };
  onCheckboxChange = event => {
    const userData = this.state.userData;
    const { checked, name } = event.target;
    userData[name] = checked;
    this.setState({ userData });
  };
  onDateChange = date => {
    const userData = this.state.userData;
    userData.birthday = new Date(date);
    this.setState({ userData });
  };
  onFileChange = event => {
    const userData = this.state.userData;
    userData.picture = event.target.files[0];
    console.log(userData.picture);
    this.setState({ userData });
  }
  createInputs = () => {
    const placeHolderPrefix = "";
    return _.keys(UserModel.inputAttributes).map(key => {
      const currentAttr = UserModel.inputAttributes[key];
      const currentLabel = currentAttr.label;

      if (currentAttr.type === "file")
        return (
          <FormGroup>
            <label>{currentLabel}</label>
            <Input
              type={currentAttr.type}
              name={key}
              accept=".jpg,.png"
              onChange={this.onFileChange}
              required={currentAttr.required}
            />
            <span className="btn btn-sm btn-primary">
              העלה
            </span>
          </FormGroup>
        );
      if (currentAttr.type === "datepicker") {
        return (
          <FormGroup>
            <DatePicker
              name={currentLabel}
              value={Utils.formatDate(UserModel.data[key])}
              selected={new Date(UserModel.data[key])}
              onChange={this.onDateChange}
            />
          </FormGroup>
        );
      }
      if (currentAttr.type === "checkbox") {
        return (
          <FormGroup check>
            <Label check>
              <p>{currentAttr.label}</p>
              <Input
                onChange={this.onCheckboxChange}
                name={key}
                type={currentAttr.type}
              />
              <span className="form-check-sign">
                <span className="check" />
              </span>
            </Label>
          </FormGroup>
        )
      }
      return (
        <FormGroup>
          <label>{currentLabel}</label>
          <Input
            className="text-right"
            type={currentAttr.type}
            name={key}
            placeholder={`${placeHolderPrefix} ${currentLabel}`}
            onChange={this.onInputChange}
            required={currentAttr.required}
          />
        </FormGroup>
      );
    });
  };
  onSubmit = async event => {
    event.preventDefault();
    try {
      await UserHelper.addUser(this.state.userData);
      this.setState({ signUpSucceeded: true });
      this.props.history.push(this.origin);
    } catch (err) {
      this.setState({
        signUpSucceeded: false,
        signUpMessage: mapError(err)
      });
    }
    this.setState({ triedSignUp: true })
  };

  render() {
    return (
      <Jumbotron className="vertical-center">
        <Container>
          <Row className="justify-content-md-center">
            <Col className="text-right" md="6">
              {" "}
              <Card className="card-user">
                <CardHeader>
                  <CardTitle className="text-center" tag="h4">
                    תמלא פרטים גבר
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="text-right" onSubmit={this.onSubmit}>
                    <Row className="justify-content-center text-right">
                      <Col md="7">
                        <this.createInputs/>
                        <FormGroup>
                          <label>קוד הרשמה</label>
                          <Input
                            name="code"
                            className="text-right"
                            placeholder={"קוד הרשמה"}
                            onChange={this.onInputChange}
                            required={true}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-center pr-1" md="12">
                        <Button
                          type="submit"
                          className="btn-round"
                          color="primary"
                        >
                          הירשם
                        </Button>
                      </Col>
                    </Row>
                    <Row className="justify-content-center mt-3">
                      <StatusMessage
                        show={this.state.triedSignUp}
                        success={this.state.signUpSucceeded}
                        message={this.state.signUpMessage}
                      />
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default SignUpPage;

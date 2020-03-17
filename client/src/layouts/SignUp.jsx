import React from "react";
import { Redirect } from "react-router";
import Axios from "axios";
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

import Utils from "../utils";
import UserModel from "../defaults/models/user";

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: UserModel.data,
      failedLogin: false,
      redirectToReferrer: false
    };
    this.state.userData.passwordConfirmation = "";
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
    console.log(event);
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
      await Axios.post("/api/newuser", this.state.userData);
      this.setState({ updateSucceeded: true });
      this.props.history.push("/");
    } catch (err) {
      console.error(err);
      this.setState({ updateSucceeded: false });
    }
    // this.setState({ triedUpdate: true })
    // this.setState({
    //   redirectToReferrer: false,
    //   failedLogin: !false
    // });
  };

  render() {
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }

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

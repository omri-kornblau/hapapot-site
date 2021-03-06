import React from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Form,
  Container,
  Jumbotron,
} from "reactstrap";

import Auther from "../helpers/authentication";
import mapError from "../defaults/errorsMapping";

import StatusMessage from "../components/Status/StatusBadge";


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        username: "",
        password: ""
      },
      triedLogin: false,
      stayLogged: false,
      loginSucceeded: false,
      loginMessage: ""
    };
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
    this.setState({
      userData
    });
  };
  onStayLoggedChange = () => {
    this.setState({
      stayLogged: !this.state.stayLogged
    });
  };
  onSubmit = async event => {
    const { userData, stayLogged } = this.state;
    event.preventDefault();
    try {
      await Auther.authenticate(userData, stayLogged);
      this.setState({
        loginSucceeded: true
      });
      this.props.history.push(this.origin);
    } catch(err) {
      this.setState({
        loginMessage: mapError(err)
      });
    }
    this.setState({ triedLogin: true });
  };

  render() {
    return (
      <Jumbotron className="vertical-center">
        <Container>
          <Row className="justify-content-md-center">
            <Col className="text-right" md="6">
              {" "}
              <Card className="card-user pb-2">
                <CardHeader>
                  <CardTitle className="text-center" tag="h4">
                    תמלא פרטים גבר
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="text-right" onSubmit={this.onSubmit}>
                    <Row className="text-right">
                      <Col className="text-right" md="7">
                        <FormGroup>
                          <label> שם משתמש </label>
                          <Input
                            className="text-right"
                            type="username"
                            name="username"
                            placeholder="הכנס שם משתמש"
                            value={this.state.userData.username}
                            onChange={this.onInputChange}
                            invalid={!this.state.loginSucceeded}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col className="text-right" md="5">
                        <FormGroup>
                          <label> סיסמה </label>
                          <Input
                            className="text-right"
                            type="password"
                            name="password"
                            placeholder="הכנס סיסמה"
                            value={this.state.userData.password}
                            onChange={this.onInputChange}
                            invalid
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row className="justify-content-center mb-3">
                      <FormGroup check>
                        <Label check>
                          <p>הישאר מחובר</p>
                          <Input
                            onChange={this.onStayLoggedChange}
                            checked={this.state.stayLogged}
                            type="checkbox"
                          />
                          <span className="form-check-sign">
                            <span className="check" />
                          </span>
                        </Label>
                      </FormGroup>
                    </Row>
                    <Row>
                      <Col className="text-center" md="12">
                        <Button
                          type="submit"
                          className="btn-round"
                          color="primary"
                        >
                          התחבר
                        </Button>
                      </Col>
                    </Row>
                    <Row className="justify-content-center mt-3">
                      <StatusMessage
                        show={this.state.triedLogin}
                        success={this.state.loginSucceeded}
                        message={this.state.loginMessage}
                      />
                    </Row>
                  </Form>
                </CardBody>
                <a
                  className="text-default text-center"
                  href={`/signup?origin=${this.origin}`}>
                    <u>אין לך חשבון? הירשם!</u>
                </a>
              </Card>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default LoginPage;

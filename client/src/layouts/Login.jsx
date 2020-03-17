import React from "react";

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
  Jumbotron
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
      loginSucceeded: false,
      loginMessage: ""
    };
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
  onSubmit = async event => {
    event.preventDefault();
    try {
      await Auther.authenticate(this.state.userData);
      this.setState({
        loginSucceeded: true
      });
      this.props.history.push("/home/main");
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
              <Card className="card-user">
                <CardHeader>
                  <CardTitle className="text-center" tag="h4">
                    תמלא פרטים גבר
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Form className="text-right" onSubmit={this.onSubmit}>
                    <Row className="text-right">
                      <Col className="text-right pr-1" md="7">
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
                      <Col className="text-right pr-1" md="5">
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
                <a className="text-default text-center" href="/signup"><u>אין לך חשבון? הירשם!</u></a>
              </Card>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default LoginPage;

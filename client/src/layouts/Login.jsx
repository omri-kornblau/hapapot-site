import React from "react";
import { Redirect } from "react-router";

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

import Auther from "../requests/authentication";

const LoginMessage = props => {
  if (props.failedLogin) {
    return <h4>שמע נראה לי שאתה טועה</h4>;
  } else {
    return <div />;
  }
};

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        username: "",
        password: ""
      },
      failedLogin: false,
      redirectToReferrer: false
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
    const isAuth = await Auther.authenticate(this.state.userData);
    this.setState({
      redirectToReferrer: isAuth,
      failedLogin: !isAuth
    });
  };

  render() {
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/home/main" />;
    }

    return (
      <Jumbotron className="vertical-center">
        <Container>
          <Row className="justify-content-md-center">
            <Col className="text-right" md="6">
              {" "}
              <Card className="card-user">
                <CardHeader>
                  <CardTitle className="text-right" tag="h5">
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
                            required
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
                          התחבר
                        </Button>
                        <LoginMessage failedLogin={this.state.failedLogin} />
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <a className="text-center" href="/signup">אין לך חשבון? הירשם!</a>
              </Card>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
    );
  }
}

export default LoginPage;

import React from "react";
import Axios from "axios";

// reactstrap components
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
} from "reactstrap";

const LoginMessage = (props) => {
  if (props.failedLogin) {
    return <h4>שמע נראה לי שאתה טועה</h4>
  } else {
    return <div/>;
  }
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        username: "",
        password: ""
      },
      failedLogin: false
    };
  }
  componentDidMount() {
    // on this page, we need on the body tag the classes .rtl and .menu-on-right
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
  }
  onSubmit = event => {
    event.preventDefault();
    Axios.post('/api/authenticate', this.state.userData)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            failedLogin: false
          });
          this.props.history.push('/');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        this.setState({
          failedLogin: true
        });
      });
  }

  render() {
    return (
      <>
        <Jumbotron className="vertical-center">
        <Container>
          <Row className="justify-content-md-center">
            <Col className="text-right" md="6"> <Card className="card-user">
              <CardHeader>
                <CardTitle className="text-right" tag="h5">תמלא פרטים גבר</CardTitle>
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
                        value={this.state.username}
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
                        value={this.state.password}
                        onChange={this.onInputChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center pr-1" md="12">
                    <Button type="submit" className="btn-round" color="primary">
                      התחבר
                    </Button>
                    <LoginMessage failedLogin={this.state.failedLogin}/>
                  </Col>
                </Row>
            </Form>
            </CardBody>
          </Card></Col>
          </Row>
        </Container>
        </Jumbotron>
      </>
    );
  }
}

export default LoginPage;

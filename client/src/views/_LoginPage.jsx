import React, { Component } from 'react';
import Axios from 'axios'

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

const LoginMessage = (props) => {
  if (props.failedLogin) {
    return <p>email or password are wrong</p>
  } else {
    return <div/>;
  }
}

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {
        email : '',
        password: ''
      },
      failedLogin: false
    };
  }
  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }
  onSubmit = (event) => {
    event.preventDefault();
    Axios.post('/api/authenticate', this.state)
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
      <div className="content">
      <Card className="card-user">
        <CardHeader>
            <CardTitle tag="h5">Fill in your details</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
          <Row>
            <Col className="pr-1" md="5">
              <FormGroup>
                <label htmlFor="exampleInputEmail1"> Email address </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col className="pr-1" md="3">
              <FormGroup>
                <label>Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        <Button type="submit" className="btn-round">
          Login
        </Button>
        <LoginMessage failedLogin={this.state.failedLogin}/>
      </Form>
      </CardBody>
    </Card>
    </div>
  )}
}
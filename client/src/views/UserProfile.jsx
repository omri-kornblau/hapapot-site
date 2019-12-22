import React from "react";

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
  Col
} from "reactstrap";

class UserProfile extends React.Component {
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
                            defaultValue=""
                            placeholder="השם של המשתמש"
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
                            defaultValue=""
                            placeholder="איך שאמא קוראת לך שהיא כועסת"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-md-1" md="6">
                        <FormGroup>
                          <label>שם משפחה</label>
                          <Input
                            defaultValue=""
                            placeholder="שם משפחה"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="8">
                        <FormGroup>
                          <label>קצת עלי</label>
                          <Input
                            cols="80"
                            defaultValue=""
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
                  <Button className="btn-fill" color="primary" type="submit">
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </Col>
            <Col md="4">
              <Card className="card-user ">
                <CardBody className="bg-danger">
                  <CardText />
                  <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar"
                        src={require("assets/img/emilyz.jpg")}
                      />
                      <h5 className="title">props.userData.NickName</h5>
                    </a>
                    <p className="birthday">props.userData.Birthday</p>
                  </div>
                  <div className="card-description"></div>
                </CardBody>
                <CardFooter>
                  <div className="button-container">
                    <Button className="btn-icon btn-round" color="facebook">
                      <i className="fab fa-facebook" />
                    </Button>
                    <Button className="btn-icon btn-round" color="Instegram">
                      <i className="fab fa-instegram" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default UserProfile;

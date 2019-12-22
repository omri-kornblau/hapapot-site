import React from "react";

import { Card, CardFooter, CardBody, CardText } from "reactstrap";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: props.userData
    };
  }
  getCardBackgroundColor() {
    return this.state.userData.single ? "bg-success" : "bg-danger";
  }

  render() {
    return (
      <Card {...this.props}>
        <CardBody>
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
              <h5 className="title">this.state.userData.NickName</h5>
            </a>
            <p className="birthday">this.state.userData.Birthday</p>
          </div>
          <div className="card-description"></div>
        </CardBody>
        <CardFooter className={this.getCardBackgroundColor()}>
          {/*<div className="button-container">
            <Button className="btn-icon btn-round">
              <i className="fab fa-facebook" />
            </Button>
            <Button className="btn-icon btn-round">
              <i className="fab fa-Instegram" />
            </Button>
          </div>*/}
        </CardFooter>
      </Card>
    );
  }
}

export default UserCard;

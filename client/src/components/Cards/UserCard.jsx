import React from "react";
import {
  Card,
  CardFooter,
  CardBody,
  CardText,
  Col
   } from "reactstrap";

import Utils from "../../utils";

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: props.userdata,
      isOpen : false
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      userData: props.userdata
    });
  }
  getCardBackgroundColor() {
    return this.state.userData.single ? "bg-success" : "bg-danger";
  }
  renderOpenCard(){
    return(<div >
      <h5 className="title">{Utils.pickNickName(this.state.userData.nicknames)}</h5>
        <p className="birthday">
          {Utils.formatDate(this.state.userData.birthday)}
        </p>
        <p>
          {this.state.userData.aboutme}
        </p>
      </div>

    );
  }
  renderClosedCard(){
    return(<div>
            <h5 className="title">{Utils.pickNickName(this.state.userData.nicknames)}</h5>
              <p className="birthday">
                {Utils.formatDate(this.state.userData.birthday)}
              </p>
            </div>
    );
  }
  onBlur= () => {
    this.setState({isOpen : false})
  }

  onFocus = e => {
    this.setState({isOpen : true})
  }

  render() {
    return (
      <Col key={this.state.userData.username}
        onFocus = {this.onFocus}
        onBlur = {this.onBlur}
        tabIndex = {1}
        xs = {this.state.isOpen? 12 : 6} >
      <Card {...this.props}>
        <CardBody>
          <CardText />
            <div className="author">
              <div className="block block-one" />
              <div className="block block-two" />
              <div className="block block-three" />
              <div className="block block-four" />
            </div>
              {this.state.isOpen? this.renderOpenCard() : this.renderClosedCard()}
            <div className="card-description"></div>
        </CardBody>
        <CardFooter className={this.getCardBackgroundColor()}/>
      </Card>
      </Col>
    );
  }
}

export default UserCard;

import React from "react";
import { 
  Card,
  CardFooter,
  CardBody, 
  CardText, 
  Col,
   } from "reactstrap";

import Utils from "../../utils";
import Userblob from "../UserBlob";

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

  onClick = e => {
    this.setState({isOpen : this.state.isOpen? false: true})
  }
  render() {
    return (
      <Col key={this.state.userData.username}
        onBlur = {this.onBlur}
        onClick = {this.onClick}
        tabIndex = {1}
        xs = {this.state.isOpen? 12 : 6} >
      <Card {...this.props}>
        <CardBody >
          <CardText />
            <div className="author">
              <div className="block block-one" />
              <div className="block block-two" />
              <div className="block block-three" />
              <div className="block block-four" />
              
                <Userblob user={this.state.userData}/>
            </div>
              {this.state.isOpen? this.renderOpenCard() : this.renderClosedCard()}
            <div className="card-description"></div>
        </CardBody>
        <CardFooter className={this.getCardBackgroundColor()}>
        </CardFooter>
      </Card>
      </Col>
    );
  }
}

export default UserCard;

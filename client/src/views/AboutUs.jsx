import React from "react";
import { Row, Col } from "reactstrap";
import Axios from "axios";

import UserCard from "components/Cards/UserCard";
import Defaults from "../defaults/defaults";

const renderUsersCards = (users, size) => {
  return users.map(user => {
    return (
      <Col key={user.username} xs={size}>
        <UserCard userdata={user} />
      </Col>
    );
  });
};

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersData: []
    };
  }
  async componentDidMount() {
    try {
      const res = await Axios.get("/api/aboutus");
      this.setState({
        usersData: res.data
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <>
        <div className="content text-right">
          <Row>{renderUsersCards(this.state.usersData, 6)}</Row>
        </div>
      </>
    );
  }
}
export default UserProfile;

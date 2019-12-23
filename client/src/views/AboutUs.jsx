import React from "react";
import { Row, Col } from "reactstrap";

import UserCard from "components/Cards/UserCard";
const renderUsersCards = (users, size) => {
  return users.map(user => {
    return (
      <Col xs={size}>
        <UserCard userData={user}></UserCard>
      </Col>
    );
  });
};

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {}
    };
  }
  async componentDidMount() {
    try {
      const res = await Axios.get("/api/user");
      this.setState({
        userData: res.data
      });
    } catch (err) {}
  }

  render() {
    return (
      <>
        <div className="content text-right">
          <Row>{renderUsersCards(users, 6)}</Row>
        </div>
      </>
    );
  }
}
export default UserProfile;

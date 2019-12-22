import React from "react";
import { Row, Col } from "reactstrap";

import UserCard from "components/Cards/UserCard";

const fakeUser = {
  NickName: "cscs",
  Birthday: "Birthday",
  single: false
};

const amountOfUsers = 15;
const renderUsersCards = (users, size) => {
  return users.map(user => {
    return (
      <Col xs={size}>
        <UserCard userData={user}></UserCard>
      </Col>
    );
  });
};

const users = Array(amountOfUsers)
  .fill(0)
  .map(() => fakeUser);
class UserProfile extends React.Component {
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

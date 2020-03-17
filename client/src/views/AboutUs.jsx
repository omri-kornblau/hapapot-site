import React from "react";
import { Row, Col } from "reactstrap";

import UserCard from "components/Cards/UserCard";
import AboutUsHelper from "../helpers/aboutUs";

const renderUsersCards = (users) => {
  return users.map(user => {
    return (
        <UserCard userdata={user} />
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
      const res = await AboutUsHelper.getPage();
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
          <Row>{renderUsersCards(this.state.usersData)}</Row>
        </div>
      </>
    );
  }
}
export default UserProfile;

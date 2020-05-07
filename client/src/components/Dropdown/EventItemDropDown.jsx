import React, { useState } from "react";

import {
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
  Tooltip,
  Row,
  Col,
  DropdownItem
} from "reactstrap";

import Utils from "../../utils";

const noUsersText = "אין מתנדבים";

const renderUsers = users => {
  return users.map((user, idx) => (
    <h5 key={idx} className="m-0 text-white">
      {Utils.pickNickName(user.nicknames)} - {user.amount}
    </h5>
  ));
}

const DropdownItemsUsers = props => {
  const [ isOpen, setIsOpen ] = useState(false);
  const relevantUsers = props.users.filter(user => user.amount > 0);
  return (
    <>
    <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <DropdownToggle
        id={"tt_" + props.idx}
        className="btn-icon btn-link"
      >
        {isOpen ? "▼" : "▲"}
      </DropdownToggle>
    </Dropdown>
      <Tooltip isOpen={isOpen} target={"tt_" + props.idx} placement="bottom">
        {relevantUsers.length > 0 ? renderUsers(relevantUsers) : noUsersText}
      </Tooltip>
    </>
  );
};

export default DropdownItemsUsers;

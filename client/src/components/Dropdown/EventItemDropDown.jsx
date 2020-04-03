import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Row,
  Col,
  DropdownItem
} from "reactstrap";

const Utils = require("../../utils");

const DropdownItemsUsers = props => (
  <UncontrolledDropdown group>
    <DropdownToggle
      caret
      color={props.color}
      data-toggle="dropdown"
      className="dropdown-toggle btn-icon btn-link btn-sm"
    ></DropdownToggle>
    <DropdownMenu className="text-center">
      {props.users.map(user => {
        if (user.amount <= 0) {
          return;
        }
        return (
          <h5 className="m-0 text-black">
            {Utils.pickNickName(user.nicknames)} - {user.amount}
          </h5>
        );
      })}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default DropdownItemsUsers;

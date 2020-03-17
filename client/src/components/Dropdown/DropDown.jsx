import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link } from "react-router-dom";

const Utils = require("../../utils");

const DropdownItemsUsers = props => (
  <div>
    <UncontrolledDropdown group>
      <DropdownToggle
        caret
        color={props.color}
        data-toggle="dropdown"
        className="dropdown-toggle btn-icon btn-link btn btn-success btn-sm"
      ></DropdownToggle>
      <DropdownMenu>
        {props.users.map(user => (
          <DropdownItem>
            {Utils.pickNickName(user.nicknames)} - {user.amount}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  </div>
);

export default DropdownItemsUsers;

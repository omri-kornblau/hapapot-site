import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link } from "react-router-dom";

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
            {user.name} - {user.amount}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  </div>
);

export default DropdownItemsUsers;

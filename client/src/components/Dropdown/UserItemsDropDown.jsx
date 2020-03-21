import _ from "lodash";
import React from "react";
import { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Tooltip
} from "reactstrap";
import copy from "copy-to-clipboard";

const getListText = props => {
  return props.items
    .filter(item => _.find(item.users, { name: props.user }))
    .map(item => {
      const userInItem = _.find(item.users, { name: props.user });
      return `${item.name}: ${userInItem.amount}`
    }).join("\n");
}

const ItemsList = props => {
  return props.items
    .filter(item => _.find(item.users, { name: props.user }))
    .map(item => {
      const userInItem = _.find(item.users, { name: props.user });
      return <h5 className="mb-2 pt-2 border-top">{item.name} - {userInItem.amount}</h5>;
    });
}

const UserItemsDropDown = props => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onToggleDropdown = () => {
    setTooltipOpen(false);
    setDropdownOpen(!dropdownOpen);
  }

  const onCopyListClick = () => {
    copy(getListText(props));
    setTooltipOpen(true);
    setTimeout(_.partial(setTooltipOpen, false), 1000);
  }

  return <Dropdown isOpen={dropdownOpen} toggle={onToggleDropdown} group>
    <DropdownToggle
      data-toggle="dropdown"
      className="btn-icon btn-link"
    >
      <i className="tim-icons icon-basket-simple"/>
    </DropdownToggle>
    <DropdownMenu className="text-center">
      <h5 className="mb-2"> אתה מביא: </h5>
      <ItemsList {...props}/>
      <h5 className="mb-0 border-top"></h5>
      <a onClick={onCopyListClick} id="copyBtn">
        <i className="text-darker mt-2 mb-2 tim-icons icon-single-copy-04"/>
      </a>
      {
        // Hide the tooltip on dropdown closing, otherwise
        // some crazy stuff is happening to the page
        dropdownOpen ?
        <Tooltip innerClassName="text-white bg-default" placement="bottom" isOpen={tooltipOpen} target="copyBtn">
          הרשימה הועתקה
        </Tooltip> : ""
      }
    </DropdownMenu>
  </Dropdown>
};

export default UserItemsDropDown;
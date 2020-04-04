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
    .map((item, idx) => {
      const userInItem = _.find(item.users, { name: props.user });
      return (
        <h5
          className="mb-2 pt-2 text-white border-top"
          key={idx}
        >
          {item.name} - {userInItem.amount}
        </h5>
      );
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

  return (
    <Dropdown isOpen={dropdownOpen} toggle={() => {}} group>
      <DropdownToggle
        onClick={onToggleDropdown}
        id="user-items-dd"
        className="btn-icon btn-link"
      >
        <i className="tim-icons icon-basket-simple"/>
      </DropdownToggle>
      <Tooltip target="user-items-dd" isOpen={dropdownOpen} className="text-center">
        <h5 className="mb-2 text-white"> אתה מביא: </h5>
        <ItemsList {...props}/>
        <h5 className="mb-0 border-top"></h5>
        <a onClick={onCopyListClick} id="copyBtn">
          <i className="mt-2 mb-2 tim-icons icon-single-copy-04"/>
        </a>
        {
          // Hide the tooltip on dropdown closing, otherwise
          // some crazy stuff is happening to the page
          dropdownOpen ?
          <Tooltip placement="bottom" isOpen={tooltipOpen} target="copyBtn">
            הרשימה הועתקה
          </Tooltip> : ""
        }
      </Tooltip>
    </Dropdown>
  );
};

export default UserItemsDropDown;
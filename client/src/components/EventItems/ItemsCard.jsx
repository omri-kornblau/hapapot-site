import _ from "lodash";
import React, { useState } from "react";
import {
  Button,
  Table,
  CardHeader,
  Row,
  Card,
  CardBody,
  Input,
  UncontrolledTooltip,
  Form
} from "reactstrap";

import EventItemDropDown from "../Dropdown/EventItemDropDown";
import UserItemsDropDown from "../Dropdown/UserItemsDropDown";

const ItemRows = props => {
  const {
    items,
    users,
    onChangeItemUserAmount
  } = props;

  return items.map((item, idx) => (
    <tr key={item.name}>
      <td>
        {item.name}
      </td>
      <td>
        <div className={item.isMissing ? "text-danger" : ""}>
          {item.neededamount} / {item.broughtAmount}
        </div>
      </td>
      <td>
        <EventItemDropDown
          item={item}
          idx={idx}
          users={item.users.map(user => {
            const currentUser = _.find(users, {username: user.name})
            return _.assign(_.clone(currentUser), user);
          })}
        />
      </td>
      <td>
        <Button className="m-1 btn-icon btn-round" color="success" size="sm"
          onClick={() => onChangeItemUserAmount(item, 1)}>
          <i className="tim-icons icon-simple-add"> </i>
        </Button>
        <Button className="m-1 btn-icon btn-round" color="danger" size="sm"
          onClick={() => onChangeItemUserAmount(item, -1)}>
          <i className="tim-icons icon-simple-delete"/>
        </Button>
      </td>
    </tr>
  ));
}

const ItemsCard = (props) => {
  const {
    items,
    users,
    isItemsSorted,
    user,
    onEnterEditMode,
    onChangeItemUserAmount,
    onSortItems,
    onAddItem
  } = props;

  const [newItem, setNewItem] = useState({ name: "", amount: 0 });

  const _onChange = e => {
    const { name, value } = e.target;
    setNewItem(_.set(newItem, name, value));
  }

  const _onAddItem = e => {
    e.preventDefault();
    e.target.reset();
    e.target.querySelector("[name]").focus();
    onAddItem(newItem.name, newItem.amount);
  }

  const isItemsMissing = _.some(items, item =>
    item.broughtAmount < item.neededamount
  );

  return (
    <Card>
      <CardHeader>
        <Row className="justify-content-between mr-2 ml-2">
          <h5 className="title">
            ציוד
            <i className={`mr-3 tim-icons
              ${isItemsMissing ?
                "text-danger icon-thumbs-down-1"
                : "text-success icon-thumbs-up-1"
              } `}
            />
          </h5>
          <Row>
            <span id="sort-btn"> {/* Wrap to enable tooltip on disabled button */}
              <Button
                disabled={isItemsSorted}
                onClick={onSortItems}
                className="btn-icon btn-round" color="link">
                ↓
              </Button>
            </span>
            {isItemsSorted ?
              <UncontrolledTooltip target="sort-btn">
                הפריטים כבר ממוינים
              </UncontrolledTooltip>
            : ""}
            <UserItemsDropDown items={items} user={user}/>
            <Button onClick={onEnterEditMode} className="btn-icon btn-round" color="link">
              <i className="tim-icons icon-pencil"/>
            </Button>
          </Row>
        </Row>
      </CardHeader>
      <CardBody>
        <Form onSubmit={_onAddItem}>
        <Table className="tablesorter text-center" responsive>
          <thead className="text-primary">
            <tr>
              <th>פריט</th>
              <th>
                כמות
                {isItemsSorted ? " ↓ " : ""} {/* ↑*/}
              </th>
              <th>אנשים</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            <ItemRows
              items={items}
              users={users}
              onChangeItemUserAmount={onChangeItemUserAmount}
            />
            <tr>
              <td>
                <Input required placeholder="פריט חדש"
                  onChange={_onChange} name="name"
                />
              </td>
              <td colSpan="2">
                <Input required className="text-center" placeholder="כמות רצויה"
                  type="number" onChange={_onChange} name="amount" min="1"
                />
              </td>
              <td>
                <Button color="link" className="text-success btn-icon" type="submit">
                  <i className="tim-icons icon-simple-add" />
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
        </Form>
      </CardBody>
    </Card>
  );
}

export default ItemsCard;
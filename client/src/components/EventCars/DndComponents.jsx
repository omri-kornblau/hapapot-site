import React from "react";
import {
  Badge,
} from "reactstrap"

import { useDrag, useDrop } from "react-dnd"

import Utils from "../../utils";

const itemTypes = {
  passenger: 'passenger'
}

const Seat = props => {
  const {
    user,
    carId,
    isDriver,
    movePassenger,
  } = props;

  const [, drop] = useDrop({
    accept: itemTypes.passenger,
    drop: (item, monitor) => {
      if (!user) {
        movePassenger(item.user.username, carId, !!isDriver)
      }
    }
  })

  return (
    <td className={isDriver ? "driver" : ""} ref={drop}>
      {
        user ?
        <DragableBadge
          color="primary"
          passenger={Utils.pickNickName(user.nicknames)}
          user={user}
        />
        : isDriver ? <span>נהג</span> : ""
      }
    </td>

  );
}

const DragableBadge = props => {
  const {
    color,
    className,
    passenger,
    user
  } = props;

  const [, drag] = useDrag({
    item: { type: itemTypes.passenger, passenger, user },
  });

  return (
    <span ref={drag}>
      <Badge className={className} color={color}>
        {passenger}
      </Badge>
    </span>
  );
}

const PassengersBox = props => {
  const {
    passengers,
  } = props;

  const [, drop] = useDrop({
    accept: itemTypes.passenger,
    drop: (item, monitor) => {
      props.movePassenger(item.user.username, "", false);
    },
  })

  return (
    <div className="passengers-box" ref={drop}>
      {
        passengers.length > 0 ?
        passengers.map(passenger =>
          <DragableBadge
            key={passenger.username}
            color="primary"
            passenger={Utils.pickNickName(passenger.nicknames)}
            user={passenger}
          />
        )
        : "לכולם יש מקום"
      }
    </div>
  );
}

export { Seat, DragableBadge, PassengersBox };
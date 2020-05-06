import React from "react";
import {
  Badge,
} from "reactstrap"

import { useDrag, useDrop } from "react-dnd"

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
        movePassenger(item.passenger, carId, isDriver ? true : false)
      }
    }
  })

  return (
    <td style={{border: "solid 2px black"}} ref={drop}>
        {
        user ?
        <DragableBadge key={user.username} color="primary" passenger={user}/>
        : ""
        }
    </td>
    
  );
}

const DragableBadge = props => { 
  const {
    color,
    className,
    passenger,
  } = props;

  const [, drag] = useDrag({
    item: {type: itemTypes.passenger , passenger: passenger},
  })

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
      props.movePassenger(item.passenger, "", false);
    },
  })

  return (
    <div style={{border: "solid 2px black", borderRadius: "7px"}} ref={drop}>
      {
        passengers.length > 0 ?
        passengers.map(passenger =>
          <DragableBadge key={passenger.username} color="primary" passenger={passenger.username}/>
        )
        : "לכולם יש מקום"
      }
    </div>
  );
}

export { Seat, DragableBadge, PassengersBox };
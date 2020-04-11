import _ from "lodash";
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Input,
  Button,
  Form,
  Badge,
  Row,
  Col,
} from "reactstrap"

import { DndProvider, useDrag, useDrop } from "react-dnd"
import Html5Backend from "react-dnd-html5-backend"
import TouchBackend from "react-dnd-touch-backend"
import { isMobile } from "react-device-detect"

import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

import Utils from "./Utils"
import { useEffect } from "react";

const ItemTypes = {
  PASSENGER: 'passenger'
}

function DragableBadge(props) {
  const [, drag] = useDrag({
    item: {type: ItemTypes.PASSENGER , passenger: props.passenger},
    collect: monitor => ({
    }),
  })

  return (
    <span ref={drag}>
      <Badge className={props.className} color={props.color}>
        {props.passenger}
      </Badge>
    </span>
  );
}

function Seat(props) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.PASSENGER,
    drop: (item, monitor) => {
      if (!props.user) {
        props.movePassenger(item.passenger, props.carId, props.isDriver ? true : false)
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    })
  })

  return (
    <td style={{border: "solid 2px black"}} ref={drop}>
        {
        props.user ?
        <DragableBadge key={props.user.username} color="primary" passenger={props.user}/> :
        <></>
        }
    </td>
    
  );
}

function Car(props) {
  return (
    <tr>
      {
        props.driver === "" ?
        <Seat carId={props.carId} isDriver={true} movePassenger={props.movePassenger}/> :
        <Seat carId={props.carId} isDriver={true} movePassenger={props.movePassenger} user={props.driver}/>
      }
      {
        [...Array(props.maxPassengers).keys()].map(index => (
          props.passengers.length > index ?
          <Seat carId={props.carId} movePassenger={props.movePassenger} user={props.passengers[index]}/> :
          <Seat carId={props.carId} movePassenger={props.movePassenger}/>
        ))
      }
    </tr>
  );
}

function PassengersBox(props) {
  const [, drop] = useDrop({
    accept: ItemTypes.PASSENGER,
    drop: (item, monitor) => {
      props.movePassenger(item.passenger, "", false);
    },
  })

  return (
    <div style={{border: "solid 2px black", borderRadius: "7px"}} ref={drop}>
      {
        props.passengers.length > 0 ?
        props.passengers.map(passenger =>
          <DragableBadge key={passenger.username} color="primary" passenger={passenger.username}/>
        )
        : "לכולם יש מקום"
      }
    </div>
  );
}

function EventCars(props) {
  const [state, setState] = useState({
    cars: props.cars,
    passengersWithoutCar: Utils.getPassengerswithoutCar(props.passengers, props.cars),
    newCar:{maxPassengers: 0},
    error: ""
  });

  useEffect(() => {
    state.cars = props.cars;
    state.passengersWithoutCar = Utils.getPassengerswithoutCar(props.passengers, props.cars);
    var newState = _.clone(state)
    setState(newState);
  })

  const renderCarList = () => {
    return state.cars.map((car, index) => (
      <Car
        key={car._id}
        driver={car.driver}
        passengers={car.passengers}
        maxPassengers={car.maxPassengers}
        carId={car._id}
        movePassenger={props.movePassenger}/>
    ))
  }

  const onInputChange = async (event) => {
    const { value } = event.target;
    state.newCar = {maxPassengers: parseInt(value)};
    var newState = _.clone(state)
    setState(newState);
  }

  const submitForm = async event => {
    event.preventDefault();
    event.target.reset();
    if (await props.addCar(state.newCar.maxPassengers)) {
      state.newCar.maxPassengers = 0;
      state.error = "";
    } else {
      state.error = "Failed creating car";
    }
    var newState = _.clone(state)
    setState(newState);
  }

  return (
    <Card>
      <CardHeader>
        <h5 className="title">רכבים</h5>
      </CardHeader>
      <CardBody>
        <DndProvider backend={isMobile ? TouchBackend : Html5Backend}>
          <Form onSubmit={submitForm}>
            <Table className="tablesorter table-sm table-striped" style={{tableLayout: "fixed"}}>
              <thead className="text-primary">
                <tr>
                  <th>נהג</th>
                  <th>נוסעים</th>
                </tr>
              </thead>
              <tbody>
              {renderCarList()} 
              </tbody>
            </Table>
            <Row>
              <Col>
                <Input required placeholder="כמות מקומות" type="number" onChange={onInputChange} name="maxPassengers"></Input>
              </Col>
              <Col>
                <Button color="link" className="text-success btn-icon" type="submit">
                  <i className="tim-icons icon-simple-add" />
                </Button>
              </Col>
            </Row>
            {state.error !== "" ? <p className="text-danger">{state.error}</p> : <></>}
            <h6>מחפשים מקום</h6>
            <PassengersBox passengers={state.passengersWithoutCar} movePassenger={props.movePassenger}/>
          </Form>
        </DndProvider>
      </CardBody>
    </Card>
  );
}

export default EventCars;
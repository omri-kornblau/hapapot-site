import _ from "lodash";
import React, { useState, useContext, useReducer } from "react";
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

import MultiBackend, { Preview } from 'react-dnd-multi-backend';
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

const ENTER_EDIT_MOTE = "init";
const DELETE = "delete";
const EDIT_MAX_PASSENGERS = "editMaxPassengers";
const SAVE = "save";
const EXIT = "exit";

function EventCars(props) {
  const [state, setState] = useState({
    cars: props.cars,
    passengersWithoutCar: Utils.getPassengerswithoutCar(props.passengers, props.cars),
    newCar:{maxPassengers: 0},
    error: "",
  });

  useEffect(() => {
    state.cars = props.cars;
    state.passengersWithoutCar = Utils.getPassengerswithoutCar(props.passengers, props.cars);
    const newState = _.clone(state)
    setState(newState);
  })

  const [edit, dispatch] = useReducer(
    (edit, action) => {
      switch (action.type) {
        case ENTER_EDIT_MOTE: {

          return {
            isEditMode: true,
            cars: _.clone(state.cars),
            actions: {},
          }
        }
        case DELETE: {
          const cars = edit.cars.filter(car => (
            car._id !== action._id
          ));

          const actions = _.clone(edit.actions);
          actions[action._id] = {type: action.type};
          return {...edit, actions, cars};
        }
        case EDIT_MAX_PASSENGERS: {
          const cars = edit.cars.map(car => {
            if (car._id === action._id) {
              car.maxPassengers = action.value;
            }
            return car;
          });

          const actions = _.clone(edit.actions);
          actions[action._id] = action;
          return {...edit, actions, cars};
        }
        case SAVE: {
          return {...edit, isEditMode: false};
        }
        case EXIT: {
          return {...edit, isEditMode: false};
        }
      }
    }, {
      isEditMode: false,
      cars: [],
      actions: {},
    }
  );

  const dispatchEdit = async action => {
    switch (action.type) {
      case SAVE: {
        if (await props.onCarUpdated(edit.actions)) {
          dispatch({type: EXIT});
          return;
        } else {
          return;
        }
      }
      default: {
        dispatch(action);
      }
    }
  }

  const onInputChange = async (event) => {
    const { value } = event.target;
    state.newCar = {maxPassengers: parseInt(value)};
    const newState = _.clone(state)
    setState(newState);
  }

  const submitForm = async event => {
    event.preventDefault();
    event.target.reset();
    if (await props.onCarAdded(state.newCar.maxPassengers)) {
      state.newCar.maxPassengers = 0;
      state.error = "";
    } else {
      state.error = "Failed creating car";
    }
    const newState = _.clone(state)
    setState(newState);
  }

  const _movePassenger = async (passenger, destCarId, isDriver) => {
    state.cars = state.cars.map(car => {
      if (car.driver === passenger) {
        car.driver = 0;
      }
      car.passengers = car.passengers.filter(currentPassenger => (
        passenger !== currentPassenger
      ));

      if (car._id === destCarId) {
        if (isDriver) {
          car.driver = passenger;
        } else {
          if (car.passengers.length < car.maxPassengers) {
            car.passengers.push(passenger);
          }
        }
      }
      return car;
    });

    const newState = _.clone(state)
    setState(newState);

    props.onPassengerMoved(passenger, destCarId, isDriver);
  }

  const GeneratePreview = () => {
    const {style, item} = useContext(Preview.Context);
    return (
      <span style={style}>
        <Badge  color="primary">
          {item.passenger}
        </Badge>
      </span>
    );
  }

  return (
    edit.isEditMode ?
    <Card>
      <CardHeader>
        <Row className="justify-content-between mr-2 ml-2">
          <h5 className="title">עריכת מכוניות</h5>
          <Row>
            <Button onClick={() => {dispatchEdit({type: EXIT})}} className="btn-icon btn-round" color="link">
              <i className="text-danger tim-icons icon-simple-remove"/>
            </Button>
            <Button onClick={() => {dispatchEdit({type: SAVE})}} className="btn-icon btn-round mr-3" color="success">
              <i className="tim-icons icon-check-2"/>
            </Button>
          </Row>
        </Row>
      </CardHeader>
      <CardBody>
        <Table className="tablesorter text-center">
          <thead className="text-primary">
            <tr>
              <th>כמות מקומות (לא כולל נהג)</th>
              <th/>
            </tr>
          </thead>
            {edit.cars.map(car => (
              <tr>
                <td>
                  <Input type="number" name={car._id} value={car.maxPassengers} onChange={(e) => {dispatchEdit({type: EDIT_MAX_PASSENGERS, _id: car._id, value: Number.parseInt(e.target.value)})}}/>
                </td>
                <td>
                  <i className="text-danger tim-icons icon-trash-simple" onClick={() => {dispatchEdit({type: DELETE, _id: car._id})}}/>
                </td>
              </tr>
            ))}
          <tbody>
          </tbody>
        </Table>
      </CardBody>
    </Card>
    :
    <Card>
      <CardHeader>
        <Row className="justify-content-between mr-2 ml-2">
          <h5 className="title">
            רכבים
            <i className={`mr-3 tim-icons
              ${state.passengersWithoutCar.length === 0 ?
                "text-success icon-thumbs-up-1"
                : "text-danger icon-thumbs-down-1"
              } `}
            />
          </h5>
          <i className="tim-icons icon-pencil" onClick={() => {dispatchEdit({type: ENTER_EDIT_MOTE})}}/>
        </Row>
      </CardHeader>
      <CardBody>
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
          <Preview>
            <GeneratePreview/>
          </Preview>
          <Form onSubmit={submitForm}>
            <Table className="tablesorter table-sm table-striped" style={{tableLayout: "fixed"}}>
              <thead className="text-primary">
                <tr>
                  <th>נהג</th>
                  <th>נוסעים</th>
                </tr>
              </thead>
              <tbody>
                {
                  state.cars.map((car) => (
                    <Car
                      key={car._id}
                      driver={car.driver}
                      passengers={car.passengers}
                      maxPassengers={car.maxPassengers}
                      carId={car._id}
                      movePassenger={_movePassenger}/>
                  ))
                }
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
            <PassengersBox passengers={state.passengersWithoutCar} movePassenger={_movePassenger}/>
          </Form>
        </DndProvider>
      </CardBody>
    </Card>
  );
}

export default EventCars;
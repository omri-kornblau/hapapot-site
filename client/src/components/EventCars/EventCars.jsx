import _ from "lodash";
import React, { useState, useContext, useLayoutEffect } from "react";
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

import { DndProvider } from "react-dnd"

import MultiBackend, { Preview } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'; 

import CarUtils from "./CarUtils"

import {
  Seat,
  PassengersBox 
} from "./DndComponents"

import {
  EditCars
} from "./EditCars"

function Car(props) {
  const {
    carId,
    driver,
    passengers,
    maxPassengers,
    movePassenger,
  } = props;

  return (
    <tr>
      {
        props.driver === "" ?
        <Seat carId={carId} isDriver={true} movePassenger={movePassenger}/> :
        <Seat carId={carId} isDriver={true} movePassenger={movePassenger} user={driver}/>
      }
      {
        _.range(maxPassengers).map(index => (
          passengers.length > index ?
          <Seat key={index} carId={carId} movePassenger={movePassenger} user={passengers[index]}/>
          : <Seat key={index} carId={carId} movePassenger={movePassenger}/>
        ))
      }
    </tr>
  );
}

function EventCars(props) {
  const {
    cars,
    passengers,
    onCarAdded,
    onPassengerMoved,
    onCarUpdated,
  } = props;

  const [state, setState] = useState({
    cars: cars,
    passengersWithoutCar: CarUtils.getPassengerswithoutCar(passengers, cars),
    newCar:{maxPassengers: 0},
    isEditMode: false,
    error: "",
  });

  useLayoutEffect(() => {
    if (!_.isEqual(state.cars, cars)) {
      state.cars = cars;
      setState({...state});
    }

    const passengersWithoutCar = CarUtils.getPassengerswithoutCar(passengers, cars);
    if (!_.isEqual(state.passengersWithoutCar, passengersWithoutCar)) {
      state.passengersWithoutCar = passengersWithoutCar;
      setState({...state});
    }
  })

  const onInputChange = async (event) => {
    const { value } = event.target;
    state.newCar = { maxPassengers: parseInt(value) };
    setState({...state});
  }

  const submitForm = async e => {
    e.preventDefault();
    e.target.reset();
    if (await onCarAdded(state.newCar.maxPassengers)) {
      state.newCar.maxPassengers = 0;
      state.error = "";
    } else {
      state.error = "Failed creating car";
    }
    setState({...state});
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

    setState({...state});

    onPassengerMoved(passenger, destCarId, isDriver);
  } 

  const enterEditMode = () => {
    setState({...state, isEditMode: true});
  }

  const exitEditMode = () => {
    setState({...state, isEditMode: false});
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
    state.isEditMode ?
    <EditCars cars={state.cars} exitEditMode={exitEditMode} onCarUpdated={onCarUpdated}/>
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
          <i className="tim-icons icon-pencil" onClick={enterEditMode}/>
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
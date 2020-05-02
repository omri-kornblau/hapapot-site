import _ from "lodash";
import React, { useReducer } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Input,
  Button,
  Row,
} from "reactstrap"

import CarUtils from "./CarUtils"

import {
  Actions,
  useActions
} from "./CarActions"

function EditCars(props) {
  const {
    cars,
    exitEditMode,
    onCarUpdated,
  } = props;

  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case Actions.DELETE: {
          return CarUtils.deleteCar(state, action);
        }
        case Actions.EDIT_MAX_PASSENGERS: {
          return CarUtils.editMaxPassengers(state, action);
        }
        case Actions.SAVE: {
          return {...state};
        }
        case Actions.EXIT: {
          exitEditMode();
          return {...state};
        }
        default: {
          return state;
        }
      }
    }, {
      cars: _.clone(cars),
      actions: {},
    }
  );

  const dispatchMiddlware = async action => {
    switch (action.type) {
      case Actions.SAVE: {
        try {
          await onCarUpdated(state.actions);
          dispatch({type: Actions.EXIT});
        } catch (err) {
          console.error(err);
        }
        break;
      }
      default: {
        dispatch(action);
      }
    }
  }

  const actions = useActions(dispatchMiddlware);

  return (
    <Card>
      <CardHeader>
        <Row className="justify-content-between mr-2 ml-2">
          <h5 className="title">עריכת מכוניות</h5>
          <Row>
            <Button onClick={actions.exit} className="btn-icon btn-round" color="link">
              <i className="text-danger tim-icons icon-simple-remove"/>
            </Button>
            <Button onClick={actions.save} className="btn-icon btn-round mr-3" color="success">
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
          <tbody>
            {state.cars.map(car => (
              <tr key={car._id}>
                <td>
                  <Input type="number" name={car._id} value={car.maxPassengers} onChange={(e) => {actions.editMaxPassengers(car._id, Number.parseInt(e.target.value))}}/>
                </td>
                <td>
                  <i className="text-danger tim-icons icon-trash-simple" onClick={() => {actions.delete(car._id)}}/>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

export { EditCars };
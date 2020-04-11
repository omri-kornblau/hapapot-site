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
} from "reactstrap";


const EditItemsCard = props => {
  const {
    items,
    onLeaveEditMode,
    onEditSave
  } = props;

  const [editedItems, setEditedItems] = useState(items);

  const _onEditedItemChange = e => {
    const { name, value } = e.target;
    setEditedItems(prevItems =>
      prevItems.map(item => {
        if (item.name === name) {
          item.neededamount = value;
        }
        return item;
      })
    );
  }

  const _onDeleteEditedItem = itemName => () => {
    setEditedItems(prevItems =>
      _.reject(prevItems, { name: itemName })
    );
  }

  return (
    <Card>
      <CardHeader>
        <Row className="justify-content-between mr-2 ml-2">
          <h5 className="title">עריכת ציוד</h5>
          <Row>
            <Button onClick={onLeaveEditMode} className="btn-icon btn-round" color="link">
              <i className="text-danger tim-icons icon-simple-remove"/>
            </Button>
            <Button onClick={() => onEditSave(editedItems)}
              className="btn-icon btn-round mr-3" color="success">
              <i className="tim-icons icon-check-2"/>
            </Button>
          </Row>
        </Row>
      </CardHeader>
      <CardBody>
        <Table className="tablesorter text-center" responsive>
          <thead className="text-primary">
            <tr>
              <th>פריט</th>
              <th>כמות רצויה</th>
              <th/>
              <th/>
            </tr>
          </thead>
          <tbody>
            {editedItems.map(item =>
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>
                  <Input
                    onChange={_onEditedItemChange}
                    name={item.name} type="number"
                    min={1} value={item.neededamount}
                  />
                </td>
                <td></td>
                <td>
                  <Button onClick={_onDeleteEditedItem(item.name)} color="link" className="btn-sm btn-round">
                    <i className="text-danger tim-icons icon-trash-simple" />
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default EditItemsCard;
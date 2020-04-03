import _ from "lodash";
import React from "react";
import {
  Button,
  Table,
  CardHeader,
  Row,
  Card,
  CardBody,
  Input,
} from "reactstrap";

class EventItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      itemsOnEdit: [],
      isEditMode: false
    }
  }

  enterItemsEditMode = () => {
    const itemsOnEdit = _.cloneDeep(this.state.items);
    this.setState({ isEditMode: true, itemsOnEdit });
  }

  leaveItemsEditModeNoChanges = () => {
    this.setState({ isEditMode: false });
  }

  leaveItemsEditModeSaveChanges = async () => {
    const items = this.state.itemsOnEdit;
    try {
      const res = await EventHelper.updateItems(this.date, this.name, items);
      // TODO: change to callback which change the main event compenent
      this.setState({ isEditMode: false, items: res.data });
    } catch(err) {
      console.error(err);
    }
  }

  renderItemsCard = () => {
    return (
      <Card>
        <CardHeader>
          <Row className="justify-content-between mr-2 ml-2">
            <h5 className="title">ציוד</h5>
            <Row>
              <Button onClick={this.enterItemsEditMode} className="btn-icon btn-round" color="link">
                <i className="tim-icons icon-pencil"/>
              </Button>
            </Row>
          </Row>
        </CardHeader>
        <CardBody>
          <Table className="tablesorter text-center" responsive>
            <thead className="text-primary">
              <tr>
                <th>פריט</th>
                <th>כמות</th>
                <th>אנשים</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              <this.renderExistsItemsRows/>
              <tr>
                <td>
                  <Input placeholder="פריט חדש" onChange={this.onInputChange} name="name"></Input>
                </td>
                <td>
                  <Input placeholder="כמות רצויה" type="number" onChange={this.onInputChange} name="amount" min="1"></Input>
                </td>
                <td></td>
                <td>
                  <Button color="link" className="text-success btn-icon" onClick={this.AddItem}>
                    <i className="tim-icons icon-simple-add" />
                  </Button>
                </td>
              </tr>
            </tbody>
            </Table>
        </CardBody>
      </Card>
    );
  }

  renderEditItemsCard = () => {
    return (
      <Card>
        <CardHeader>
          <Row className="justify-content-between mr-2 ml-2">
            <h5 className="title">עריכת ציוד</h5>
            <Row>
              <Button onClick={this.leaveItemsEditModeNoChanges} className="btn-icon btn-round" color="link">
                <i className="text-danger tim-icons icon-simple-remove"/>
              </Button>
              <Button onClick={this.leaveItemsEditModeSaveChanges} className="btn-icon btn-round mr-3" color="success">
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
              <this.renderEditModeItemsRows/>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }

  render() {
    { this.state.isEditMode ?
      <this.renderEditItemsCard/> :
      <this.renderItemsCard/>
    }
  } 
}

export default EventItems
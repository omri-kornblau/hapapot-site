import React from 'react'
import { Link } from 'react-router-dom';

class DayBlob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendance: props.attendance,
      events: props.events,
      date: ""
    }
  }
  componentWillReceiveProps(props) {
    this.setState({...props});
  }
  getBackgroundColor() {
    return `hsl(220, ${this.state.attendance}%, 60%)`;
  }

  render() {
    return (
      <div
        onClick = {this.props.onClick}
        style={{backgroundColor: this.getBackgroundColor()}}
        className="day-blob">
      </div>
    )
  }
}

export default DayBlob;
import React from 'react'
import moment from 'moment'

class DayBlob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendance: props.attendance,
      events: props.events,
      selected: false,
      date: props.date
    }
  }
  componentWillReceiveProps(props) {
    this.setState({ selected: props.selected });
    this.setState({...props});
  }
  getFillerHeight() {
    return `${100 - this.state.attendance}%`
  }

  render() {
    return (
      <div
        onClick = {this.props.onClick}
        className={`day-blob ${this.state.selected ? 'active' : ''}`}>
        <div
          className="day-blob-filler"
          style={{top: this.getFillerHeight()}}>
        </div>
        <div className="day-blob-mask">
          {moment(this.state.date).format("DD")}
        </div>
      </div>
    )
  }
}

export default DayBlob;
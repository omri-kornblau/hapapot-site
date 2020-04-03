import React from "react";
import he from "moment/locale/he"
import moment from "moment";

moment.locale();

class DayBlob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendance: props.attendance,
      events: props.events,
      selected: false,
      date: props.date
    };
  }
  componentWillReceiveProps(props) {
    this.setState({ selected: props.selected });
    this.setState({ ...props });
  }
  getFillerHeight() {
    return `${100 - this.state.attendance}%`;
  }

  render() {
    const dateObj = moment(this.state.date);
    const isFirstInMonth = dateObj.date() === 1;
    return (
      <div
        onClick={this.props.onClick}
        className={`day-blob ${this.state.selected ? "active" : ""}`}
      >
        <div
          className="day-blob-filler"
          style={{ top: this.getFillerHeight() }}
        ></div>
        <div className="ml-1 mr-1 pt-1 day-blob-mask">
          { this.state.events.map(event =>
              <div key={event.name} className="day-blob-event"/>
            )
          }
        </div>
        <div className="day-blob-mask">
          <small>{dateObj.format("DD")}</small>
        </div>
        {
          isFirstInMonth || this.props.showMonth ?
          <div className="day-blob-mask month">
            <small>{dateObj.format("MMM")}</small>
          </div> :
          ""
        }
      </div>
    );
  }
}

export default DayBlob;

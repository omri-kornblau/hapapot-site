import React from "react";
import he from "date-fns/locale/he";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  FormGroup,
  Input
} from "reactstrap";

registerLocale("he", he);

const CustomDatePickerElement = ({ value, onClick, labelName }) => (
  <div>
    <label>{labelName}</label>
    <Input
      onClick={onClick}
      value={value}
      onFocus={e => e.target.readOnly = true}
      onBlur={e => e.target.readOnly = false}
      readOnly={false}
    ></Input>
  </div>
);

const CustomDatePicker = props => (
  <FormGroup>
    <DatePicker
      {...props}
      locale="he"
      shouldCloseOnSelect={false}
      customInput={<CustomDatePickerElement labelName={props.name}/>}
    />
  </FormGroup>
);

export default CustomDatePicker;
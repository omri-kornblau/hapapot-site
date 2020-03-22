import _ from "lodash";
import React from "react";
import Autosuggest from 'react-autosuggest';
import { Input, Row} from "reactstrap";


class Costumeautosuggest extends React.Component {
    constructor(props) {
    super(props);
      this.state = {
      value :  props.value,
      suggestions : []

    }; 
    }
  renderInputComponent = inputProps => (
  <div>
    <Input {...inputProps} />
  </div>
);
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
    this.props.onChange(_.find(this.state.suggestions,{username : newValue}));
  }; 
  onSuggestionsFetchRequested = async({ value }) => {
    this.setState({
      suggestions: await this.props.getSuggestions(value)
    });
  };
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: this.state.suggestions
    });
  };
  getSuggestionValue = suggestion => suggestion.username;
  
  renderSuggestion(suggestion) {
    const suggestionText = `${suggestion.username}`;
    return (
      <Row>
          <img className = "rounded-circle" src={suggestion.profilePic} width = "30px" height="30px"  alt = ""/>
          <span>{suggestionText}</span>
      </Row>
    );
  };
  render() {
    const {value} = this.state;
    const inputProps = {
      placeholder: "שם משתמש",
      onChange: this.onChange,
      value ,
    };

    return ( 
      <Autosuggest 
        renderInputComponent={this.renderInputComponent}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps} />
    );
    }
  }
    
export default Costumeautosuggest;
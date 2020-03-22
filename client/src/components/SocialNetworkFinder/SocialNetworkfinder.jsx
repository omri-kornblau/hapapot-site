import React from "react";
import Axios from "axios";
import Costumeautosuggest from "./Costumeautosuggest";




class SocialNetworkfinder extends React.Component {
    constructor(props) {
    super(props);
      this.state = {
      onChange : props.onChange,
      value: props.value
    }; 
  }
    componentWillReceiveProps(props) {
    this.setState({ selected: props.selected });
    this.setState({ ...props });
  }
    getProfiles = async name => {
      const profiles =  await Axios.get(`https://www.instagram.com/web/search/topsearch/?query=${name}`);
      return profiles.data.users.map(profile =>{  
          return {
            username: profile.user.username , 
            profilePic: profile.user.profile_pic_url
          }
      })
    }


    render() {
    return (
      <>
      <label>אינסטגרם</label>
      <Costumeautosuggest
      getSuggestions = {this.getProfiles}
      onChange = {this.state.onChange}
      value = {this.state.value} />
      </>
    );
  }
}

export default SocialNetworkfinder;

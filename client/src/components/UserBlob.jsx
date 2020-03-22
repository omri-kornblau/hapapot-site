import React from "react";
import Avatar from 'react-avatar';

class UserBlob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: props.user,
    };

  }
  createInitialsPic = (firstName,lestName) =>{
    return (
      <Avatar name={`${firstName} ${lestName}`} maxInitials={2} round={true} size="30"  textSizeRatio = {1}/>
    );
  }
  createSrclsPic = url =>{
    return(
      <img className = "rounded-circle" src={url} width = "30px" height="30px" alt=""/>
    )
  }
  picPiker = userData =>{
    return(userData.instagram.profilePic? 
      this.createSrclsPic(userData.instagram.profilePic):
      this.createInitialsPic(userData.firstname, userData.lastname) 
    );
  }
  render() {
    return (
      this.picPiker(this.state.userData)
    );
  }
}

export default UserBlob;

import  React from 'react';


class Form extends React.Component{
constructor(props) {
  super(props)
  this.state = {
    username:''
  }
  this.userNameHandler = this.userNameHandler.bind(this);
}

userNameHandler(e){
    this.setState({
        username:e.target.value
    })
}

render(){
    return(
        <>
        {/* <h4>This is a Form Component...</h4> */}
        <label htmlFor="">User_name</label>
        <input type="text" name="" id="" value={this.state.username} onChange={this.userNameHandler} />
        </>
    )
}

}
export default Form;
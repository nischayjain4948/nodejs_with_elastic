import React from 'react';
import ChildComponent from './ChildComponent';

class ParentComponent extends React.Component{
constructor(){
    super();
    this.state={
        Myname:"Nischay jain"
    }
    this.handler = this.handler.bind(this);
}

handler(a){
    // alert(`Hello, my name is ${this.state.Myname}`);
  this.setState({
    Myname:a
  })
}
render(){
    return(
        <>     
          <ChildComponent handlerFunction={this.handler}/>
          <h4>{this.state.Myname}</h4>
        </>
    )
}


}

export default ParentComponent;

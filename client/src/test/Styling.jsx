import React from 'react'
import './StyleSheet.css';
const Styling = (props) => {
    const className = props.primary ? 'primary' : '' ;
  return (
   <>
   <h4 className={className}>Hello, my name is nischay</h4>
   </>
  )
}

export default Styling
import React from 'react'

const ChildComponent = (props) => {
  return (
    <>
    <button onClick={()=>props.handlerFunction("my name is nischay jain")} >Click me</button>
    </>
  )
}

export default ChildComponent
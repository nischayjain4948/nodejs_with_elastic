import React from 'react'

const ListRendering = ({person}) => {
  return (
    <>
    <h4>{`My title is '${person.webinar_title}' and my start_date is ${person.start_date} and end_date ${person.end_date}`}</h4>
    </>
  )
}

export default ListRendering
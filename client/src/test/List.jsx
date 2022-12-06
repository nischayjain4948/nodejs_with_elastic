import React from 'react'
import ListRendering from './ListRendering'

const List = () => {

    const persons = [
        {
            "webinar_title": "Thorin ockenshield plese take the gold and  get lost!",
            "start_date": 1670389619000,
            "end_date": 1670390519000,
            "roomId": "638ece5f335418e8e3ed5aed",
            "_id": "aGzW5YQBwRaFiOgnJscG"
        },
        {
            "webinar_title": "Thorin plese take the gold and  get lost!",
            "start_date": 1669852118416,
            "end_date": 1669188037545,
            "roomId": "6389e041a577ad1c495998b8",
            "_id": "YWyU0oQBwRaFiOgnAseN"
        },
        {
            "webinar_title": "Thorin plese take the gold and  get lost!",
            "start_date": 1669852118416,
            "end_date": 1669188037545,
            "roomId": "638d70dee19fd60155841beb",
            "_id": "YmyA4IQBwRaFiOgn6ccR"
        }
    ]

  return (
  
    <>
    {persons.map(person =><ListRendering key={person._id} person = {person}/>)}
    </>
  )
}

export default List
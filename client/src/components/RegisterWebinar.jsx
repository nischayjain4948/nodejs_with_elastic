
import React from "react";
import { useState } from 'react'
import Axios from 'axios';



export const RegisterWebinar = () => {



  // All fields
  const [webinar_title, setWebinarTitle] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [hosts, setHosts] = useState([]);


  // Checkbox
  const [qa, setQA] = useState(false);
  const [registration, setRegistration] = useState(false);
  const [webinar_recording, setWebinarRecoring] = useState(false);


  // Errors
  const [webinar_title_error, setWebinarTitleError] = useState(false);
  const [password_error, setPasswordError] = useState(false);
  const [start_date_error, setStartDateError] = useState(false);
  const [end_date_error, setEndDateError] = useState(false);
  const [hosts_error, setHostsError] = useState(false);
  const [option_error, setOptionError] = useState(false);


  const formHandler = (e) => {
    e.preventDefault();
  }


  const webinarTitleHandler = (e) => {
    setWebinarTitle(e.target.value);
    ((!webinar_title || webinar_title.length < 15) ? setWebinarTitleError(true) : setWebinarTitleError(false))
  }

  const descriptionHandler = (e) => {
    setDescription(e.target.value);
    // console.log(description);
  }


  const passwordHandler = (e) => {
    setPassword(e.target.value);
    const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    ((!password || !password.match(reg) ? setPasswordError(true) : setPasswordError(false)));

  }
  const startDateHandler = (e) => {
    setStartDate(e.target.value);
    ((  + new Date(e.target.value) <= Date.now()) ? setStartDateError(true) : setStartDateError(false))
  }
  const endDateHandler = (e) => {
    setEndDate(e.target.value);
    (( + new Date(e.target.value) < new Date(start_date)) ? setEndDateError(true) : setEndDateError(false));

  }
  const hostsHandler = (e) => {
    const tempArray = [e.target.value]
    setHosts(tempArray);
    (hosts.length < 1 ? setHostsError(true) : setHostsError(false));
  }


  const getData = async () => {

    if(!webinar_title || !description || !password || !start_date || !end_date || !hosts.length > 1 ){
      return; 
    }

    var newStartDate = start_date;
    newStartDate = new Date(newStartDate).getTime();
    var newEndDate = end_date; newEndDate = new Date(newEndDate).getTime();
   
    const hosTrim =  hosts[0].trim();
    const splitArr = hosTrim.split("\n");
    const hostArray = splitArr.filter(x=>x);


   

    const body = {title:webinar_title, description:description, qa:qa, registration:registration, record:webinar_recording, password:password, startDate:newStartDate, endDate:newEndDate, hostIds:hostArray};
    // console.log(body);
  
   const result =  await Axios.post("http://localhost:4200/v1/webinar/schedule_webinar", body)


  }
  return (
    <>
      <div className="container">
        <form onSubmit={formHandler}>


          <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Webinar Title:</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" onChange={webinarTitleHandler} value={webinar_title} required />
              <br />
              {webinar_title_error ? <p className="text-danger">Please fill the webinar title Minimum length 15 </p> : ""}
              <br />
            </div>
          </div>



          <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Description:</label>
            <div className="col-sm-10">
              <textarea className="form-control" name="" id="textarea1" cols="30" rows="5" onChange={descriptionHandler} value={description} required ></textarea>
              <br />
            </div>
          </div>

          <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <input type="checkbox" className="btn-check" id="btncheck1" value="qa" checked={qa} onChange={() => setQA(!qa)} autoComplete="off"/>
            <label className="btn btn-outline-primary" >QA</label>

            <input type="checkbox" className="btn-check" id="btncheck2" value="registration" checked={registration} onChange={() => setRegistration(!registration)} autoComplete="off"/>
            <label className="btn btn-outline-primary" >Registration</label>

            <input type="checkbox" className="btn-check" id="btncheck3" autoComplete="off" value="webinar_recording" checked={webinar_recording} onChange={() => setWebinarRecoring(!webinar_recording)}/>
            <label className="btn btn-outline-primary" >Webinar_Recording</label>
            <br />
            <br />
          </div>
          {option_error ? <p className="text-danger">Please choose atleast one option</p> : ""}


          <div className="form-group row"  >
            <label  className="col-sm-2 col-form-label">Password</label>
            <div className="col-sm-10">
              <input type="password" className="form-control"  onChange={passwordHandler} value={password} required />
              <br />
              {password_error ? <p className="text-danger">Please fill the password field One letter capital min 6 length</p> : ""}
            </div>
          </div>

          <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Start Date :</label>
            <div className="col-sm-10">
              <input type="datetime-local" className="form-control"  onChange={startDateHandler} value={start_date} required />
              <br />
              {start_date_error ? <p className="text-danger">Date and time Must be grethar than current Date and time </p> : ""}
            </div>
          </div>


          <div className="form-group row">
            <label  className="col-sm-2 col-form-label">End Date : </label>
            <div className="col-sm-10">
              <input type="datetime-local" className="form-control"  onChange={endDateHandler} value={end_date} required />
              <br />
              {end_date_error ? <p className="text-danger"> End Date  Must be grethar than Start Date  </p> : ""}
            </div>
          </div>



          <div className="form-group row">
            <label  className="col-sm-2 col-form-label">Hosts:</label>
            <div className="col-sm-10">
              <textarea className="form-control" name="" id="textarea2" cols="30" rows="5" onChange={hostsHandler} value={hosts} required></textarea>
              <br />


              {hosts_error ? <p className="text-danger"> Hosts Can't be Empty..!! </p> : ""}

            </div>
          </div>
          <br />

          <br />
          {!webinar_title_error && !password_error && !start_date_error && !end_date_error ?
          <button className="btn btn-primary" onClick={getData}>Register Now</button>
 :
 ""             
}


        </form>
      </div>






    </>

  )





}


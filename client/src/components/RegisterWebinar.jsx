
import React from "react";
import { useState } from 'react'



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
    // console.log (+ new Date(e.target.value));
    ((!start_date || + new Date(e.target.value) <= Date.now()) ? setStartDateError(true) : setStartDateError(false))
  }
  const endDateHandler = (e) => {
    setEndDate(e.target.value);
    ((!end_date || + new Date(e.target.value) < new Date(start_date)) ? setEndDateError(true) : setEndDateError(false));

  }
  const hostsHandler = (e) => {
    const tempArray = [e.target.value]
    setHosts(tempArray);
    (hosts.length < 0 ? setHostsError(true) : setHostsError(false));
  }




  const getData = () => {

    ((!qa && !registration && !webinar_recording) ? setOptionError(true) : setOptionError(false));
    console.log(webinar_title);
    console.log(description);
    console.log(password);
    console.log(start_date);
    console.log(end_date);
    console.log(hosts);
    console.log(qa);
    console.log(registration);
    console.log(webinar_recording);



  }
  return (
    <>
      <div className="container">
        <form onSubmit={formHandler}>


          <div class="form-group row">
            <label for="inputEmail3" class="col-sm-2 col-form-label">Webinar Title:</label>
            <div class="col-sm-10">
              <input type="text" class="form-control" onChange={webinarTitleHandler} value={webinar_title} required />
              <br />
              {webinar_title_error ? <p class="text-danger">Please fill the webinar title Minimum length 15 </p> : ""}
              <br />
            </div>
          </div>



          <div class="form-group row">
            <label for="inputEmail3" class="col-sm-2 col-form-label">Description:</label>
            <div class="col-sm-10">
              <textarea className="form-control" name="" id="" cols="30" rows="5" onChange={descriptionHandler} value={description} required ></textarea>
              <br />
            </div>
          </div>

          <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
            <input type="checkbox" class="btn-check" id="btncheck1" value="qa" checked={qa} onChange={() => setQA(!qa)} autocomplete="off" />
            <label class="btn btn-outline-primary" for="btncheck1">QA</label>

            <input type="checkbox" class="btn-check" id="btncheck2" value="registration" checked={registration} onChange={() => setRegistration(!registration)} autocomplete="off" />
            <label class="btn btn-outline-primary" for="btncheck2">Registration</label>

            <input type="checkbox" class="btn-check" id="btncheck3" autocomplete="off" value="webinar_recording" checked={webinar_recording} onChange={() => setWebinarRecoring(!webinar_recording)} />
            <label class="btn btn-outline-primary" for="btncheck3">Webinar_Recording</label>
            <br />
            <br />
          </div>
          {option_error ? <p class="text-danger">Please choose atleast one option</p> : ""}


          <div class="form-group row"  >
            <label for="inputPassword3" class="col-sm-2 col-form-label">Password</label>
            <div class="col-sm-10">
              <input type="password" class="form-control" id="inputPassword3" onChange={passwordHandler} value={password} required />
              <br />
              {password_error ? <p class="text-danger">Please fill the password field One letter capital min 6 length</p> : ""}
            </div>
          </div>

          <div class="form-group row">
            <label for="inputPassword3" class="col-sm-2 col-form-label">Start Date :</label>
            <div class="col-sm-10">
              <input type="datetime-local" class="form-control" id="inputPassword3" onChange={startDateHandler} value={start_date} />
              <br />
              {start_date_error ? <p class="text-danger">Date and time Must be grethar than current Date and time </p> : ""}
            </div>
          </div>


          <div class="form-group row">
            <label for="inputPassword3" class="col-sm-2 col-form-label">End Date : </label>
            <div class="col-sm-10">
              <input type="datetime-local" class="form-control" id="inputPassword3" onChange={endDateHandler} value={end_date} />
              <br />
              {end_date_error ? <p class="text-danger"> End Date  Must be grethar than Start Date  </p> : ""}
            </div>
          </div>



          <div class="form-group row">
            <label for="inputEmail3" class="col-sm-2 col-form-label">Hosts:</label>
            <div class="col-sm-10">
              <textarea className="form-control" name="" id="" cols="30" rows="5" onChange={hostsHandler} value={hosts} required></textarea>
              <br />


              {hosts_error ? <p class="text-danger"> Hosts Can't be Empty..!! </p> : ""}

            </div>
          </div>
          <br />

          <br />
          <button className="btn btn-primary" onClick={getData}>Register Now</button>



        </form>
      </div>






    </>

  )





}


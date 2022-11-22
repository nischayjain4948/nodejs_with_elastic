
const express = require('express');
const validator = require('validator');
const app = express();
app.use(express.json());
const { router, esclient } = require('./newconn');

app.post('/webinar/schedule', (req, res) => {

    let { webinar_title: webinar_name, description, qa, registration, record_webinar, password, time_zone, start_date, hosts } = req.body;

    if ((webinar_name && description && qa && registration && record_webinar && password && time_zone && start_date && hosts) === "") {
        return res.status(301).send({"require":"All fields are require"})
    }
    if (password) {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (!password.match(reg)) {
         return res.status(301).send({"passwordError" :"Password Must be one capital letter and at least 6 character"})
        }
    }
    if(start_date){

      const check  =  !Number.isNaN(start_date) && Number.isFinite(start_date) && /^\d+\.?\d+$/.test(start_date);
      if(!check){

        return res.status(301).send({"start_date" :"start_date must be a timestamp"});

      }
       
    }
    if(hosts){

        if(hosts.length == 0){
            return res.status(301).send({"hostError" :"Host can't be empty"})
        }
    }
    return res.status(200).send({ "sucess": "All Data set properly" })



})


// app.get('/health', router)



app.get("/", (req, res) => {

    res.send('<h2>Hello from the server </h2>');
})

app.listen(3300, () => {
    console.log("App is running on port " + 3300);

})


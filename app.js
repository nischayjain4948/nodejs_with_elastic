
const express = require('express');
const validator = require('validator');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const { router, esclient } = require('./newconn');

app.post('/webinar/schedule',  (req, res, next) => {
    req.userInfo = {
        userId: "12345",
    }
    // Validation of the userId

    userInfo = req.userInfo.userId;
    if(!userInfo){
     
        return res.status(410).json({"msg":"user_info not found or invalid"});

    }

    next()
},  
async (req, res) => {
   
   
   
    const unique_id =  await mongoose.Types.ObjectId();


    let { webinar_title: webinar_name, roomId, description, qa = false, registration = false, record_webinar = false, password, time_zone, start_date, end_date, hosts } = req.body;

    try {

        if (!webinar_name) {
            return res.status(470).json({ "msg": "webinar title must be string and not empty" });
        }
        if (!roomId) {
            roomId = unique_id;
            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                return res.status(470).json({ "msg": "Invalid roomId" });
            }
        }

        if (!typeof (qa && record_webinar && registration) === Boolean) {
            return res.status(470).json({ "msg": "Field must be boolean" });
        }

        if (password) {
            const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if (!password.match(reg)) {
                return res.status(470).json({ "msg": "Password Must be one capital letter and at least 6 character" })
            }
        }
        if ((start_date !== Number && start_date.toString().length !== 13) || ((end_date !== Number && end_date.toString().length !== 13))) {

            return res.status(470).json({ "msg": "  Date must be a 13 digit timestamp" })

        }
        if (hosts) {

            if (!hosts.length) {
                return res.status(470).json({ "msg": "Host can't be empty" })
            }
        }

        let newobj = { webinar_name, roomId, description, qa, registration, record_webinar, password, time_zone, start_date, end_date, hosts }

        const response = await esclient.index({

            index: 'webinar_registration_schedule',
            body: newobj
        }).catch((e) => {
            return res.status(505).json({ "msg": "Something went wrong", "errorR": e });
        })

        return res.status(200).json({ "msg": "Registration successfully", "response": response });
    }
    catch (e) {
        return res.status(501).json({ "msg": "Something went wrong", "error": e });
    }

})

// app.get('/health', router)


app.get("/", (req, res) => {

    res.json('<h2>Hello from the server </h2>');
})

app.listen(4200, () => {
    console.log("App is running on port " + 4200);

})


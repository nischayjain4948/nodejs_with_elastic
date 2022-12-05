
const express = require('express');
const validator = require('validator');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const { router, esclient } = require('./newconn');
const { webinarList } = require('./controllers/webinarList');
const {feedback} = require('./controllers/feedBack')
const { response } = require('express');

app.post('/schedule_webinar', async (req, res, next) => {
    let userId = await mongoose.Types.ObjectId();
    req.userInfo = {
        userId,
        userName: 'nischay_jain_fullstack',
        elastic_id: 'ZWxK4YQBwRaFiOgnUsfH'
    }
    const {elastic_id, user_name} = req.userInfo;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!user_name && !usernameRegex.test(user_name)) {
        return res.status(470).json({ "message": "userName not found or invalid userName" });
    }

    req.headers = {elastic_id , user_name};
    next()
},
    async (req, res) => {

        const user_name = req.headers.user_name;
        const elastic_id = req.headers.elastic_id;
        let { webinar_title, description, qa = false, registration = false, record_webinar = false, password, time_zone, start_date, duration = {h:'', m: 15}, hosts, edit = false } = req.body;

        try {
            if (!webinar_title) {
                return res.status(470).json({ "message": "webinar title must be string and not empty" });
            }
            const roomId = await mongoose.Types.ObjectId();
            if (!typeof (qa && record_webinar && registration) === Boolean) {
                return res.status(470).json({ "message": "Field must be boolean" });
            }
            const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if (password && !password.match(reg)) {
                return res.status(470).json({ "message": "Password Must be one capital letter and at least 6 character" })
            }
            if(!start_date || typeof(start_date) !== 'number' || (start_date.toString()).length != 13){
              return res.status(470).json({"message":"Start_date must be a valid 13 digit timestamp!"});
            }
            if(duration){
                const hour = duration.h * 60 + duration.m;
                // console.log(hour)
                var end_date = start_date + (hour * 60000);
            }
            if(end_date < start_date){
                return res.status(470).json({"message":"end_date must be grethar than start_date"});
            }
            if (!hosts.length) {
                return res.status(470).json({ "message": "Host can't be empty" })
            }
            let body = { webinar_title, roomId, description, qa, registration, record_webinar, password, time_zone, start_date, end_date, hosts, user_name }
            if(edit && elastic_id){
                const response =  await esclient.updateByQuery({
                     index: 'webinar_schedule_registration',
                     body:{
                     script: {
                        "inline": "ctx._source.webinar_title = params.webinar_title ; ctx._source.description = params.description; ctx._source.qa = params.qa; ctx._source.registartion = params.registration; ctx._source.record_webinar = params.record_webinar ; ctx._source.password = params.password ; ctx._source.time_zone = params.time_zone ; ctx._source.start_date = params.start_date; ctx._source.end_date = params.end_date; ctx._source.hosts =  params.hosts",
                        "lang": "painless",
                        "params": {
                         webinar_title:webinar_title,
                         description:description,
                         qa:qa,
                         record_webinar:record_webinar,
                         password:password,
                         time_zone:time_zone,
                         start_date:start_date,
                         end_date:end_date,
                         hosts:hosts
                        }
                      },
                     query: {
                       match: { _id : elastic_id}
                     }}
                   }).catch((err)=>{
                    console.log(err);
                   })
                   return res.status(200).json({'message':"Document updated"});  
              }
            try {
                const response = await esclient.index({
                    index: 'webinar_schedule_registration',
                    body
                })
            }
            catch (e) {
                console.log(e);
                return res.status(505).json({ "message": "Internel server error!" });
            }
            const registerDate = Date.now();
            return res.status(200).json({ "message": "Registration successfully" });

        }
        catch (e) {
            console.log(e);
            return res.status(501).json({ "message": "Internel server errorrr!" });
        }
    })

app.use(webinarList);
app.use(feedback);

// app.get('/health', router)

app.get("/", (req, res) => {

    res.json('<h2>Hello from the server </h2>');
})

app.listen(4200, () => {
    console.log("App is running on port " + 4200);

})


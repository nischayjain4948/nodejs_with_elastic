
const express = require('express');
const validator = require('validator');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const { router, esclient } = require('./newconn');
const { webinarList } = require('./controllers/webinarList');
const {feedback} = require('./controllers/feedBack')
const { response } = require('express');
const {getWebinar} = require('./controllers/getWebinar')
const cors = require('cors');
app.use(cors());

app.post('/v1/webinar/schedule_webinar', async (req, res, next) => {
    let userId = await mongoose.Types.ObjectId();
    req.userInfo = {
        userId,
        email:"hobbit@gmail.com",
        userName: 'nischay_jain_fullstack',
        elastic_id: 'ZWxK4YQBwRaFiOgnUsfH'
    }
    const {elastic_id, userName, email} = req.userInfo;
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!userName && !usernameRegex.test(userName)) {
        return res.status(470).json({ "message": "userName not found or invalid userName" });
    }
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email || !email.match(mailformat)){
        return res.status(470).json({"message":"Not a vali Email format"});

    }
    req.headers = {elastic_id , userName, email};
    next()
},
    async (req, res) => {

        const createdBy = req.headers.userName;
        const elastic_id = req.headers.elastic_id;
        const email = req.headers.email;
        let { title, description, qa = false, registration = false, record = false, password, startDate, endDate = {h:'', m: 15}, hostIds, edit = false } = req.body;

        try {
            if (!title) {
                return res.status(470).json({ "message": "webinar title must be string and not empty" });
            }
            const roomId = await mongoose.Types.ObjectId();
            if (!typeof (qa && record && registration) === Boolean) {
                return res.status(470).json({ "message": "Field must be boolean" });
            }
            const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if (password && !password.match(reg)) {
                return res.status(470).json({ "message": "Password Must be one capital letter and at least 6 character" })
            }
            if(!startDate || typeof(startDate) !== 'number' || (startDate.toString()).length != 13){
              return res.status(470).json({"message":"Start_date must be a valid 13 digit timestamp!"});
            }
            if(endDate){
                const hour = endDate.h * 60 + endDate.m;
                 endDate = startDate + (hour * 60000);
            }
            if(endDate < startDate){
                return res.status(470).json({"message":"end_date must be grethar than start_date"});
            }
            // if (!hostIds.length) {
            //     return res.status(470).json({ "message": "Host can't be empty" })
            // }
         
            var createdAt =  Date.now();
            createdAt = new Date(createdAt).toISOString();
            startDate = new Date(startDate).toISOString();
            endDate = new Date(endDate).toISOString();
          const body = {title, description, qa, record , registration, password,startDate,endDate,roomId,email,createdBy,hostIds,createdAt}
        //   return res.send({"data":body});
            if(edit && elastic_id){
                const response =  await esclient.updateByQuery({
                     index: 'webinar_schedule_registration',
                     body:{
                     script: {
                        "inline": "ctx._source.webinar_title = params.webinar_title ; ctx._source.description = params.description; ctx._source.qa = params.qa; ctx._source.registartion = params.registration; ctx._source.record_webinar = params.record_webinar ; ctx._source.password = params.password ; ctx._source.time_zone = params.time_zone ; ctx._source.start_date = params.start_date; ctx._source.end_date = params.end_date; ctx._source.hosts =  params.hosts",
                        "lang": "painless",
                        "params": {
                        title:title,
                         description:description,
                         qa:qa,
                         record:record,
                         registration:registration,
                         password:password,
                         startDate:startDate,
                         endDate:endDate,
                         email:email,
                         createdBy:createdBy,
                         hostIds:hostIds,
                         createdAt:createdAt
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

            return res.status(200).json({ "message": "Registration successfully" });
        }
        catch (e) {
            console.log(e);
            return res.status(501).json({ "message": "Internel server errorrr!" });
        }
    })

app.use(webinarList);
app.use(feedback);
app.use(getWebinar);
// app.get('/health', router)

app.get("/", (req, res) => {

    res.json('<h2>Hello from the server </h2>');
})

app.listen(4200, () => {
    console.log("App is running on port " + 4200);

})


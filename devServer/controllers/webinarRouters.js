const routers = require("express").Router();
const mongoose = require("mongoose");
// const {esclient} = require("../newconn");
// const {reqUserInfo} = require("./req.UserInfo")

// Validate Function
const {validateWebinarParam, validateFeedBackParam, validateListParam} =  require("../lib/users.helper")

// elastic search helper function
const {registerWebinar, editWebinar, fetchWebinar, cancelWebinar, feedBack, webinarListing, report} = require("../lib/elastic.helper");





// schedule_webinar API
routers.post('/schedule_webinar', async (req, res, next) => {
    let userId = await mongoose.Types.ObjectId();
    req.userInfo = {
        userId,
        email:"nischayjain@gmail.com",
        userName: 'hGy89YQBwRaFiOgnssck',
        elastic_id: 'kGzKBYUBwRaFiOgnd8fC'
    }
    const {elastic_id, userName, email} = req.userInfo;
    req.headers = {elastic_id , userName, email};
    next()
},
    async (req, res) => {

        const createdBy = req.headers.userName;
        const elasticId = req.headers.elastic_id;
        const email = req.headers.email;
        let { title, description, qa = false, registration = false, record = false, password, startDate, endDate = {h:'', m: 15}, hostIds,  edit = false } = req.body;
        let reqData = {title, description, qa, registration, record, password,startDate,endDate,hostIds,edit}    
        validateWebinarParam(reqData, res);
        const roomId = await mongoose.Types.ObjectId();
        let createdAt =  Date.now();
        createdAt = new Date(createdAt).toISOString();
        reqData.startDate = new Date(reqData.startDate).toISOString();
        reqData.endDate = new Date(reqData.endDate).toISOString();
        reqData = {title, description, qa, registration, record, password,"startDate":reqData.startDate,"endDate":reqData.endDate,  hostIds, "createdAt":createdAt, "createdBy":createdBy, "email":email, "roomId":roomId, closed:false,}
        if(edit === true){
            editWebinar(reqData,elasticId,res);
        }if(edit === false){      
          registerWebinar(reqData,res)
        };
      
    })





// fetch_webinar API
routers.get('/fetch_webinar',  async (req,res)=>{
  const createdBy = "hGy89YQBwRaFiOgnssck";
  const webinarId = req.query.Id;
  const response = fetchWebinar(createdBy, webinarId, res);

})



// cancel_webinar API
routers.get("/cancel", async (req,res)=>{
    const createdBy = "hGy89YQBwRaFiOgnssck";
    const webinarId = req.query.Id;
    const isCancel = Boolean(req.query.isCancel);
    const response = cancelWebinar(createdBy,webinarId, isCancel, res);

})




// feedBack_Webinar API
routers.post("/feedback", async (req,res)=>{
    const createdBy = "gGyO8YQBwRaFiOgnCMc8";
    const email = "test@gmail.com";
    let {feedbackType, message } = req.body;
    const reqData = {feedbackType, message}
    const correctData = validateFeedBackParam(reqData, res);
    const response = feedBack(createdBy, feedbackType, message, email, res)
})




// list the webinar
routers.post("/list", async (req,res)=>{
    const createdBy = "hGy89YQBwRaFiOgnssck";
     let reqData = {type, search, size, skip } = req.body;
     const correctData = validateListParam(reqData, res);
     webinarListing(createdBy, correctData , res);

})



// report webinar
routers.post("/report", async (req,res)=>{
    const createdBy = "hGy89YQBwRaFiOgnssck";
    let reqData = {title, FromData, toDate} = req.body;
    report(createdBy, reqData, res);


})






    module.exports = routers;
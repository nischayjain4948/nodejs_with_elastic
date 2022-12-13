// This file is used for validate the Data 

const mongoose = require("mongoose");
const validateWebinarParam = (reqData,res)=>{


    if (!reqData.title) {
        return res.status(470).json({ "message": "webinar title must be string and not empty" });
    }

    if (!typeof (reqData.qa && reqData.record && reqData.registration) === Boolean) {
        return res.status(470).json({ "message": "Field must be boolean" });
    }
    const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (reqData.password && !reqData.password.match(reg)) {
        return res.status(470).json({ "message": "Password Must be one capital letter and at least 6 character" })
    }
    if(!reqData.startDate || typeof(reqData.startDate) !== 'number' || (reqData.startDate.toString()).length != 13){
      return res.status(470).json({"message":"Start_date must be a valid 13 digit timestamp!"});
    }
    if(reqData.endDate){
        const hour = reqData.endDate.h * 60 + reqData.endDate.m;
        reqData.endDate = reqData.startDate + (hour * 60000);
    }
    if(reqData.endDate < reqData.startDate){
        return res.status(470).json({"message":"end_date must be grethar than start_date"});
    }     

}

const validateFeedBackParam = (reqData, res)=>{
    if(!reqData.feedbackType){
        return res.status(470).json({"message":"Please select a feedback type"});
    }
    if(!reqData.message){
        return res.status(470).json({"message":"Please put some message"});
    }
}



const validateListParam = ({type, search, size, skip}, res) =>{
    if(!type){
        type = "all";
    }
    if(size ===  0 || size === "0"){
        return res.status(200).json({"result":[]});
    }
    if(!size){
        size = 20;
    }
    if(typeof(size) == 'string'){
        size = Number(size);
    }
    if(!skip){
        skip = 0;
    }
    if(typeof(skip) == 'string'){
        skip  = Number(skip);
    }
    let from = skip <= 0 ? 0 : skip;
    return {type, search, size, from};
}






// Specific Data function
function fetchWebinarSpecificData(arr) {
    const start_date = new Date(arr._source.startDate).getTime();
    const end_date = new Date(arr._source.endDate).getTime();
    const createdAt = new Date(arr._source.createdAt).getTime();
    return { "title": arr._source.title, "startDate": start_date, "endDate": end_date,  "isCancel":arr._source.isCancel,  "createdBy":arr._source.createdBy, "hostIds":arr._source.hostIds, "description":arr._source.description, "_id":arr._id}
   }




   function listWebinarSpecificData(arr) {
    const data =  arr.map((i) => {
       const start_date = new Date(i._source.startDate).getTime();
       const end_date = new Date(i._source.endDate).getTime();
       const createdAt = new Date(i._source.createdAt).getTime();
           return { "title": i._source.title, "startDate": start_date, "endDate": end_date,  "roomId": i._source.roomId, "_id": i._id, "createdBy":i._source.createdBy, "createdAt":createdAt};
       })
       return data;
   }   



   function reportWebinarSpecificData(arr) {
    return arr.map((data) => {
        const startDate = new Date(data._source.startDate).getTime();
        const endDate = new Date(data._source.endDate).getTime();
        const createdAt = new Date(data._source.createdAt).getTime();
        return { "title": data._source.title, "startDate": startDate, "endDate": endDate, "createdAt": createdAt, "_id": data._id, "roomId": data._source.roomId };

    })
}



module.exports = {validateWebinarParam, validateFeedBackParam, validateListParam, fetchWebinarSpecificData, listWebinarSpecificData, reportWebinarSpecificData};
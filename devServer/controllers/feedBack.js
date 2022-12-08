const feedback = require('express').Router();
const { esclient } = require('../newconn');

feedback.post('/v1/webinar/feedback', async (req,res,next)=>{

    req.userInfo = {
        email:"hobbit@gmail.com",
        elastic_id:"e2xR8IQBwRaFiOgnpMdR"
    }
    const {email, elastic_id} = req.userInfo;
    req.headers = {email, elastic_id};
    next();
},   async  (req, res) => {

    const email = req.headers.email;
    const elastic_id = req.headers.elastic_id;

    var { feedbackType, message} = req.body;
    if (!feedbackType) {
        res.status(470).json({ "message": "feedBack type must be selected" });
    }
    if (!message) {
        res.status(470).json({ "message": "Please leave a message" });
    }
    var reportDate = new Date().toISOString(); 
    const body = { feedbackType, message, reportDate, email, elastic_id }
    try {
        const response = await esclient.get({
            index: 'webinar_schedule_registration',
            id: elastic_id
        })
        const report = await esclient.index({
            index: 'webinar_reports',
            body
        })
        return res.status(200).json({ "message": "feedback added successfully" });
    }
    catch (err) {
        // console.log(err)
        return res.status(404).json({ "message": "Not authorized user!" });
    }
})
module.exports = { feedback };
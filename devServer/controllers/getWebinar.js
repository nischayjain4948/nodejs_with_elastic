const getWebinar = require('express').Router();
const {esclient} = require('../newconn');

getWebinar.get('/scheduled_webinar_detail', async (req,res)=>{
    // res.send("This api is used for get the webinar details");
    const webinbarId = req.query.webinarId;
    // console.log(webinbarId);
    try {
        const response = await esclient.get({
            index: 'webinar_schedule_registration',
            _id: webinbarId
        })
        const start_date = response.body._source.startDate
        if(start_date < Date.now()){
            return res.status(200).json({"message":"You can't edit the webinar!"})
        }
        return res.status(200).json({ "result": response.body._source});
    }
    catch (err) {
        return res.status(404).json({ "message": "Invalid webinar Id!" });
    }
})

module.exports = {getWebinar};
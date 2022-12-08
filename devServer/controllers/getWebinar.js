const getWebinar = require('express').Router();
const {esclient} = require('../newconn');

function specificData(arr) {
    const start_date = new Date(arr._source.startDate).getTime();
    const end_date = new Date(arr._source.endDate).getTime();
    const createdAt = new Date(arr._source.createdAt).getTime();
    return { "title": arr._source.title, "startDate": start_date, "endDate": end_date,  "roomId": arr._source.roomId, "isCancel":arr._source.isCancel, "createdAt":createdAt, "email":arr._source.email, "createdBy":arr._source.createdBy, "hostIds":arr._source.hostIds, "description":arr._source.description}
   }
getWebinar.get('/v1/webinar/details', async (req,res)=>{
    console.log(req.params);
    const webinbarId = req.query.id;
    console.log(webinbarId);
    try {
        const response = await esclient.get({
            index: 'webinar_schedule_registration',
            id: webinbarId
        })
        const start_date = response.body._source.startDate
        if(start_date < Date.now()){
            return res.status(200).json({"message":"You can't edit the webinar!"})
        }
        const data = specificData(response.body);
        return res.status(200).json({ "result": data});
    }
    catch (err) {
        return res.status(404).json({ "message": "Invalid webinar Id!" });
    }
})
module.exports = {getWebinar};
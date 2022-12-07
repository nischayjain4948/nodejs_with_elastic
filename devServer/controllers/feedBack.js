const feedback = require('express').Router();
const { esclient } = require('../newconn');

feedback.post('/feedback', async (req, res) => {
    // res.send('feed back api is running');
    const { feedbackType, message, report_date, email, elastic_id } = req.body;
    if (!feedbackType) {
        res.status(470).json({ "message": "feedBack type must be selected" });
    }
    if (!message) {
        res.status(470).json({ "message": "Please leave a message" });
    }
    if (!report_date) {
        res.status(470).json({ "message": "Please mention the report date" });
    }
    if (!email) {
        res.status(470).json({ "message": "Email required" });
    }
    if (!elastic_id) {
        res.status(470).json({ "message": "Elastic_Id required" });
    }
    const body = { feedbackType, message, report_date, email, elastic_id }
    try {
        const response = await esclient.get({
            index: 'webinar_schedule_registration',
            id: elastic_id
        })
        const report = await esclient.index({
            index: 'webinar_reports',
            body
        })
        return res.status(200).json({ "message": "Report added successfully" });
    }
    catch (err) {
        // console.log(err)
        return res.status(404).json({ "message": "Not authorized user!" });
    }
})
module.exports = { feedback };
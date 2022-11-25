const { Router } = require('express');
const webinarList = Router();
const { esclient } = require('../newconn');

webinarList.post("/webinar_list", async (req, res) => {
    try {
        let { type, start_date, end_date } = req.body
        if (!type) {
            type = "all";
        }
        if (!start_date || start_date.toString().length !== 13) {
            return res.status(470).json({ "message": "start_date must be a 13 digit number" })
        }
        if (!end_date || end_date.toString().length !== 13) {
            return res.status(470).json({ "message": "end_date must be a 13 digit number" })
        }
        const upcomingDate = start_date;

        if (type === "all") {
            const response = await esclient.search({
                index: 'webinar_schedule_registration',
                from: 2,  // This propery is used for skip the records
                size: 20,
                body: {
                    query: {
                        match_all: {}
                    }
                }
            })
            const data = response.body.hits.hits;
            console.log(data);
            return res.status(200).json({ "record": data })
        }
        else if (type === "upcoming") {

            const response = await esclient.search({
                index: 'webinar_schedule_registration',
                from: 2,
                size: 20,   // This property is used, how much records you want to see
                body: {
                    query: {
                        range: {
                            start_date: {
                                gt: upcomingDate
                            }
                        }
                    }
                }
            })
            const data = response.body.hits.hits;
            console.log(data);
            if (data) {
                return res.status(200).json({ "record": data });
            }
            else {
                return res.status(200).json({ "message": "No record found" });
            }
        }

        else if (type === "previous") {

            const response = await esclient.search({
                index: 'webinar_schedule_registration',
                from: 2,
                size: 20,
                body: {
                    query: {
                        range: {   
                            start_date: {
                                lt: Date.now()
                            }
                        }
                    }
                }
            })
            const data = response.body.hits.hits;
            console.log(data);
            if (data) {
                return res.status(200).json({ "record": data });
            }
            else {
                return res.status(200).json({ "message": "No record found" });
            }
        }
        else if (type === "decrease") {
            const response = await esclient.search({
                index: 'webinar_schedule_registration',
                from: 2,
                size: 20,
                body: {
                    sort: [{ start_date: { order: "desc" } }],  // This propery is used for sorting the records as per our requirement....
                    query: {
                        match_all: {}
                    }
                }
            })
            const data = response.body.hits.hits;
            console.log(data);
            if (data) {
                return res.status(200).json({ "record": data });
            }
            else {
                return res.status(200).json({ "message": "No record found" });
            }
        }
    } catch (e) {
        console.log(e);
    }
})
module.exports = { webinarList }






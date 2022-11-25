const { Router } = require('express');
const webinarList = Router();
const { esclient } = require('../newconn');

webinarList.post("/webinar_list", async (req, res) => {
    // res.send('webinar is live now');
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
                scroll: '20s',
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
                scroll: '20s',
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
            return res.status(200).json({ "record": data })
        }
        else if (type === "previous") {
            const response = await esclient.search({
                index: 'webinar_schedule_registration',
                scroll: '20s',
                body: {
                    sort: [{start_date: {order:"desc"}}],
                    query: {
                        match_all: {}
                    }
                }

            })
            console.log(response.body.hits.hits);
        }


    } catch (e) {
        console.log(e);
    }

})


module.exports = { webinarList }





// index: indexName,
//      type: id,
//      body: {
//         sort: [{ "_uid": { "order": "desc" } }],
//         size: 1,
//         query: { match_all: {}}

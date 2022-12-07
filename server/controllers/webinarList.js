const { Router, response } = require('express');
const { get, syncIndexes } = require('mongoose');
const webinarList = Router();
const { esclient } = require('../newconn');

function specificData(arr) {
 const data =  arr.map((i) => {
        return { "webinar_title": i._source.webinar_title, "start_date": i._source.start_date, "end_date": i._source.end_date,  "roomId": i._source.roomId, "_id": i._id }
    })
    return data;
}
webinarList.post("/v1/webinar/list", async (req, res) => {
    try {
        let { type, start_date, end_date, webinar_title, size, skip } = req.body
        if (!type) {
            type = "all";
        }
        if(size===0){
            return res.status(200).json({"result":[]})
        }
        if (!size) {
            size = 20;
        }
       
        if (typeof (size) == 'string') {
            size = Number(size);
        }
        if (!skip) {
            skip = 0;
        }
        if (typeof (skip) == 'string') {
            skip = Number(skip);
        }

        const from = skip <= 0 ? 0 : skip;
        async function getData() {
            let result
            try {
                if ((webinar_title && type == "upcoming") && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "query": {
                                "bool": {
                                    "must": [
                                        {
                                            "range": {
                                                "startDate": {
                                                    "gte": Date.now()
                                                }
                                            }
                                        }
                                    ],
                                    "should": [
                                        { "match": { "webinar_title": webinar_title } }
                                    ],
                                    "minimum_should_match": 1
                                }
                            }
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"result":data});
                }
                else if ((webinar_title && type == "previous") && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "query": {
                                "bool": {
                                    "must": [
                                        {
                                            "range": {
                                                "startDate": {
                                                    "lt": Date.now()
                                                }
                                            }
                                        }
                                    ],
                                    "should": [
                                        { "match": { "webinar_title": webinar_title } }
                                    ],
                                    "minimum_should_match": 1
                                }
                            }
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"Data":data});
                }
                else if (type == "previous" && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "query": {
                                "bool": {
                                    "must": [
                                        {
                                            "range": {
                                                "start_date": {
                                                    "lte": Date.now()
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"result":data});
                }
                else if (type == "upcoming" && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "query": {
                                "bool": {
                                    "must": [
                                        {
                                            "range": {
                                                "start_date": {
                                                    "gte": Date.now()
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"result":data});
                }
                else if (webinar_title && type == "all" && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "sort": [
                                {
                                    "start_date": {
                                        "order": "desc"
                                    }
                                }
                            ],
                            "query": {
                                "bool": {
                                    "should": [
                                        {
                                            "match": {
                                              "webinar_title": webinar_title
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"result":data});
                }
                else {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "sort": [
                                {
                                    "start_date": {
                                        "order": "desc"
                                    }
                                }
                            ]
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"result":data});
                }
            }
            catch (e) {
                console.log("error", e);
            }
        }
        getData();
    } catch (e) {
        console.log("error", e);
    }
})
module.exports = { webinarList }


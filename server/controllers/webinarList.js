const { Router, response } = require('express');
const { get, syncIndexes } = require('mongoose');
const webinarList = Router();
const { esclient } = require('../newconn');

webinarList.post("/webinar_list", async (req, res) => {
    try {
        let { type, start_date, end_date, webinar_title, size, skip } = req.body
        if (!type) {
            type = "all";
        }
        if (!start_date || start_date.toString().length !== 13) {
            return res.status(470).json({ "message": "start_date must be a 13 digit number" })
        }
        if (!end_date || end_date.toString().length !== 13) {
            return res.status(470).json({ "message": "end_date must be a 13 digit number" })
        }
        if (!size || size == "0") {
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
                                                "start_date": {
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
                    return res.status(200).json({ "message": "result found", "result": result.body.hits });
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
                                        "start_date": {
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
            return res.status(200).json({ "message": "result found", "result": result.body.hits });
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
                    return res.status(200).json({ "message": "result found", "result": result.body.hits });
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
                    // console.log(result);
                    return res.status(200).json({ "message": "result found", "result": result.body.hits });
                }
                else if(webinar_title && type =="all" && (size || skip)){
                    result = await esclient.search({
                        index:'webinar_schedule_registration',
                        body:{
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
                    return res.status(200).json({ "message": "result found", "result": result.body.hits });
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
                    return res.status(200).json({ "message": "result found", "result": result.body.hits });
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



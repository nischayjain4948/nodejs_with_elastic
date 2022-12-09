const { Router, response } = require('express');
const { get, syncIndexes } = require('mongoose');
const webinarList = Router();
const { esclient } = require('../newconn');
const mongoose = require('mongoose');

function specificData(arr) {
 const data =  arr.map((i) => {
    const start_date = new Date(i._source.startDate).getTime();
    const end_date = new Date(i._source.endDate).getTime();
        return { "title": i._source.title, "startDate": start_date, "endDate": end_date,  "roomId": i._source.roomId, "_id": i._id, "createdBy":i._source.createdBy}
    })
    return data;
}
webinarList.post("/v1/webinar/list", async (req,res,next)=>{
    let userId = await mongoose.Types.ObjectId();
    req.userInfo = {
        userId,
        email:"nischayjain@gmail.com",
        userName: 'gWyO8YQBwRaFiOgndMcW',
    }
    const { userName, email} = req.userInfo;
    req.headers = { userName, email};
    next()
    

} ,async (req, res) => {
    try {

        const userName = req.headers.userName;

        let { type, startDate, endDate, search, size, skip } = req.body
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
                if ((search && type == "upcoming") && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "query": {
                                "bool": {
                                    "must": [{"must":{"createdBy":userName}}, { "range": { "startDate": {"gte": Date.now()}}}],                                                                                                                                                                                                                                                                                          
                                    "should": [{"match": { "title": search }}],                                                                         
                                    "minimum_should_match": 1
                                }
                            }
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"result":data});
                }
                else if ((search && type == "previous") && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "query": {
                                "bool": {
                                    "must": [{"match":{"createdBy.keyword":userName}},{ "range": {  "startDate": { "lt": Date.now()}}}],                                                                                                                                                                                                                                                                                                                                             
                                    "should": [{ "match": { "title": search } }],                                                                          
                                    "minimum_should_match": 1
                                }
                            }
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"result":data});
                }
                else if (type == "previous" && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "query": {
                                "bool": {
                                    "must":[{"match":{"createdBy.keyword":userName}},{"range": { "startDate": {  "lte": Date.now()}}}]                                                                                                                                                                                                                                                             
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
                                    "must":[{"match":{"createdBy.keyword":userName}},{"range": { "startDate": {  "gte": Date.now()}}}]                                                                                                                                                                                                                                                             
                                }
                            }
                        }
                    })
                    const data = specificData(result.body.hits.hits);
                    return res.status(200).json({"result":data});
                }
                else if (search && type == "all" && (size || skip)) {
                    result = await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
                            "from": from,
                            "size": size,
                            "query": {"bool": { "must": [{"match":{"createdBy.keyword":userName}},{ "match": { "title": search}}]}}, 
                            "sort": [{ "startDate": {  "order": "desc"}}],
                          
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
                            "sort": [ {"startDate": {"order": "desc" }}],
                            "query":{"bool":{"must":{"match":{"createdBy.keyword":userName}}}}

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


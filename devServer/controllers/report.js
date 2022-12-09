
const { esclient } = require("../newconn");
const report = require("express").Router();


// This function is used for geting  _source Data...
function specificData(arr) {
    return arr.map((data) => {
        const startDate = new Date(data._source.startDate).getTime();
        const endDate = new Date(data._source.endDate).getTime();
        const createdAt = new Date(data._source.createdAt).getTime();
        return { "title": data._source.title, "startDate": startDate, "endDate": endDate, "createdAt": createdAt, "_id": data._id, "roomId": data._source.roomId };

    })
}



// Report api
report.post('/v1/webinar/report', async (req, res, next) => {

    req.userInfo = {
        elastic_id: 'gWyO8YQBwRaFiOgndMcW'
    }
    const { elastic_id } = req.userInfo;
    req.headers = { elastic_id };
    next();

}, async (req, res) => {
    const elastic_id = req.headers.elastic_id;
    const { title, fromDate, toDate } = req.body;
    let result;
    try {
        if (title) {
            result = await esclient.search({
                index: 'webinar_schedule_registration',
                body: {
                    "query": {
                        "bool": {
                            "must": [
                                { "match": { "createdBy.keyword": elastic_id } },
                                { "match": { "title": title } }
                            ]
                        }
                    },
                    "sort": [{ "startDate": { "order": "desc" } }]
                }
            })
            result = result.body.hits.hits;
            if (fromDate && toDate) {
                const newResult = result.filter((data) => {
                    const createdAt = new Date(data._source.createdAt).getTime();
                    return createdAt >= fromDate && createdAt <= toDate
                })
                const Data = specificData(newResult);
                return res.status(200).json({ "result": Data });
            }
            const Data = specificData(result)
            return res.status(200).json({ "result": Data });
        }
    }
    catch (err) {
        res.status(470).json({ "error": "something went wrong" });
    }
})
module.exports = { report };
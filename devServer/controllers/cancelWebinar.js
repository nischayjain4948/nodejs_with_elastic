const cancelWebinar = require("express").Router();
const { esclient } = require('../newconn');
cancelWebinar.get("/v1/webinar/cancel", async (req, res) => {
    const elasticId = req.query.id;
    const isCancel = req.query.isCancel;
    console.log(elasticId);
    console.log(isCancel);
    try {
        const response = await esclient.updateByQuery({
            index: 'webinar_schedule_registration',
            body: {
                script: {
                    "inline": "ctx._source.isCancel = params.isCancel",
                    "lang": "painless",
                    "params": {
                        isCancel: true
                    }
                },
                query: {
                    match: { _id: elasticId }
                }
            }
        })
        return res.status(200).json({ "message": `${elasticId}: webinar cancel successfully`});
    }
    catch (err) {
        return res.status(470).json({ "message": "Invalid id" });
    }
})
module.exports = { cancelWebinar };
const { esclient } = require("../newconn");
const report = require("express").Router();

function specificData(arr) {
    const start_date = new Date(arr._source.startDate).getTime();
    const end_date = new Date(arr._source.endDate).getTime();
    const createdAt = new Date(arr._source.createdAt).getTime();
    return { "title": arr._source.title, "startDate": start_date, "endDate": end_date,  "roomId": arr._source.roomId, "isCancel":arr._source.isCancel, "createdAt":createdAt, "email":arr._source.email, "createdBy":arr._source.createdBy, "hostIds":arr._source.hostIds, "description":arr._source.description}
   }


report.post('/v1/webinar/report' , async (req,res,next) =>{

    req.userInfo = {
        elastic_id:'gWyO8YQBwRaFiOgndMcw'
    }
    const {elastic_id} = req.userInfo;
    req.headers = {elastic_id};
    next();

}   , async (req,res)=>{

    const elastic_id = req.headers.elastic_id;
    const {title, fromDate, toDate} = req.body;
    let result;
    try{
        if(title){
            result  = await esclient.search({
                index:'webinar_schedule_registration',
                body:{
                     "query":{
                        "bool":{
                            "must":{
                                "match":{
                                    "createdBy":elastic_id
                                }
                            },
                            "should":{
                                "match":{
                                    "title":title
                                }
                            }
                        }
                     },
                     "sort":[
                        {"endDate":{"order":"desc"}}
                     ]
                }
            })
            res.status(200).json({"result":result.body});
        }
        else if(fromDate &&  toDate){
            result = await esclient.search({
                index:'webinar_schedule_registration',
                body:{

                    
                }
            })


        }
    }
    catch(err){
        res.status(470).json({"error":"something went wrong"});
    }
})

module.exports = {report};
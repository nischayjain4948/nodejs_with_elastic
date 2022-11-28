const { Router } = require('express');
const { get } = require('mongoose');
const webinarList = Router();
const { esclient } = require('../newconn');

webinarList.post("/webinar_list", async (req, res) => {
    try {
        let { type, start_date, end_date, webinar_title } = req.body
        if (!type) {
            type = "all";
        }
        if (!start_date || start_date.toString().length !== 13) {
            return res.status(470).json({ "message": "start_date must be a 13 digit number" })
        }
        if (!end_date || end_date.toString().length !== 13) {
            return res.status(470).json({ "message": "end_date must be a 13 digit number" })
        }





        async function getData(){

                if(webinar_title && type == "upcoming") {

                    await esclient.search({

                        index: 'webinar_schedule_registration',
                        body: {

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

                    return res.status(200).json({"message" :"result found"});

                }
                else if (webinar_title && type == "previous") {


                    await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {

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

                    return res.status(200).json({"message" :"result found"});

                }

                else if (type == "previous") {

                    await esclient.search({

                        index: 'webinar_schedule_registration',
                        body: {

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

                    return res.status(200).json({"message" :"result found"});
 

                }
                else if (type == "upcoming") {


                    await esclient.search({
                        index: 'webinar_schedule_registration',
                        body: {
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

                    return res.status(200).json({"message" :"result found"});
                }

        }


        console.log(getData().then((data)=>{
            console.log(data)
        }).catch((e)=>{
            console.log(e);
        }));

        // const result = await getData();
        // console.log(result);
        
        // async function GetData() {

        //     switch (webinar_title || type) {

        //         case (webinar_title && type == "upcoming"):

        //             return await esclient.search({

        //                 index: 'webinar_schedule_registration',
        //                 body: {

        //                     "query": {
        //                         "bool": {

        //                             "must": [
        //                                 {
        //                                     "range": {
        //                                         "start_date": {
        //                                             "gte": Date.now()

        //                                         }
        //                                     }
        //                                 }
        //                             ],

        //                             "should": [
        //                                 { "match": { "webinar_title": webinar_title } }

        //                             ],
        //                             "minimum_should_match": 1
        //                         }

        //                     }

        //                 }

        //             })
        //         // return res.status(200).json({"message" :"Data found"});



        //         case (webinar_title && type == "previous"):

        //             return await esclient.search({
        //                 index: 'webinar_schedule_registration',
        //                 body: {

        //                     "query": {
        //                         "bool": {

        //                             "must": [
        //                                 {
        //                                     "range": {
        //                                         "start_date": {
        //                                             "lt": Date.now()

        //                                         }
        //                                     }
        //                                 }
        //                             ],

        //                             "should": [
        //                                 { "match": { "webinar_title": webinar_title } }

        //                             ],
        //                             "minimum_should_match": 1
        //                         }

        //                     }

        //                 }

        //             })
        //         // return res.status(200).json({"message" :"Data found"});



        //         case (type == "previous"):

        //             return await esclient.search({

        //                 index: 'webinar_schedule_registration',
        //                 body: {

        //                     "query": {

        //                         "bool": {

        //                             "must": [

        //                                 {
        //                                     "range": {
        //                                         "start_date": {
        //                                             "lte": Date.now()
        //                                         }
        //                                     }
        //                                 }

        //                             ]


        //                         }

        //                     }


        //                 }


        //             })
        //         // return res.status(200).json({"message" :"Data found"});




        //         case (type == "upcoming"):
        //             return await esclient.search({
        //                 index: 'webinar_schedule_registration',
        //                 body: {
        //                     "query": {
        //                         "bool": {

        //                             "must": [
        //                                 {
        //                                     "range": {
        //                                         "start_date": {
        //                                             "gte": Date.now()

        //                                         }
        //                                     }
        //                                 }
        //                             ]

        //                         }


        //                     }

        //                 }

        //             })
        //         // return res.status(200).json({"message" :"Data found"});




        //     }

        // }


        // console.log(await GetData());



    } catch (e) {
        console.log(e);
    }
})
module.exports = { webinarList }



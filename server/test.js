const result =  [
    {
        "_index": "webinar_schedule_registration",
        "_type": "_doc",
        "_id": "aGzW5YQBwRaFiOgnJscG",
        "_score": null,
        "_source": {
            "webinar_title": "Thorin ockenshield plese take the gold and  get lost!",
            "roomId": "638ece5f335418e8e3ed5aed",
            "description": "Great webinar on full stacak development is live!",
            "qa": true,
            "registration": true,
            "record_webinar": false,
            "password": "Hello123456",
            "time_zone": "Tuesday, November 22, 2022 12:27:56 PM GMT+05:30",
            "start_date": 1670389619000,
            "end_date": 1670390519000,
            "hosts": [
                "ned stark",
                "hobbit",
                "thorin",
                "gadualf",
                "smug"
            ]
        },
        "sort": [
            1670389619000
        ]
    },
    {
        "_index": "webinar_schedule_registration",
        "_type": "_doc",
        "_id": "YWyU0oQBwRaFiOgnAseN",
        "_score": null,
        "_source": {
            "end_date": 1669188037545,
            "fieldName": null,
            "hosts": [
                "ned stark",
                "hobbit",
                "thorin",
                "gadualf",
                "smug"
            ],
            "user_name": "nischay_jain_fullstack",
            "description": "Great webinar on full stacak development is live!",
            "time_zone": "Tuesday, November 22, 2022 12:27:56 PM GMT+05:30",
            "roomId": "6389e041a577ad1c495998b8",
            "qa": true,
            "password": "Hello123456",
            "webinar_title": "Thorin plese take the gold and  get lost!",
            "registration": true,
            "record_webinar": false,
            "start_date": 1669852118416
        },
        "sort": [
            1669852118416
        ]
    },
    {
        "_index": "webinar_schedule_registration",
        "_type": "_doc",
        "_id": "YmyA4IQBwRaFiOgn6ccR",
        "_score": null,
        "_source": {
            "end_date": 1669188037545,
            "fieldName": null,
            "hosts": [
                "ned stark",
                "hobbit",
                "thorin",
                "gadualf",
                "smug"
            ],
            "user_name": "nischay_jain_fullstack",
            "description": "Great webinar on full stacak development is live!",
            "time_zone": "Tuesday, November 22, 2022 12:27:56 PM GMT+05:30",
            "roomId": "638d70dee19fd60155841beb",
            "qa": true,
            "password": "Hello123456",
            "webinar_title": "Thorin plese take the gold and  get lost!",
            "registration": true,
            "record_webinar": false,
            "start_date": 1669852118416
        },
        "sort": [
            1669852118416
        ]
    }
]


const data = result.map((i)=>{
return {"webinar_title":i._source.webinar_title, "start_date":i._source.start_date, "end_date":i._source.end_date, "time_zone":i._source.time_zone, "roomId":i._source.roomId , "_id": i._id}
})

console.log(data);
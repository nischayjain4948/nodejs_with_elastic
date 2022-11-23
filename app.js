
const express = require('express');
const validator = require('validator');
const app = express();
app.use(express.json());
const { router, esclient } = require('./newconn');

app.post('/webinar/schedule', async (req, res) => {

    let { webinar_title: webinar_name, description, qa = false, registration = false, record_webinar = false, password, time_zone, start_date, hosts } = req.body;

    try {

        if (!typeof (qa) === Boolean) {
            return res.status(301).json({ "QAError": "QA feild must be boolean" });
        }
        if (!typeof (record_webinar) === Boolean) {
            return res.status(301).json({ "recordWebinarError": "Record webinar must be boolean" });
        }
        if (!typeof (registration) === Boolean) {
            return res.status(301).json({ "RegistrationError": "Registration feild must be boolean" });
        }
        if (webinar_name == "" || webinar_name == undefined) {
            return res.status(301).json({ "webinarTitleError": "webinar title must be string and not empty" });
        }

        if (password) {
            const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if (!password.match(reg)) {
                return res.status(301).json({ "passwordError": "Password Must be one capital letter and at least 6 character" })
            }
        }
        if (start_date) {

            const check = !Number.isNaN(start_date) && Number.isFinite(start_date) && /^\d+\.?\d+$/.test(start_date);
            if (!check) {

                return res.status(301).json({ "start_date": "start_date must be a timestamp" });
            }
        }
        if (hosts) {

            if (hosts.length == 0) {
                return res.status(301).json({ "hostError": "Host can't be empty" })
            }
        }
        // console.log(req.body);

        const response = await esclient.index({

            index: 'webinar_registration',
            body: req.body
        }).catch((e) => {
            console.log(e)
        })

        return res.status(200).json({ "sucess": "Data set into the elastic", "response": response })
    }
    catch (e) {
        return res.status(501).json({ "ServerError": "Something went wrong", "error": e })
    }

})

// app.get('/health', router)


app.get("/", (req, res) => {

    res.json('<h2>Hello from the server </h2>');
})

app.listen(4200, () => {
    console.log("App is running on port " + 4200);

})


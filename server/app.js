
const express = require('express');
const validator = require('validator');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const { router, esclient } = require('./newconn');
const { webinarList } = require('./controllers/webinarList');

app.post('/webinar/schedule_registration', async (req, res, next) => {
    let userId = await mongoose.Types.ObjectId();
    req.userInfo = {
        userId,
        userName: 'pinkesh munim',
    }
    const user_name = req.userInfo.userName;

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!user_name && !usernameRegex.test(user_name)) {
        return res.status(470).json({ "message": "userName not found or invalid userName" });
    }

    req.headers.userName = user_name;


    next()
},
    async (req, res) => {

        const user_name = req.headers.userName;

        let { webinar_title, description, qa = false, registration = false, record_webinar = false, password, time_zone, start_date, end_date, hosts } = req.body;

        try {
            if (!webinar_title) {
                return res.status(470).json({ "message": "webinar title must be string and not empty" });
            }
            const roomId = await mongoose.Types.ObjectId();
            if (!typeof (qa && record_webinar && registration) === Boolean) {
                return res.status(470).json({ "message": "Field must be boolean" });
            }
            const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if (password && !password.match(reg)) {
                return res.status(470).json({ "message": "Password Must be one capital letter and at least 6 character" })
            }
            if ((start_date !== Number && start_date.toString().length !== 13) || ((end_date !== Number && end_date.toString().length !== 13))) {
                return res.status(470).json({ "message": "  Date must be a 13 digit timestamp" })
            }
            if (!hosts.length) {
                return res.status(470).json({ "message": "Host can't be empty" })
            }
            let body = { webinar_title, roomId, description, qa, registration, record_webinar, password, time_zone, start_date, end_date, hosts, user_name }
            try {
                const response = await esclient.index({
                    index: 'webinar_schedule_registration',
                    body
                })
            }
            catch (e) {
                console.log(e);
                return res.status(505).json({ "message": "Internel server error!" });
            }
            const registerDate = Date.now();
            return res.status(200).json({ "message": "Registration successfully" });

        }
        catch (e) {
            console.log(e);
            return res.status(501).json({ "message": "Internel server errorrr!" });
        }
    })




app.use(webinarList);



// app.get('/health', router)


app.get("/", (req, res) => {

    res.json('<h2>Hello from the server </h2>');
})

app.listen(4200, () => {
    console.log("App is running on port " + 4200);

})


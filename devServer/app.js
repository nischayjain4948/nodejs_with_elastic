const express = require("express");
const app = express();
app.use(express.json());
const webinarRoutes = require("./controllers/webinarRouters");
const authRoutes = require("./controllers/authRoutes");

const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/user", authRoutes);
app.use("/v1/webinar", webinarRoutes);

app.get("/", (req, res) => {
  res.json("<h2>Hello from the server </h2>");
});

app.listen(4200, () => {
  console.log("App is running on port " + 4200);
});

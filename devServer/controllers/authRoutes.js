const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECREATE_KEY = "NISCHAYJAIN";
const { insertUser, findUser } = require("../lib/elastic.helper");

// Register API
router.post("/register", async (req, res) => {
  let { name, email, password } = req.body;
  if (!(name && email && password)) {
    return res.status(510).json({ message: "All fields required" });
  }
  if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
    return res.status(510).json({ message: "Email not valid" });
  }
  const encryptPassword = await bcrypt.hash(password, 12);
  email = email.toLocaleLowerCase();
  const doc = { name, email, encryptPassword };
  const insertedResponse = await insertUser(doc);
  return res.status(insertedResponse.code).json({ message: insertedResponse.message });
});

router.get("/login", async (req, res) => {
  let { email, password } = req.query;
  if (!(email && password)) {
    return res.status(470).json({ message: "Please enter email and password" });
  }
  email = email.toLocaleLowerCase();
  const loginResponse = await findUser({ email, password });
  if (loginResponse.code === 200) {
    jwt.sign({ email }, SECREATE_KEY, { expiresIn: "300s" }, (error, token) => {
      return res.status(loginResponse.code).json({ message: loginResponse.message, token });
    });
  } else {
    return res.status(loginResponse.code).json({ message: loginResponse.message });
  }
});

module.exports = router;

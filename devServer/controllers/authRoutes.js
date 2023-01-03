const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECREATE_KEY = "NISCHAYJAIN";
const { insertUser, findUser } = require("../lib/elastic.helper");
const mongoose = require("mongoose");
const client = require("../conn/conn.redis");

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
    jwt.sign({ email }, SECREATE_KEY, { expiresIn: "2h" }, (error, token) => {
      const addToken = async (email, token) => {
        await client.set(email, token);
        console.log("token set into redis successfully");
      };
      addToken(email, token);
      // req.header.sessionToken = token;
      // req.header.email = email;
      return res.status(loginResponse.code).json({ message: loginResponse.message, token });
    });
  } else {
    return res.status(loginResponse.code).json({ message: loginResponse.message });
  }
});

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["session"];
  if (typeof bearerHeader !== "undefined") {
    jwt.verify(bearerHeader, SECREATE_KEY, (error, authData) => {
      if (error) {
        return res.status(410).json({ message: "Invalid Token from req" });
      } else {
        const { email } = authData;
        (async () => {
          const redisToken = await client.get(email);
          if (redisToken === bearerHeader) {
            next();
            return res.status(200).json({ message: "Complete authentication!" });
          } else {
            return res.status(403).json({ message: "Unauthorized access" });
          }
        })();
      }
    });
  } else {
    return res.status(410).json({ message: "Invalid Token" });
  }
};

router.get("/profile", verifyToken, (req, res) => {
  console.log("Token verify profile is running");
});

module.exports = router;

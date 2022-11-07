var express = require("express");
const bcrypt = require("bcrypt");
var multipart = require("connect-multiparty");
const { getMultiple, createUser } = require("../db/requests.js");
const { signupValidation } = require("../helpers/validation.js");
var router = express.Router();
var multipartMiddleware = multipart();
const sql = require("../models/db.js");
//const { query } = require("../helpers/mysqlhelper");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/all", multipartMiddleware, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);
    console.log(req.body.userName);

    const abc = req.body.userName;
    const salt = await bcrypt.genSalt(10);
    const creds = {
      user: req.body.userName,
      password: await bcrypt.hash(req.body.password, salt),
    };
    console.log(creds.password);
    console.log("------------------------------- 3");
    /* sql.query(`SELECT id, name, password FROM users`, (err, res) => {
      console.log("found tutorial: ", res);
      console.log("found tutorial: ", err);
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found tutorial: ", res[0]);
        //result(null, res[0]);
        return;
      }

      // not found Tutorial with the id
      //result({ kind: "not_found" }, null);
    }); */
    // const rows = await query(`SELECT id, name, password FROM users`);
    //console.log("rows", rows);

    const kirik = await getMultiple();
    // console.log(kirik);
    const getUsers = res.send(`${JSON.stringify(creds)}`);
  } catch (err) {
    console.log("err", err);
  }
});

router.post("/", multipartMiddleware, signupValidation, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);

    const salt = await bcrypt.genSalt(10);
    const creds = {
      user: req.body.name,
      password: await bcrypt.hash(req.body.password, salt),
    };
    console.log(creds.password);

    const kirik = await createUser(creds);

    console.log(kirik);
    const getUsers = res.send(`${JSON.stringify(creds)}`);
  } catch (err) {
    console.log("err", err);
  }
});

// логин
router.get("/", multipartMiddleware, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);
    console.log("LOGIN");
    const creds = {
      user: req.query.name,
      password: req.query.password,
    };
    console.log("password", creds.password);

    const kirik = await loginUser(creds);

    console.log("RES", kirik);
    const getUsers = res.send(`${JSON.stringify(creds)}`);
  } catch (err) {
    console.log("err", err);
  }
});

module.exports = router;

var express = require("express");
const bcrypt = require("bcrypt");
var multipart = require("connect-multiparty");

var router = express.Router();
var multipartMiddleware = multipart();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", multipartMiddleware, async (req, res) => {
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
    res.send(`${JSON.stringify(creds)}`);
  } catch (err) {
    console.log("err", err);
  }
});

module.exports = router;

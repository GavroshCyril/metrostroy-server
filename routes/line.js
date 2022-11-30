const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authenticateToken");

const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty");

const { getAll } = require("../db/lines.js");
const { signupValidation } = require("../helpers/validation.js");
const { getRefreshToken, deleteRefreshToken } = require("../db/users");

const multipartMiddleware = multipart();

router.get("/all", async (req, res) => {
    try {
      console.log("user", req.user);
  
      await getAll(res);
    } catch (err) {
      console.log("err", err);
    }
  });

module.exports = router;
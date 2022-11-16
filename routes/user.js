const express = require("express");
const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty");
const jwt = require("jsonwebtoken");

const { getMultiple, createUser, loginUser } = require("../db/requests.js");
const { signupValidation } = require("../helpers/validation.js");
const { authenticateToken } = require("../middlewares/authenticateToken");
const { generateAccessToken } = require("../helpers/auth");

const router = express.Router();
const multipartMiddleware = multipart();

/* GET users listing. */
router.get("/all", authenticateToken, async (req, res) => {
  try {
    console.log("user", req.user);

    await getMultiple(res);
  } catch (err) {
    console.log("err", err);
  }
});

//sing up
router.post("/", multipartMiddleware, signupValidation, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = {
      name: req.body.name,
      password: hashedPassword,
    };

    await createUser(user, res);
  } catch (err) {
    console.log("err", err);
  }
});

// логин
router.post("/login", multipartMiddleware, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);

    const user = {
      name: req.body.name,
      password: req.body.password,
    };

    await loginUser(user, res);
  } catch (err) {
    console.log("err", err);
  }
});

//Refresh token in request
router.post("/token", async (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
    
  })
});

router.delete("/logout", async (req, res) => {
  refreshTokens = refreshTokens.filter(token !== req.body.token)
  res.sendStatus(204)
});

module.exports = router;

const bcrypt = require("bcrypt");

const sql = require("../models/db.js");
const { generateAccessToken, generateRefreshToken } = require("../helpers/auth");


const getMultiple = async (res) => {
  sql.query(`SELECT id, name, password FROM users`, (err, data) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).json({
        status: "failed",
        message: err.message
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: data
    });
  });
};

const createUser = async (user, res) => {
  sql.query(
    `INSERT INTO users (name, password) values ('${user.name}', '${user.password}')`,
    (err, data) => {
      if (err) {
        console.log("error: ", err);
        res.status(400).json({
          status: "failed",
          message: err.message
        });
        return;
      }

      res.status(200).json({
        status: "success",
      });
    }
  );
};

let refreshTokens = [];

const loginUser = async (user, res) => {
  sql.query(`SELECT * FROM users WHERE name = '${user.name}'`, (err, data) => {
    if (err) {
      console.log("error: ", err);
      res.status(400).json({
        status: "failed",
        message: err.message
      });
      return;
    }

    if (data.length) {
      const passwordIsValid = bcrypt.compareSync(user.password, data[0].password);

      if (passwordIsValid) {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        refreshTokens.push(refreshToken)

        res.json({ accessToken: accessToken, refreshToken: refreshToken })
      } else {
        res.status(400).json({
          status: "failed",
          message: "Invalid password"
        });
      }
    }
  });
};

module.exports = {
  getMultiple,
  createUser,
  loginUser,
};

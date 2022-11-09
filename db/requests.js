//const mysqlhelper = require("../helpers/mysqlhelper");
/* const helper = require("../helper"); */
/* const config = require("../config"); */
const sql = require("../models/db.js");
const bcrypt = require("bcrypt");

const getMultiple = async () => {
  console.log("------------------------------- 1");
  sql.query(`SELECT id, name, password FROM users`, (err, res) => {
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
  });
  /*  console.log(data);
  const meta = { page };
  console.log(meta); */
};

// `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`
const createUser = async (creds) => {
  sql.query(
    `INSERT INTO users (name, password) values ('${creds.user}', '${creds.password}')`,
    (err, res) => {
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
    }
  );
  /*  console.log(data);
    const meta = { page };
    console.log(meta); */
};

const loginUser = async (creds) => {
  console.log("ACHTUNG");
  sql.query(`SELECT * FROM users WHERE name = '${creds.user}'`, (err, res) => {
    console.log("user: ", res);
    console.log("err: ", err);
    if (err) {
      console.log("error: ", err);
      //result(err, null);
      //return;
    }

    if (res.length) {
      console.log("p1: ", res[0].password);
      console.log("p2: ", creds.password);
      //result(null, res[0]);
      var passwordIsValid = bcrypt.compareSync(res[0].password, creds.password);
      console.log("passwordIsValid", passwordIsValid);
      //return;
    }

    // not found Tutorial with the id
    //result({ kind: "not_found" }, null);
  });
  /*  console.log(data);
      const meta = { page };
      console.log(meta); */
};

module.exports = {
  getMultiple,
  createUser,
  loginUser,
};

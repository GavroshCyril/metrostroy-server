/* const mysql = require("mysql2/promise"); */
const app = require("../app.js");
const connection = require("../models/db.js");

async function query(sql, params) {
  /*   const connection = await mysql.createConnection(config.db); */

  // const [results] = await connection.execute(sql, params);
  console.log("------------------------------- 2");
  return "results";
}

module.exports = {
  query,
};

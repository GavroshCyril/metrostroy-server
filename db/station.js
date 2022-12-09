const sql = require("../models/db.js");

const uploadImage = async (res) => {
    sql.query(`SELECT *
    FROM metro_line M 
    JOIN stations S ON M.line_id = S.line_id;
    `, (err, data) => {
      if (err) {
        console.log("error: ", err);
        res.status(400).json({
          status: "failed",
          message: err.message
        });
        return;
      }

      console.log("data", data)


      res.status(200).json({
        status: "success",
        data: data
      });
    });
  };

  module.exports = {
    uploadImage,
  };
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty");
const { getRefreshToken, deleteRefreshToken } = require("../db/users");


const multipartMiddleware = multipart();
const sql = require("../models/db.js");

// обработчики запросов
/* app.get('/rewiews', (req, res) => {
    connection.query('SELECT * FROM rewiews ORDER BY created_at DESC', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  }); */

router.get("/", (req, res) => {
  // SELECT a.id, a.name, a.num, b.date, b.roll FROM a INNER JOIN b ON a.id = b.id;
  sql.query(`SELECT rewiews.id_rewiews, rewiews.review, rewiews.rating, rewiews.date_at, users.name FROM rewiews INNER JOIN users ON rewiews.user_id = users.id`, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});

router.post("/", multipartMiddleware, (req, res) => {
  const { userId, review, rating } = req.body;

  // userId = String(userId)
  // rating = String(rating)
  // console.log("userId", userId)
  // console.log("userId", typeof userId)

  // console.log("rating", rating)
  // console.log("rating", typeof rating)

  
  // sql.query(queryRow, (err, data) => {
  //   console.log("err", err)
  //   if (err) {
  //     sendErr(res, err)
  //   }
  //   console.log("data", data)

  //   res.status(200).send({
  //     filename: file.filename,
  //     mimetype: file.mimetype,
  //     originalname: file.originalname,
  //     size: file.size,
  //     fieldname: file.fieldname
  //   })
  // });
  // const queryRow = `
  //         INSERT INTO stations (line_id, station_name, station_description, station_picture)
  //         VALUES (${lineId}, '${stationNameDB}', '${stationDescriptionDB}', '${file.filename}');
  //         `;
  sql.query(
    `INSERT INTO rewiews (user_id, review, rating) VALUES (${userId}, '${review}', '${rating}')`,
    [userId, review, rating],
    function (error, results, fields) {
      if (error) throw error;
      res.send({ message: "Review added successfully!" });
    }
  );
});

router.delete("/rewiews/:id", (req, res) => {
  connection.query(
    `DELETE FROM rewiews WHERE id=?`,
    [req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send({ message: "Review deleted successfully!" });
    }
  );
});

module.exports = router;

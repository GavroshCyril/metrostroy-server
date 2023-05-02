const express = require("express");
const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty");
const { getRefreshToken, deleteRefreshToken } = require("../db/users");

const router = express.Router();
const multipartMiddleware = multipart();

// обработчики запросов
/* app.get('/reviews', (req, res) => {
    connection.query('SELECT * FROM rewiews ORDER BY created_at DESC', (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    });
  }); */

router.get("/reviews", (req, res) => {
  connection.query(`SELECT * FROM rewiews`, function (error, results, fields) {
    if (error) throw error;
    res.send(results);
  });
});

router.post("/reviews", (req, res) => {
  const { name, content } = req.body;
  connection.query(
    `INSERT INTO rewiews (name, content) VALUES (${name}, ${content})`,
    [name, content],
    function (error, results, fields) {
      if (error) throw error;
      res.send({ message: "Review added successfully!" });
    }
  );
});

router.delete("/reviews/:id", (req, res) => {
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

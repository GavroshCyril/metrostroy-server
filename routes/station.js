const express = require("express");
const router = express.Router();
const path = require("path");
const sql = require("../models/db.js");

const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty");
const { uploadImage } = require("../db/station.js");
const { signupValidation } = require("../helpers/validation.js");
const { getRefreshToken, deleteRefreshToken } = require("../db/users");
const { uploadImageMiddleware } = require("../middlewares/uploadImage.js");
const { authenticateToken } = require("../middlewares/authenticateToken");
const { sendErr } = require("../helpers/sendErr");

const multipartMiddleware = multipart();

// upload.array('images', 12)
const uploadSingleImage = uploadImageMiddleware.single('image');

router.post("/image", async (req, res) => {
  try {
    uploadSingleImage(req, res, function (err) {
      console.log("req", req);
      console.log(req.file);
      const { lineName } = req.body;
      console.log("lineName", lineName)
      if (!lineName) {
        return res.send({ error: `You must provide line name.` });
      }
     
      if (err) {
          console.log("error", err);
          return res.status(400).send({ error: err.message })
        }

      if (req.file == undefined) {
        return res.send({ error: `You must select a file.` });
      }

      const file = req.file;
      const queryRow = `UPDATE metro_line
          SET line_picture = '${file.filename}'
          WHERE line_name = '${lineName}'`

        console.log("queryRow", queryRow)
        sql.query(queryRow, (err, data) => {
          console.log("err", err)
          if (err) {
            sendErr(res, err)
          }
          console.log("data", data)
   
          res.status(200).send({
            filename: file.filename,
            mimetype: file.mimetype,
            originalname: file.originalname,
            size: file.size,
            fieldname: file.fieldname
          })
        });
    })

  } catch (err) {
    return res.status(400).send({ error: err.message })
  }
});

router.get("/image/:imageName", async (req, res) => {
  const { imageName } = req.params

  console.log("imageName", imageName)

  const imagePath = path.join(__dirname, `../public/images/${imageName}`)

  res.sendFile(imagePath);
});

router.post("/", async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);
    console.log("req.body0", req.body)

    uploadSingleImage(req, res, function (err) {
      console.log("req", req);
 
      const {
        stationNameDB,
        stationDescriptionDB,

        stationNameEN,
        stationNameBY,
        stationNameRU,

        stationDescriptionEN,
        stationDescriptionBY,
        stationDescriptionRU,
        lineId,
      } = req.body;
      console.log("---------------------")
      console.log("req.body", req.body)
      console.log("stationNameDB", stationNameDB)
      console.log("req.file", req.file);
      console.log("---------------------")
      if (!stationNameDB) {
        return res.status(400).send({ error: `You must provide line name.` });
      }

      if (err) {
        console.log("error", err);
        return res.status(400).send({ error: err.message })
      }

      if (req.file == undefined) {
        return res.send({ error: `You must select a file.` });
      }

      const file = req.file;
      console.log("file", file)

      const queryRow = `
          INSERT INTO stations (line_id, station_name, station_description, station_picture)
          VALUES (${lineId}, '${stationNameDB}', '${stationDescriptionDB}', '${file.filename}');
          `
      console.log("queryRow", queryRow)
      const queryRow2 = `
          INSERT INTO translations (category, en, ru, bel)
          VALUES ('${stationNameDB}', '${stationNameEN}', '${stationNameRU}', '${stationNameBY}');
          `
      console.log("queryRow2", queryRow2)
      const queryRow3 = `
          INSERT INTO translations (category, en, ru, bel)
          VALUES ('${stationDescriptionDB}', '${stationDescriptionEN}', '${stationDescriptionRU}', '${stationDescriptionBY}');
          `
      console.log("querqueryRow3yRow", queryRow3)

      let error = null
      sql.query(queryRow, (err, data) => {
        if (err) {
          console.log("err", err)
          error = err
        }
      });
 

        sql.query(queryRow2, (err, data) => {
          if (err) {
            error = err
          }
        });
      


        sql.query(queryRow3, (err, data) => {
          if (err) {
            error = err
          } 
        });


      // if (error) {
      //   return res.status(400).send({ error: `Wrong` });
      // }

      res.status(200).send({
        stationNameDB,
        stationDescriptionDB,
      })

      

    })
    // const station = {
    //   nameDB: req.body.name,
    //   password: hashedPassword,
    // };
    

  } catch (err) {
    return res.status(400).send({ error: err.message })
  }
});

router.delete("/", multipartMiddleware, async (req, res) => {
  try {
    if (!req.body) return res.sendStatus(400);

    const { stationName } = req.body
    console.log("stationName", stationName)

    const queryRow = `
          DELETE FROM stations WHERE station_name = '${stationName}';
          `
    sql.query(queryRow, (err, data) => {
      console.log("err", err)
      if (err) {
        sendErr(res, err)
      }
      console.log("data", data)

      res.status(200).send({
        status: "success"
      })
    });

  } catch (err) {
    return res.status(400).send({ error: err.message })
  }
});

module.exports = router;
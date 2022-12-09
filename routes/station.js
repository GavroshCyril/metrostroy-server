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

module.exports = router;
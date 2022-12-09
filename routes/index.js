var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/image", async (req, res) => {
  try {
    uploadSingleImage(req, res, function (err) {
      console.log("req", req);
      console.log(req.file);
      const { entiyName, entiy } = req.body;
      console.log("entiyName", entiyName)
      if (!entiyName) {
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

      let queryRow
      if (entiy === "line") {
        queryRow = `UPDATE metro_line
          SET line_picture = '${file.filename}'
          WHERE line_name = '${entiyName}'`
      } else {
        queryRow = `UPDATE stations
          SET station_picture = '${file.filename}'
          WHERE station_name = '${entiyName}'`
      }
      

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

module.exports = router;

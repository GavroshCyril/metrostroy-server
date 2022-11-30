const sql = require("../models/db.js");
// select *
// from b.main a, b.foo b, b.bar c
// where a.id = b.k
// and a.id = c.k

// SELECT *
// FROM translates_by localizations
// WHERE localizations.localization_id = translates_by.localization_id

// SELECT Orders.OrderID, Customers.CustomerName
// FROM Orders
// INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;


// SELECT translates_by.localization_id, localizations.localization_id
// FROM translates_by
// INNER JOIN localizations ON translates_by.localization_id = localizations.localization_id;

// SELECT localizations.localization_id, translates_by
// FROM localizations
// INNER JOIN translates_by ON localizations.localization_id = translates_by.localization_id;

// SELECT localizations.localization_id, translates_by.localization_id
// FROM localizations
// RIGHT JOIN translates_by ON localizations.localization_id = translates_by.localization_id;

const getAll = async (res) => {
    sql.query(`SELECT *
    FROM localizations
    INNER JOIN translates_by ON localizations.localization_id = translates_by.localization_id
    INNER JOIN translates_ru ON localizations.localization_id = translates_ru.localization_id
    INNER JOIN translates_en ON localizations.localization_id = translates_en.localization_id;
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
    getAll,
  };
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

// SELECT *
// FROM localizations l
// INNER JOIN translates_by b ON l.localization_id = b.localization_id
// WHERE l.localization_id = b.localization_id


//SELECT * FROM localizations l, translates_by t_by, translates_en t_en WHERE t_by.localization_id = l.localization_id AND t_en.localization = l.localization_id;
const sendErr = (res, err) => {
  res.status(400).json({
    status: "failed",
    message: err.message
  });
  return;
}
const getAll = async (res) => {
    sql.query(`SELECT * FROM translations;
    `, (err, data) => {
      if (err) {
        sendErr(res, err)
      }

      console.log("data", data)

      const result = {
        en: {

        },
        ru: {

        },
        by: {
          
        }
      }

      data.map((row) => {
        console.log("-----------")
        console.log("row", row)
        const category = row.category

        console.log("category", category)
        const isCategoryExist = result.en.hasOwnProperty(category);
        if(!isCategoryExist) {
          result.en[category] = {}
          result.ru[category] = {}
          result.by[category] = {}

          addCategory(result, row)
        } 
        // else {
        //   addCategory(result, row)
        // }   
        console.log("isCategoryExist", isCategoryExist)
        console.log("-----------")
      })
      console.log("result", result)
      
  
      res.status(200).json({
        status: "success",
        data: result
      });
    });
  };

const addCategory = (result, row) => {
    // const isSubCategoryExist = result.en[row.category].hasOwnProperty(row.subcategory);
          // if(!isSubCategoryExist) {
            result.en[row.category] = row.en
            result.ru[row.category] = row.ru
            result.by[row.category] = row.by
          // }
} 

// UPDATE Customers
// SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
// WHERE CustomerID = 1;

// UPDATE translations
// SET '${locale}' = '${value}'
// WHERE category = '${category}' AND subcategory = '${subcategory};

// queryRow UPDATE translations
//   SET en = 'Abc'
//   WHERE category = 'home_title'

const updateLocalisation = async (locale, value, category, res) => {
  const queryRow = `UPDATE translations
  SET ${locale} = '${value}'
  WHERE category = '${category}'`
  console.log("queryRow", queryRow)
  sql.query(queryRow, (err, data) => {
    if (err) {
      sendErr(res, err)
    }
    console.log("data", data)
    res.status(200).json({
      status: "success",
    });


  });
}

module.exports = {
  getAll,
  updateLocalisation,
};
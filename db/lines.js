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
// FROM stations
// WHERE JOIN translates_by ON localizations.localization_id = translates_by.localization_id;

// SELECT U.UserID, U.Name, Roles.RoleID, Roles.RoleName  
// FROM [dbo].[User] as U 
// INNER JOIN [dbo].UserRole as UR ON UR.UserID=U.UserID 
// INNER JOIN [dbo].RoleMaster as Roles ON Roles.RoleID=UR.RoleMasterID
// FOR JSON AUTO

// SELECT *
//     FROM metro_line
//     JOIN stations ON metro_line.line_id = stations.line_id;

// SELECT *
//     FROM stations
//     JOIN metro_line ON stations.line_id = metro_line.line_id

// SELECT *, 
//        Stations = (SELECT *
//                         FROM stations S
//                         WHERE S.line_id = L.line_id)
//   FROM metro_line L

// SELECT 
//   *, 
//   (SELECT * FROM stations S WHERE S.line_id = L.line_id) AS roles
// FROM metro_line AS L

// SELECT L.line_id,
//     (SELECT S.line_id FROM stations S
//       WHERE L.line_id = S.line_id
//     ) AS Stations
//     FROM metro_line as L 

// SELECT station_name, metro_line.line_id 
//     FROM metro_line, stations 
//     WHERE metro_line.line_id = stations.line_id GROUP BY metro_line.line_id;

function isLineExists(line, line_id) {
  console.log("line", line)
  console.log("line.line_id", line.line_id)
  console.log("line_id", line_id)
  return line.line_id === line_id;
}

const getAll = async (res) => {
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

      let sorted = []

      data.map((row) => {
        console.log("row", row)
        // const isLineAlreadyExists = sorted.find((el) => {
        //   const result = isLineExists(el, row.line_id)
        //   console.log("row", row)
        //   return result 
        // })

        const foundLine = sorted.find(({ line_id }) => line_id === row.line_id);
        
        
      
        if (foundLine) {
          console.log("foundLine", foundLine);
          const station = {
            station_id: row.station_id,
            station_name: row.station_name,
            station_description: row.station_description,
            station_picture: row.station_picture
          }
          foundLine.stations.push(station)
        } else {
          const line = {
            line_id: row.line_id,
            line_name: row.line_name,
            line_description: row.line_description,
            line_picture: row.line_picture,
            stations: [
              {
                station_id: row.station_id,
                station_name: row.station_name,
                station_description: row.station_description,
                station_picture: row.station_picture
              }
            ]
          }
          sorted.push(line)
        }
        

        // sorted.
      })
      console.log("sorted", sorted)

      res.status(200).json({
        status: "success",
        data: sorted
      });
    });
  };

  module.exports = {
    getAll,
  };
const mysql = require("mysql");
const dbConfig = require("./config.js");

// Соединение с базой данных
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

// открытие соединения MySQL
connection.connect((error) => {
  if (error) throw error;
  console.log("Успешное подключение к базе данных");
});

module.exports = connection;

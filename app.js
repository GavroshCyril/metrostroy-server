// подключение пакетов
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const localizationRouter = require("./routes/localization");
const lineRouter = require("./routes/line");
const reviewsRouter = require("./routes/reviews");
const stationRouter = require("./routes/station");
const app = express();
const cors = require("cors");

const whitelist = ["http://localhost:3001", "http://localhost:3002"]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))


require("dotenv").config();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/localization", localizationRouter);
app.use("/line", lineRouter);
app.use("/station", stationRouter);
app.use("/reviews", reviewsRouter);

// вызвать 404 оишбку в случае ошибки  (catch 404 and forward to error handler)
app.use(function (req, res, next) {
  next(createError(404));
});

// обработчик ошибок
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // визуализировать страницу ошибки
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

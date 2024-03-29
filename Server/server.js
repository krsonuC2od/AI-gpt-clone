const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/connection");
const PORT = process.env.PORT || 9090;
const errorHandler = require("./middelwares/errorMiddleware");
const authRoutes = require("./routes/authRoutes");

// config dotenv
dotenv.config();

// connect mongoose

connectDB();

//app object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(errorHandler);

//Api Routes
app.use("/api/v1/auth", authRoutes);
//listen app
app.listen(PORT, () => {
  console.log(
    `server is running in ${process.env.Dev_mode} mode on port no : ${PORT}`
      .bgCyan.white
  );
});

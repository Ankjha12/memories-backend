const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const postRoutes = require("./routes/post");
const userRoutes = require("./routes/users.js");

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello Form Memories API v3 of the memories app");
});
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedtopology: true,
  })
  .then(() => {
    console.log("mOngodb connection is Successfull");
    app.listen(PORT, () => {
      console.log(`Server Started at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("There are some error occured in the Connection", error);
  });

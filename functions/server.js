const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(express.json()); // allow requests of content type - application/json
app.use(express.urlencoded({extended: true}));
// allow requests of contenttype - application/x-www-form-urlencoded
const db = require("./models");
console.log(db);
db.sequelize.sync({force: true}).then(()=>{
  console.log("Drop and re-synch db.");
})
    .catch(()=>{
      console.error("Database cannot be dropped");
    });
// route example
app.get("/", (req, res) => {
  res.json({message: "Welcome to hunter's sample application"});
});

// listen to requests
const PORT = process.env.PORT || 8080;
require("./routes/user.routes")(app);
app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});
// eslint-disable-next-line no-undef
exports.app = functions.https.onRequest(app);

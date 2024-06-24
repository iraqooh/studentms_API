// import modules

// building REST APIs
const express = require("express");

// helps to parse the json requests and create request objects
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extendend: true }));

// importing models
const db = require("./models");

db.sequelize_config.sync(
    {force: false}
).then(
    () => { console.log("DB synchronised")}
);

// API Routes

// import student routes
require("./routes/madiland.routes")(app);

// define port for project
const PORT = 7076;

// Monitor when server starts
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});


// import modules

// REST API tool for HTTP requests + responses
const express = require("express");

// Incoming request parser with data payloads (JSON, URL-encoded or multipart/form-data)
const bodyparser = require("body-parser");

const app = express();

// enable application to parse requests with 
// content-type - application/json
app.use(bodyparser.json());

// content-type - application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: true }));

// import database object containing sequelize instance with db configurations
const db = require("./models")

// synchronize the database models with the database schema
db.sequelize_config.sync({
    force: false // do not to drop and recreate the tables. 
    // If set to true, it will drop the tables first
}).then(() => {
    console.log("--- DB synchronization success! ---");
});

// API route definitions
app.get("/home", (req, res) => {
    res.json({
        "status": "OK",
        "status_code": 100,
        "message": "Welcome to Student MS"
    });
});

app.post("/data", (req, res) => {
    const name = req.body.name;

    if (!name) {
        res.json({
            "error": "No data received!"
        });
    } else {
        res.json({
            "status": "OK",
            "status_code": 101,
            "message": "Data received",
            "data": `Name: ${name}`
        });
    }
});

app.post("/calculate", (req, res) => {
    const operand1 = req.body.operand_1;
    const operand2 = req.body.operand_2;
    const operator = req.body.operator;

    let result = 0.0;

    switch(operator) {
        case "+":
            result = operand1 + operand2;
            break;
        case "-":
            result = operand1 - operand2;
            break;
        case "*":
            result = operand1 * operand2;
            break;
        case "/":
            result = operand1 / operand2;
            break;
        case "%":
            result = operand1 % operand2;
            break;
        case "^":
            result = Math.pow(operand1, operand2);
            break;
        case "sqrt":
            result = Math.sqrt(operand1);
            break;
        default:
            result = null;
    }

    res.json({
        "output": result
    });
});

app.get("/calculate", (req, res) => {
    const operand1 = parseFloat(req.query.operand_1);
    const operator = req.query.operator;
    const operand2 = parseFloat(req.query.operand_2);

    let result = 0.0;

    switch(operator) {
        case "+":
            result = operand1 + operand2;
            break;
        case "-":
            result = operand1 - operand2;
            break;
        case "*":
            result = operand1 * operand2;
            break;
        case "/":
            result = operand1 / operand2;
            break;
        case "%":
            result = operand1 % operand2;
            break;
        case "^":
            result = Math.pow(operand1, operand2);
            break;
        case "sqrt":
            result = Math.sqrt(operand1);
            break;
        default:
            result = null;
    }

    res.json({
        "output": result
    });
});

// import route function and pass the instance of the server as an argument
require("./routes/student.routes")(app);

// port specification
const PORT = 8081;

// start server
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});


// import the database configuration details
const dbConfig = require("../config/db.config.js");

// import the Sequelize library
// an ORM (Object-Relational Mapper) that provides an abstraction over SQL databases
const sequelize = require("sequelize");

// create a new Sequelize instance using the database configuration
const sequelize_config = new sequelize(
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        }
    }
);

// authenticate or test the connection to the database
sequelize_config.authenticate().then(() => {
    console.log("\n*** Connection establised successfully. ***\n");
}).catch((error) => {
    console.log("Database connection failure: ", error);
});

// create a db object to store the Sequelize instance and 
// configuration to be exported later
const db = {};

// store the sequelize library
db.sequelize = sequelize;

// store the instance of the configured sequelize
db.sequelize_config = sequelize_config;

// store the import of student model and 
// call the function with the sequelize instance & library as args
// This is a pattern often used in Sequelize models
db.students = require("./student.model.js")(sequelize, sequelize_config)
db.student_finances = require("./student_finance.model.js")(sequelize, sequelize_config)

// finally, export the db object for use in other parts of the application
module.exports = db;
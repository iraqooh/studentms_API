// import db config
const dbConfig = require("../config/db.config.js");

const sequelize = require("sequelize");
const sequelize_config = new sequelize(
    dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.dialect,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize_config.authenticate().then(
    console.log('Connection has been establised successfully.')
).catch((error) => {
    console.error('Unable to connect to the database: ', error)
});

const db = {};
db.sequelize = sequelize;
db.sequelize_config = sequelize_config;

db.students = require("./student.model.js")(sequelize_config, sequelize);
db.finances = require("./finance.model.js")(sequelize_config, sequelize);
db.payments = require("./payment.model.js")(sequelize_config, sequelize);
// ----------------------------------------------------------------
db.instructors = require("./instructor.model.js")(sequelize_config, sequelize);
db.courses = require("./course.model.js")(sequelize_config, sequelize);
// ----------------------------------------------------------------
db.books = require("./book.model.js")(sequelize_config, sequelize);
db.rentals = require("./rental.model.js")(sequelize_config, sequelize);

// ----------------------------------------------------------------

db.prefects = require("./prefect.model.js")(sequelize_config, sequelize);

db.students.hasOne(db.finances, {
    foreignKey: `student_id`,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

db.finances.belongsTo(db.students, {
    foreignKey: `student_id`
});

db.students.hasMany(db.payments, {
    foreignKey: `student_id`,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

db.payments.belongsTo(db.students, {
    foreignKey: `student_id`
});

db.instructors.hasMany(db.courses, {
    foreignKey: `instructor_id`,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

db.courses.belongsTo(db.instructors, {
    foreignKey: `instructor_id`
});

db.rentals.belongsTo(db.books, { foreignKey: 'book_id' });
db.rentals.belongsTo(db.students, { foreignKey: 'student_id' });

db.prefects.belongsTo(db.students, {
    foreignKey: 'student_id',
    as: 'student'
})

db.finances.hasMany(db.payments, {
    foreignKey: 'student_id'
})

db.payments.belongsTo(db.finances, { foreignKey: 'student_id' });

module.exports = db;